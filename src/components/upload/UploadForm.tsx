import { useState, type FormEvent } from 'react'
import { CATEGORIES, STYLES, UPLOAD_LIMITS } from '../../config/iconMeta'
import { formatBytes, parseTags, toKebabCase } from '../../lib/format'
import { normalizeColors, sanitizeSvg, usesCurrentColor } from '../../lib/svg'
import {
  validateSvgFile,
  validateSvgMarkup,
  validateUploadForm,
  type UploadFormErrors,
} from '../../lib/validation'
import { errorMessage, iconService } from '../../services'
import type { Icon, IconCategory, IconStyle } from '../../types/icon'
import { SvgRenderer } from '../icons/SvgRenderer'
import { Button } from '../ui/Button'
import { UiIcon } from '../ui/UiIcon'
import { Dropzone } from './Dropzone'
import { inputClasses } from '../ui/buttonStyles'
import { FormField } from './FormField'

interface SelectedFile {
  fileName: string
  size: number
  /** Sanitised markup exactly as uploaded. */
  svg: string
}

export function UploadForm({ onUploaded }: { onUploaded: (icon: Icon) => void }) {
  const [file, setFile] = useState<SelectedFile | null>(null)
  const [recolorable, setRecolorable] = useState(true)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [style, setStyle] = useState<string>('custom')
  const [tagsInput, setTagsInput] = useState('')

  const [fileError, setFileError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const tags = parseTags(tagsInput)
  const svg = file ? (recolorable ? normalizeColors(file.svg) : file.svg) : null
  const values = { name, category, style, tags, svg }
  const savedName = toKebabCase(name)

  // Field errors appear after the first submit attempt, then update live as the user fixes them.
  const formErrors: UploadFormErrors = submitted ? validateUploadForm(values) : {}
  const svgError = fileError ?? formErrors.svg

  async function handleFile(selected: File) {
    setSubmitError(null)
    const sizeOrTypeError = validateSvgFile(selected)
    const text = sizeOrTypeError ? '' : await selected.text()
    const markupError = sizeOrTypeError ?? validateSvgMarkup(text)
    const clean = markupError ? null : sanitizeSvg(text)
    if (!clean) {
      // An invalid file replaces the previous selection, so the error and preview never disagree.
      setFile(null)
      setFileError(markupError ?? 'The SVG could not be processed.')
      return
    }

    setFile({ fileName: selected.name, size: selected.size, svg: clean })
    setFileError(null)
    // Suggest a name from the file name, but never overwrite what the user typed.
    if (!name) setName(toKebabCase(selected.name))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    setSubmitError(null)

    const errors = validateUploadForm(values)
    if (Object.keys(errors).length > 0 || !svg) return

    setSubmitting(true)
    try {
      const icon = await iconService.uploadIcon({
        name: savedName,
        category: category as IconCategory,
        style: style as IconStyle,
        tags,
        svg,
      })
      onUploaded(icon)
    } catch (error) {
      setSubmitError(errorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-10">
      {/* File + preview */}
      <div className="space-y-4">
        <Dropzone onFile={(f) => void handleFile(f)} error={svgError ?? undefined} hasFile={file !== null} />

        {file && svg && (
          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="grid grid-cols-[auto_1fr] items-center gap-4">
              <div className="bg-checker grid size-24 place-items-center rounded-xl border border-line text-brand-900">
                <SvgRenderer svg={svg} className="size-14" label="Uploaded icon preview" />
              </div>
              <div className="min-w-0 space-y-2">
                <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                  <UiIcon name="file" className="size-4 shrink-0 text-ink-subtle" />
                  <span className="truncate">{file.fileName}</span>
                </p>
                <p className="text-xs text-ink-subtle">{formatBytes(file.size)} · sanitised</p>
                <div className="flex gap-2 text-brand-900">
                  {[16, 24, 32].map((s) => (
                    <SvgRenderer key={s} svg={svg} size={s} />
                  ))}
                </div>
              </div>
            </div>
            <label className="mt-4 flex items-start gap-2.5 border-t border-line pt-4 text-sm">
              <input
                type="checkbox"
                checked={recolorable}
                onChange={(e) => setRecolorable(e.target.checked)}
                className="mt-0.5 size-4 accent-brand-900"
              />
              <span>
                <span className="font-medium">Make colour customisable</span>
                <span className="block text-xs text-ink-subtle">
                  Replaces fixed fill and stroke colours with <code className="font-mono">currentColor</code>.
                  Turn off for multi-colour artwork.
                  {!recolorable && !usesCurrentColor(file.svg) && ' This icon will keep its original colours.'}
                </span>
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <FormField
          id="icon-name"
          label="Icon name"
          error={formErrors.name}
          hint={
            savedName && savedName !== name ? (
              <>
                Saved as <code className="font-mono text-ink-muted">{savedName}</code>
              </>
            ) : (
              `Lowercase words separated by hyphens, ${UPLOAD_LIMITS.nameMinLength}–${UPLOAD_LIMITS.nameMaxLength} characters.`
            )
          }
        >
          <input
            id="icon-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. card-contactless"
            aria-invalid={Boolean(formErrors.name)}
            aria-describedby={formErrors.name ? 'icon-name-error' : 'icon-name-hint'}
            className={inputClasses(Boolean(formErrors.name))}
          />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="icon-category" label="Category" error={formErrors.category}>
            <select
              id="icon-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-invalid={Boolean(formErrors.category)}
              className={inputClasses(Boolean(formErrors.category))}
            >
              <option value="" disabled>
                Choose a category
              </option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="icon-style"
            label="Style"
            error={formErrors.style}
            hint={STYLES.find((s) => s.value === style)?.description}
          >
            <select
              id="icon-style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              aria-invalid={Boolean(formErrors.style)}
              className={inputClasses(Boolean(formErrors.style))}
            >
              {STYLES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField
          id="icon-tags"
          label="Tags"
          error={formErrors.tags}
          hint={`Separate with commas. Used by search. Up to ${UPLOAD_LIMITS.maxTags} tags.`}
        >
          <input
            id="icon-tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. payment, nfc, card"
            aria-invalid={Boolean(formErrors.tags)}
            aria-describedby={formErrors.tags ? 'icon-tags-error' : 'icon-tags-hint'}
            className={inputClasses(Boolean(formErrors.tags))}
          />
          {tags.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Tags preview">
              {tags.map((tag) => (
                <li key={tag} className="rounded-md bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                  #{tag}
                </li>
              ))}
            </ul>
          )}
        </FormField>

        {submitError && (
          <p role="alert" className="flex items-start gap-2 rounded-lg bg-danger-50 px-3 py-2.5 text-sm text-danger-700">
            <UiIcon name="alert" className="mt-0.5 size-4 shrink-0" />
            {submitError}
          </p>
        )}

        <div className="flex justify-end border-t border-line pt-5">
          <Button type="submit" variant="primary" icon="upload" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? 'Uploading…' : 'Upload icon'}
          </Button>
        </div>
      </div>
    </form>
  )
}

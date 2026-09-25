import { UPLOAD_LIMITS, isCategory, isStyle } from '../config/iconMeta'
import { formatBytes, toKebabCase } from './format'
import { hasDrawableContent, parseSvg } from './svg'

/**
 * Pure validation functions for the upload flow. They return error messages
 * instead of throwing, so the form can show them next to the right field.
 * A backend should repeat the same checks; never trust the client alone.
 */

export function validateSvgFile(file: File): string | null {
  const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')
  if (!isSvg) return `"${file.name}" is not an SVG file. Only .svg files can be uploaded.`
  if (file.size === 0) return 'The file is empty.'
  if (file.size > UPLOAD_LIMITS.maxFileSizeBytes) {
    return `The file is ${formatBytes(file.size)}. The maximum size is ${formatBytes(UPLOAD_LIMITS.maxFileSizeBytes)}.`
  }
  return null
}

export function validateSvgMarkup(markup: string): string | null {
  const parsed = parseSvg(markup)
  if (!parsed.ok) return parsed.error
  if (!hasDrawableContent(markup)) return 'The SVG does not contain any visible shapes.'
  return null
}

export interface UploadFormValues {
  name: string
  category: string
  style: string
  tags: string[]
  svg: string | null
}

export type UploadFormErrors = Partial<Record<keyof UploadFormValues, string>>

export function validateUploadForm(values: UploadFormValues): UploadFormErrors {
  const errors: UploadFormErrors = {}
  const name = toKebabCase(values.name)

  if (!values.svg) errors.svg = 'Choose an SVG file to upload.'

  if (!name) errors.name = 'Enter a name for the icon.'
  else if (name.length < UPLOAD_LIMITS.nameMinLength)
    errors.name = `The name must be at least ${UPLOAD_LIMITS.nameMinLength} characters.`
  else if (name.length > UPLOAD_LIMITS.nameMaxLength)
    errors.name = `The name must be at most ${UPLOAD_LIMITS.nameMaxLength} characters.`

  if (!isCategory(values.category)) errors.category = 'Choose a category.'
  if (!isStyle(values.style)) errors.style = 'Choose a style.'

  if (values.tags.length === 0) errors.tags = 'Add at least one tag so the icon can be found by search.'
  else if (values.tags.length > UPLOAD_LIMITS.maxTags)
    errors.tags = `Use at most ${UPLOAD_LIMITS.maxTags} tags.`

  return errors
}

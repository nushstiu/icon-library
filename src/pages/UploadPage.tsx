import { useState } from 'react'
import { Link } from 'react-router'
import { SvgRenderer } from '../components/icons/SvgRenderer'
import { Button } from '../components/ui/Button'
import { buttonClasses } from '../components/ui/buttonStyles'
import { UiIcon } from '../components/ui/UiIcon'
import { UploadForm } from '../components/upload/UploadForm'
import { categoryLabel, styleLabel } from '../config/iconMeta'
import { isMockMode } from '../services'
import type { Icon } from '../types/icon'

export function UploadPage() {
  const [uploaded, setUploaded] = useState<Icon | null>(null)
  // Changing the key remounts the form, which resets every field.
  const [formKey, setFormKey] = useState(0)

  return (
    <div>
      <section className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Upload an icon</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Add an SVG to the library. Files are validated and sanitised before they are saved.
          {isMockMode && ' In this MVP, uploads are stored in your browser.'}
        </p>
      </section>

      {uploaded ? (
        <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface p-8 text-center" role="status">
          <div className="mx-auto mb-5 grid size-24 place-items-center rounded-2xl bg-brand-50 text-brand-900">
            <SvgRenderer svg={uploaded.svg} className="size-12" />
          </div>
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-success-700">
            <UiIcon name="check" className="size-4" />
            Upload successful
          </p>
          <h2 className="mt-2 text-xl font-semibold">{uploaded.name}</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {categoryLabel(uploaded.category)} · {styleLabel(uploaded.style)} · now available in the library
          </p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <Link to={`/icons/${encodeURIComponent(uploaded.id)}`} className={buttonClasses('primary')}>
              View icon
            </Link>
            <Button
              icon="upload"
              onClick={() => {
                setUploaded(null)
                setFormKey((k) => k + 1)
              }}
            >
              Upload another
            </Button>
          </div>
        </div>
      ) : (
        <UploadForm key={formKey} onUploaded={setUploaded} />
      )}
    </div>
  )
}

import { useRef, useState, type DragEvent } from 'react'
import { UPLOAD_LIMITS } from '../../config/iconMeta'
import { formatBytes } from '../../lib/format'
import { UiIcon } from '../ui/UiIcon'

interface DropzoneProps {
  onFile: (file: File) => void
  error?: string
  hasFile: boolean
}

/** Click-to-browse and drag-and-drop area for a single SVG file. */
export function Dropzone({ onFile, error, hasFile }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(event: DragEvent) {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files[0]
    if (file) onFile(file)
  }

  const borderClass = error
    ? 'border-danger-600 bg-danger-50'
    : dragging
      ? 'border-accent-500 bg-accent-50'
      : 'border-line bg-surface hover:border-brand-200 hover:bg-brand-50/50'

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        aria-describedby="dropzone-hint"
        className={`flex w-full flex-col items-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${borderClass}`}
      >
        <span className="mb-3 grid size-11 place-items-center rounded-full bg-brand-50 text-brand-500">
          <UiIcon name="upload" className="size-5" />
        </span>
        <span className="text-sm font-medium text-ink">
          {dragging ? 'Drop the SVG here' : hasFile ? 'Choose a different file' : 'Drag an SVG here or click to browse'}
        </span>
        <span id="dropzone-hint" className="mt-1 text-xs text-ink-subtle">
          .svg only · max {formatBytes(UPLOAD_LIMITS.maxFileSizeBytes)}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".svg,image/svg+xml"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          // Allow selecting the same file again after fixing it.
          e.target.value = ''
        }}
      />
      {error && (
        <p role="alert" className="mt-2 flex items-start gap-1.5 text-xs text-danger-700">
          <UiIcon name="alert" className="mt-px size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

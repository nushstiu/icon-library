import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { CodeViewer } from '../components/details/CodeViewer'
import { CustomizePanel } from '../components/details/CustomizePanel'
import { PreviewStage, type PreviewBackground } from '../components/details/PreviewStage'
import { SvgRenderer } from '../components/icons/SvgRenderer'
import { EmptyState } from '../components/library/EmptyState'
import { Button } from '../components/ui/Button'
import { buttonClasses } from '../components/ui/buttonStyles'
import { useToast } from '../components/ui/toast/useToast'
import { UiIcon } from '../components/ui/UiIcon'
import { categoryLabel, styleLabel } from '../config/iconMeta'
import { useIcon } from '../hooks/useIcon'
import { DEFAULT_EXPORT, useIconActions } from '../hooks/useIconActions'
import { useIcons } from '../hooks/useIcons'
import { formatDate, toDisplayName } from '../lib/format'
import { customizeSvg, usesCurrentColor } from '../lib/svg'
import { errorMessage, iconService } from '../services'
import type { Icon } from '../types/icon'

export function IconDetailsPage() {
  const { id } = useParams()
  const state = useIcon(id)

  if (state.status === 'loading') return <DetailsSkeleton />

  if (state.status === 'not-found' || state.status === 'error') {
    return (
      <EmptyState
        icon="alert"
        title={state.status === 'error' ? 'The icon could not be loaded' : 'Icon not found'}
        description={
          state.error ?? 'This icon does not exist or has been deleted. It may have been uploaded in another browser.'
        }
        action={
          <Link to="/" className={buttonClasses('primary')}>
            Back to library
          </Link>
        }
      />
    )
  }

  // `key` resets the size/colour controls when navigating between icons.
  return <IconDetails key={state.icon.id} icon={state.icon} />
}

function IconDetails({ icon }: { icon: Icon }) {
  const navigate = useNavigate()
  const toast = useToast()
  const { copySvg, downloadSvg } = useIconActions()

  const [size, setSize] = useState(64)
  const [color, setColor] = useState(DEFAULT_EXPORT.color)
  const [background, setBackground] = useState<PreviewBackground>('light')
  const [deleting, setDeleting] = useState(false)

  const canRecolor = usesCurrentColor(icon.svg)
  const options = { size, color }
  const exportedSvg = useMemo(() => customizeSvg(icon.svg, { size, color }), [icon.svg, size, color])

  async function handleDelete() {
    if (!window.confirm(`Delete "${icon.name}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await iconService.deleteIcon(icon.id)
      toast.show(`Deleted ${icon.name}`, 'success')
      navigate('/')
    } catch (error) {
      toast.show(errorMessage(error), 'error')
      setDeleting(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-ink"
      >
        <UiIcon name="arrow-left" className="size-4" />
        Back to library
      </button>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10">
        {/* Left column: preview and customisation */}
        <div className="space-y-5">
          <PreviewStage svg={icon.svg} name={icon.name} size={size} color={color} background={background} />
          <div className="rounded-2xl border border-line bg-surface p-5">
            <CustomizePanel
              size={size}
              color={color}
              background={background}
              canRecolor={canRecolor}
              onSizeChange={setSize}
              onColorChange={setColor}
              onBackgroundChange={setBackground}
            />
          </div>
        </div>

        {/* Right column: information, actions and code */}
        <div className="min-w-0 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 font-medium text-brand-700">
                {categoryLabel(icon.category)}
              </span>
              <span className="rounded-full bg-accent-50 px-2.5 py-1 font-medium text-accent-700">
                {styleLabel(icon.style)}
              </span>
              {icon.source === 'uploaded' && (
                <span className="rounded-full border border-line px-2.5 py-1 font-medium text-ink-muted">
                  Uploaded
                </span>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{toDisplayName(icon.name)}</h1>
            <p className="mt-1 font-mono text-sm text-ink-muted">{icon.name}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="primary" icon="copy" onClick={() => void copySvg(icon, options)}>
              Copy SVG
            </Button>
            <Button icon="download" onClick={() => downloadSvg(icon, options)}>
              Download SVG
            </Button>
            {icon.source === 'uploaded' && (
              <Button variant="danger" icon="trash" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </Button>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-line bg-surface p-5 text-sm">
            <div>
              <dt className="text-xs text-ink-subtle">Category</dt>
              <dd className="mt-0.5 font-medium">{categoryLabel(icon.category)}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-subtle">Style</dt>
              <dd className="mt-0.5 font-medium">{styleLabel(icon.style)}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-subtle">Date added</dt>
              <dd className="mt-0.5 font-medium">{formatDate(icon.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-subtle">File name</dt>
              <dd className="mt-0.5 truncate font-mono text-xs font-medium">
                {icon.name}-{icon.style}.svg
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-ink-subtle">Tags</dt>
              <dd className="mt-1.5 flex flex-wrap gap-1.5">
                {icon.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/?q=${encodeURIComponent(tag)}`}
                    className="rounded-md bg-canvas px-2 py-1 text-xs text-ink-muted hover:bg-brand-50 hover:text-brand-700"
                  >
                    #{tag}
                  </Link>
                ))}
              </dd>
            </div>
          </dl>

          <OtherStyles icon={icon} />

          <section>
            <h2 className="mb-2 text-xs font-semibold tracking-wider text-ink-subtle uppercase">Code</h2>
            <CodeViewer svg={exportedSvg} onCopy={(code) => void copySvg(icon, options, code)} />
          </section>
        </div>
      </div>
    </div>
  )
}

/** Links to the same icon drawn in other styles (e.g. wallet → Linear / Two-tone / Bulk). */
function OtherStyles({ icon }: { icon: Icon }) {
  const { icons } = useIcons({ search: icon.name })
  const variants = icons.filter((i) => i.name === icon.name)
  if (variants.length < 2) return null

  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold tracking-wider text-ink-subtle uppercase">Available styles</h2>
      <ul className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const active = variant.id === icon.id
          return (
            <li key={variant.id}>
              <Link
                to={`/icons/${encodeURIComponent(variant.id)}`}
                replace
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  active
                    ? 'border-brand-900 bg-brand-900 text-white'
                    : 'border-line bg-surface text-ink-muted hover:border-brand-200 hover:text-ink'
                }`}
              >
                <SvgRenderer svg={variant.svg} className="size-5" />
                {styleLabel(variant.style)}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function DetailsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading icon" className="grid animate-pulse gap-6 lg:grid-cols-2 lg:gap-10">
      <div className="aspect-[4/3] rounded-2xl bg-line/60" />
      <div className="space-y-4">
        <div className="h-6 w-32 rounded bg-line/60" />
        <div className="h-9 w-56 rounded bg-line/60" />
        <div className="h-10 w-72 rounded bg-line/60" />
        <div className="h-40 rounded-2xl bg-line/60" />
      </div>
    </div>
  )
}

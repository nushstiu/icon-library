import { memo } from 'react'
import { Link } from 'react-router'
import { styleLabel } from '../../config/iconMeta'
import type { Icon } from '../../types/icon'
import { UiIcon } from '../ui/UiIcon'
import { SvgRenderer } from './SvgRenderer'

interface IconCardProps {
  icon: Icon
  onCopy: (icon: Icon) => void
  onDownload: (icon: Icon) => void
}

/**
 * A grid tile. The whole card links to the details page; the copy/download
 * buttons sit above that link (z-10) because a <button> may not be nested in an <a>.
 */
export const IconCard = memo(function IconCard({ icon, onCopy, onDownload }: IconCardProps) {
  return (
    <li className="group relative flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-line bg-surface p-3 text-ink transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md hover:shadow-brand-900/5 focus-within:border-accent-500">
      <SvgRenderer svg={icon.svg} className="size-8 transition-transform group-hover:scale-110" />
      <span className="w-full text-center leading-tight">
        <span className="block truncate text-xs text-ink-muted group-hover:text-ink">{icon.name}</span>
        <span className="block text-[10px] text-ink-subtle">{styleLabel(icon.style)}</span>
      </span>

      <Link
        to={`/icons/${encodeURIComponent(icon.id)}`}
        className="absolute inset-0 rounded-xl focus-visible:outline-accent-500"
        aria-label={`${icon.name}, ${styleLabel(icon.style)}. Open details`}
      />

      {icon.source === 'uploaded' && (
        <span className="absolute top-2 left-2 rounded bg-accent-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-accent-700 uppercase">
          New
        </span>
      )}

      {/* Quick actions: shown on hover/focus with a mouse, hidden on touch where tapping opens details. */}
      <div className="absolute top-1.5 right-1.5 z-10 hidden gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:hover)]:flex">
        <button
          type="button"
          onClick={() => onCopy(icon)}
          className="grid size-7 place-items-center rounded-md bg-brand-50 text-brand-700 hover:bg-brand-900 hover:text-white"
          title="Copy SVG"
          aria-label={`Copy ${icon.name} SVG`}
        >
          <UiIcon name="copy" className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDownload(icon)}
          className="grid size-7 place-items-center rounded-md bg-brand-50 text-brand-700 hover:bg-brand-900 hover:text-white"
          title="Download SVG"
          aria-label={`Download ${icon.name} SVG`}
        >
          <UiIcon name="download" className="size-3.5" />
        </button>
      </div>
    </li>
  )
})

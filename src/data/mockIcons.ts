import type { Icon, IconStyle } from '../types/icon'
import { ICON_DRAWINGS, type IconDrawing } from './iconGeometry'

/**
 * Builds the built-in mock icon collection.
 *
 * The output is a flat list of `Icon` records, the same shape an API would
 * return, so the rest of the app has no idea this data was generated locally.
 */

const SVG_OPEN =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'

function renderSvg(drawing: IconDrawing, style: IconStyle): string {
  const paths = drawing.parts.map((part) => {
    if (style === 'twotone' && part.accent) return `<path d="${part.d}" opacity=".4"/>`
    if (style === 'bulk' && part.body) {
      return `<path d="${part.d}" fill="currentColor" stroke="none" opacity=".25"/><path d="${part.d}"/>`
    }
    return `<path d="${part.d}"/>`
  })
  return `${SVG_OPEN}${paths.join('')}</svg>`
}

/** Only generate a style if it would actually look different from Linear. */
function stylesFor(drawing: IconDrawing): IconStyle[] {
  const styles: IconStyle[] = ['linear']
  if (drawing.parts.some((p) => p.accent)) styles.push('twotone')
  if (drawing.parts.some((p) => p.body)) styles.push('bulk')
  return styles
}

/** Spread "date added" over the last months so date sorting is meaningful. */
const BASE_DATE = Date.UTC(2026, 3, 1)
const DAY_MS = 24 * 60 * 60 * 1000

export const MOCK_ICONS: Icon[] = ICON_DRAWINGS.flatMap((drawing, index) =>
  stylesFor(drawing).map((style) => ({
    id: `${drawing.name}-${style}`,
    name: drawing.name,
    category: drawing.category,
    style,
    svg: renderSvg(drawing, style),
    tags: drawing.tags,
    createdAt: new Date(BASE_DATE + index * 3 * DAY_MS).toISOString(),
    source: 'library' as const,
  })),
)

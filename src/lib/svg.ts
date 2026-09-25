/**
 * SVG helpers: parsing, sanitising, recolouring and exporting.
 *
 * Uploaded SVG is untrusted input. It is rendered with innerHTML, so anything
 * that can run script or load external resources is stripped before it is
 * stored or displayed.
 */

const FORBIDDEN_ELEMENTS = [
  'script',
  'foreignObject',
  'iframe',
  'object',
  'embed',
  'audio',
  'video',
  'style',
  'animate',
  'set',
  'animateMotion',
  'animateTransform',
]

const EXTERNAL_URL = /url\s*\(\s*['"]?\s*(?!#)/i

export type ParseResult = { ok: true; root: SVGSVGElement } | { ok: false; error: string }

export function parseSvg(markup: string): ParseResult {
  const doc = new DOMParser().parseFromString(markup, 'image/svg+xml')
  if (doc.getElementsByTagName('parsererror').length > 0) {
    return { ok: false, error: 'The file is not valid SVG/XML and could not be read.' }
  }
  const root = doc.documentElement
  if (root.nodeName.toLowerCase() !== 'svg') {
    return { ok: false, error: 'The file does not have an <svg> root element.' }
  }
  return { ok: true, root: root as unknown as SVGSVGElement }
}

function serialize(root: Element): string {
  return new XMLSerializer().serializeToString(root)
}

/** Removes script, event handlers and external references. Returns null if unparseable. */
export function sanitizeSvg(markup: string): string | null {
  const parsed = parseSvg(markup)
  if (!parsed.ok) return null
  const { root } = parsed

  for (const tag of FORBIDDEN_ELEMENTS) {
    for (const el of Array.from(root.getElementsByTagName(tag))) el.remove()
  }

  for (const el of [root, ...Array.from(root.querySelectorAll('*'))]) {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase()
      const value = attr.value.trim()
      const isHandler = name.startsWith('on')
      const isExternalHref = (name === 'href' || name === 'xlink:href') && !value.startsWith('#')
      const isExternalUrl = EXTERNAL_URL.test(value)
      if (isHandler || isExternalHref || isExternalUrl) el.removeAttribute(attr.name)
    }
  }

  // A viewBox is required for the icon to scale to any preview size.
  if (!root.hasAttribute('viewBox')) {
    const width = parseFloat(root.getAttribute('width') ?? '')
    const height = parseFloat(root.getAttribute('height') ?? '')
    if (width > 0 && height > 0) root.setAttribute('viewBox', `0 0 ${width} ${height}`)
  }

  return serialize(root)
}

/** True if the SVG contains at least one element that draws something. */
export function hasDrawableContent(markup: string): boolean {
  const parsed = parseSvg(markup)
  if (!parsed.ok) return false
  return (
    parsed.root.querySelector('path, circle, rect, ellipse, line, polyline, polygon, text, use, image') !==
    null
  )
}

export function usesCurrentColor(markup: string): boolean {
  return /currentColor/i.test(markup)
}

const KEEP_COLOR = new Set(['none', 'currentcolor', 'transparent', 'inherit'])

/**
 * Replaces hard-coded fill/stroke colours with `currentColor` so an uploaded
 * icon can be recoloured like the built-in ones.
 */
export function normalizeColors(markup: string): string {
  const parsed = parseSvg(markup)
  if (!parsed.ok) return markup
  const { root } = parsed

  for (const el of [root, ...Array.from(root.querySelectorAll('*'))]) {
    for (const attr of ['fill', 'stroke']) {
      const value = el.getAttribute(attr)?.trim().toLowerCase()
      if (value && !KEEP_COLOR.has(value) && !value.startsWith('url(')) {
        el.setAttribute(attr, 'currentColor')
      }
    }
  }
  // Without an explicit fill, shapes default to black; make that default follow the colour too.
  if (!root.hasAttribute('fill')) root.setAttribute('fill', 'currentColor')

  return serialize(root)
}

export const INHERIT_COLOR = 'currentColor'

/**
 * Produces the exact SVG a user copies or downloads at a fixed size.
 * With `INHERIT_COLOR` the icon keeps `currentColor` and follows the CSS `color`
 * of wherever it is pasted; any other value bakes that colour into the file.
 */
export function customizeSvg(markup: string, options: { size: number; color: string }): string {
  const parsed = parseSvg(markup)
  if (!parsed.ok) return markup
  const { root } = parsed
  root.setAttribute('width', String(options.size))
  root.setAttribute('height', String(options.size))
  const svg = serialize(root)
  return options.color === INHERIT_COLOR ? svg : svg.replace(/currentColor/gi, options.color)
}

/** Converts SVG markup into JSX-compatible markup for pasting into a React component. */
export function svgToJsx(markup: string): string {
  return markup
    .replace(/\sclass=/g, ' className=')
    .replace(/\sxlink:href=/g, ' xlinkHref=')
    .replace(/\s([a-z]+(?:-[a-z]+)+)=/g, (match, attr: string) =>
      // data-* and aria-* attributes stay kebab-case in JSX.
      /^(data|aria)-/.test(attr)
        ? match
        : ` ${attr.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase())}=`,
    )
}

/** Adds line breaks between tags so source code is readable in the code viewer. */
export function prettifySvg(markup: string): string {
  let depth = 0
  return markup
    .replace(/>\s*</g, '>\n<')
    .split('\n')
    .map((line) => {
      if (line.startsWith('</')) depth = Math.max(depth - 1, 0)
      const indented = '  '.repeat(depth) + line
      if (!line.startsWith('</') && !line.endsWith('/>') && !line.includes('</')) depth += 1
      return indented
    })
    .join('\n')
}

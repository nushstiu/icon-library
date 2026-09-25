interface SvgRendererProps {
  /** Sanitised SVG markup (sanitised by the service layer before it reaches the UI). */
  svg: string
  className?: string
  /** Applied as CSS `color`, which every `currentColor` in the icon follows. */
  color?: string
  /** Exact pixel size. When omitted, size comes from `className`. */
  size?: number
  label?: string
}

/**
 * Renders raw SVG markup inline so `currentColor` works and the icon can be recoloured.
 * An <img> tag would be safer for untrusted markup but cannot be recoloured,
 * which is why all SVG passes through `sanitizeSvg` first.
 */
export function SvgRenderer({ svg, className = 'size-6', color, size, label }: SvgRendererProps) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`svg-fill inline-block shrink-0 ${className}`}
      style={{ color, width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

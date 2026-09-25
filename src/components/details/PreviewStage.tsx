import { SvgRenderer } from '../icons/SvgRenderer'

export type PreviewBackground = 'light' | 'dark' | 'checker'

const BACKGROUNDS: Record<PreviewBackground, string> = {
  light: 'bg-surface',
  dark: 'bg-brand-900',
  checker: 'bg-checker',
}

interface PreviewStageProps {
  svg: string
  name: string
  size: number
  color: string
  background: PreviewBackground
}

/** Large preview area. The icon is drawn at the exact pixel size that will be exported. */
export function PreviewStage({ svg, name, size, color, background }: PreviewStageProps) {
  // "Inherit" previews in a colour that stays visible on the chosen background.
  const previewColor = color === 'currentColor' ? (background === 'dark' ? '#ffffff' : '#0f1c2e') : color

  return (
    <div
      className={`relative grid aspect-square w-full place-items-center overflow-hidden rounded-2xl border border-line sm:aspect-[4/3] ${BACKGROUNDS[background]}`}
    >
      <SvgRenderer
        svg={svg}
        size={size}
        color={previewColor}
        label={`${name} icon preview`}
        className="max-h-[85%] max-w-[85%]"
      />
      <span
        className={`absolute right-3 bottom-3 rounded-md px-2 py-1 font-mono text-[11px] ${
          background === 'dark' ? 'bg-white/10 text-brand-100' : 'bg-canvas text-ink-muted'
        }`}
      >
        {size} × {size}px
      </span>
    </div>
  )
}

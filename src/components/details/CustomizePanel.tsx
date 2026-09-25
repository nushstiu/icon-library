import { INHERIT_COLOR } from '../../lib/svg'
import type { PreviewBackground } from './PreviewStage'

const SIZE_PRESETS = [16, 20, 24, 32, 48, 64, 96]
export const MIN_SIZE = 12
export const MAX_SIZE = 256

const COLOR_PRESETS = [
  { value: '#0b2545', label: 'Navy' },
  { value: '#1d4f91', label: 'Blue' },
  { value: '#0d9488', label: 'Teal' },
  { value: '#16a34a', label: 'Green' },
  { value: '#dc2626', label: 'Red' },
  { value: '#5b6b80', label: 'Grey' },
]

const BACKGROUND_OPTIONS: { value: PreviewBackground; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'checker', label: 'Transparent' },
]

interface CustomizePanelProps {
  size: number
  color: string
  background: PreviewBackground
  /** False for uploaded icons with hard-coded colours, where recolouring has no effect. */
  canRecolor: boolean
  onSizeChange: (size: number) => void
  onColorChange: (color: string) => void
  onBackgroundChange: (background: PreviewBackground) => void
}

export function CustomizePanel(props: CustomizePanelProps) {
  const { size, color, background, canRecolor } = props
  const isCustomColor = color !== INHERIT_COLOR && !COLOR_PRESETS.some((c) => c.value === color)

  return (
    <div className="space-y-5">
      <fieldset>
        <div className="mb-2 flex items-center justify-between">
          <legend className="text-xs font-semibold tracking-wider text-ink-subtle uppercase">Size</legend>
          <label className="flex items-center gap-1 text-xs text-ink-muted">
            <input
              type="number"
              min={MIN_SIZE}
              max={MAX_SIZE}
              value={size}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (Number.isFinite(value)) props.onSizeChange(Math.min(Math.max(value, MIN_SIZE), MAX_SIZE))
              }}
              aria-label="Size in pixels"
              className="h-7 w-16 rounded-md border border-line bg-surface px-2 text-right font-mono text-xs text-ink focus:border-accent-500 focus:outline-none"
            />
            px
          </label>
        </div>
        <input
          type="range"
          min={MIN_SIZE}
          max={MAX_SIZE}
          value={size}
          onChange={(e) => props.onSizeChange(Number(e.target.value))}
          aria-label="Size slider"
          className="w-full accent-brand-900"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SIZE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => props.onSizeChange(preset)}
              aria-pressed={size === preset}
              className={`h-7 rounded-md px-2.5 font-mono text-[11px] transition-colors ${
                size === preset
                  ? 'bg-brand-900 text-white'
                  : 'border border-line bg-surface text-ink-muted hover:text-ink'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset disabled={!canRecolor} className="disabled:opacity-50">
        <legend className="mb-2 text-xs font-semibold tracking-wider text-ink-subtle uppercase">Colour</legend>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => props.onColorChange(INHERIT_COLOR)}
            aria-pressed={color === INHERIT_COLOR}
            title="Keep currentColor so the icon inherits the text colour where it is used"
            className={`h-8 rounded-full border px-3 text-xs font-medium ${
              color === INHERIT_COLOR
                ? 'border-brand-900 bg-brand-900 text-white'
                : 'border-line bg-surface text-ink-muted hover:text-ink'
            }`}
          >
            currentColor
          </button>
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => props.onColorChange(preset.value)}
              aria-pressed={color === preset.value}
              aria-label={preset.label}
              title={`${preset.label} ${preset.value}`}
              className={`size-8 rounded-full border-2 transition-transform hover:scale-110 ${
                color === preset.value ? 'border-accent-500 ring-2 ring-accent-500/25' : 'border-white shadow-sm'
              }`}
              style={{ backgroundColor: preset.value }}
            />
          ))}
          <label
            title="Custom colour"
            className={`relative grid size-8 cursor-pointer place-items-center overflow-hidden rounded-full border-2 bg-[conic-gradient(red,yellow,lime,aqua,blue,magenta,red)] ${
              isCustomColor ? 'border-accent-500 ring-2 ring-accent-500/25' : 'border-white shadow-sm'
            }`}
          >
            <input
              type="color"
              value={color === INHERIT_COLOR ? '#0b2545' : color}
              onChange={(e) => props.onColorChange(e.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
              aria-label="Custom colour"
            />
          </label>
        </div>
        <p className="mt-2 font-mono text-[11px] text-ink-subtle">
          {canRecolor
            ? color === INHERIT_COLOR
              ? 'Inherits the CSS text colour'
              : color.toUpperCase()
            : 'This icon uses its own fixed colours'}
        </p>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-xs font-semibold tracking-wider text-ink-subtle uppercase">
          Preview background
        </legend>
        <div className="inline-flex rounded-lg border border-line bg-surface p-1">
          {BACKGROUND_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => props.onBackgroundChange(option.value)}
              aria-pressed={background === option.value}
              className={`h-7 rounded-md px-3 text-xs font-medium ${
                background === option.value ? 'bg-brand-900 text-white' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  )
}

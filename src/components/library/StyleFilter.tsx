import { STYLES } from '../../config/iconMeta'
import type { IconStyle } from '../../types/icon'

interface StyleFilterProps {
  value: IconStyle | 'all'
  onChange: (value: IconStyle | 'all') => void
}

const OPTIONS: { value: IconStyle | 'all'; label: string; description?: string }[] = [
  { value: 'all', label: 'All' },
  ...STYLES,
]

/** Segmented control for the icon style. */
export function StyleFilter({ value, onChange }: StyleFilterProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Icon style"
      className="inline-flex max-w-full overflow-x-auto rounded-lg border border-line bg-surface p-1 [scrollbar-width:none]"
    >
      {OPTIONS.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={option.description}
            onClick={() => onChange(option.value)}
            className={`h-8 rounded-md px-3 text-xs font-medium whitespace-nowrap transition-colors ${
              active ? 'bg-brand-900 text-white shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

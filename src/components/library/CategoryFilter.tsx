import { CATEGORIES } from '../../config/iconMeta'
import type { IconCategory } from '../../types/icon'

interface CategoryFilterProps {
  value: IconCategory | 'all'
  onChange: (value: IconCategory | 'all') => void
  /** "sidebar" is a vertical list for large screens; "chips" scrolls horizontally on small ones. */
  variant: 'sidebar' | 'chips'
}

const OPTIONS: { value: IconCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All icons' },
  ...CATEGORIES,
]

export function CategoryFilter({ value, onChange, variant }: CategoryFilterProps) {
  if (variant === 'sidebar') {
    return (
      <nav aria-label="Categories">
        <h2 className="mb-2 px-3 text-xs font-semibold tracking-wider text-ink-subtle uppercase">
          Categories
        </h2>
        <ul className="space-y-0.5">
          {OPTIONS.map((option) => {
            const active = option.value === value
            return (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => onChange(option.value)}
                  aria-current={active ? 'true' : undefined}
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    active
                      ? 'bg-brand-900 font-medium text-white'
                      : 'text-ink-muted hover:bg-brand-50 hover:text-ink'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }

  return (
    <nav aria-label="Categories" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
      <ul className="flex w-max gap-2">
        {OPTIONS.map((option) => {
          const active = option.value === value
          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => onChange(option.value)}
                aria-current={active ? 'true' : undefined}
                className={`h-8 rounded-full border px-3.5 text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'border-brand-900 bg-brand-900 text-white'
                    : 'border-line bg-surface text-ink-muted hover:border-brand-200 hover:text-ink'
                }`}
              >
                {option.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

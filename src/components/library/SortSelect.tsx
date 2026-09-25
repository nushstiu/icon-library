import { SORT_OPTIONS, isSortOption } from '../../config/iconMeta'
import type { SortOption } from '../../types/icon'

interface SortSelectProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className="flex items-center gap-2 text-xs text-ink-muted">
      <span className="hidden sm:inline">Sort by</span>
      <select
        value={value}
        onChange={(e) => {
          if (isSortOption(e.target.value)) onChange(e.target.value)
        }}
        aria-label="Sort icons"
        className="h-10 rounded-lg border border-line bg-surface px-3 text-xs font-medium text-ink focus:border-accent-500 focus:outline-none"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

import { useEffect, useRef } from 'react'
import { UiIcon } from '../ui/UiIcon'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

/** Search input. Press "/" anywhere on the page to focus it, Escape to clear it. */
export function SearchBar({ value, onChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      if (event.key === '/' && !isTyping) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="relative">
      <UiIcon
        name="search"
        className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink-subtle"
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onChange('')
        }}
        placeholder="Search icons by name, tag or category"
        aria-label="Search icons"
        className="h-12 w-full rounded-xl border border-line bg-surface pr-20 pl-11 text-sm shadow-sm placeholder:text-ink-subtle focus:border-accent-500 focus:ring-4 focus:ring-accent-500/15 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange('')
              inputRef.current?.focus()
            }}
            className="grid size-7 place-items-center rounded-md text-ink-subtle hover:bg-brand-50 hover:text-ink"
            aria-label="Clear search"
          >
            <UiIcon name="close" className="size-4" />
          </button>
        ) : (
          <kbd className="hidden rounded border border-line bg-canvas px-1.5 py-0.5 font-mono text-xs text-ink-subtle sm:block">
            /
          </kbd>
        )}
      </div>
    </div>
  )
}

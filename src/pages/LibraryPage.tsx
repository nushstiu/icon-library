import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { IconGrid } from '../components/icons/IconGrid'
import { CategoryFilter } from '../components/library/CategoryFilter'
import { EmptyState } from '../components/library/EmptyState'
import { SearchBar } from '../components/library/SearchBar'
import { SortSelect } from '../components/library/SortSelect'
import { StyleFilter } from '../components/library/StyleFilter'
import { Button } from '../components/ui/Button'
import { buttonClasses } from '../components/ui/buttonStyles'
import { categoryLabel } from '../config/iconMeta'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useIcons } from '../hooks/useIcons'
import { useLibraryFilters } from '../hooks/useLibraryFilters'

export function LibraryPage() {
  const { filters, setFilter, resetFilters, hasActiveFilters } = useLibraryFilters()

  // The input updates instantly; the service is only queried once typing pauses.
  const [searchInput, setSearchInput] = useState(filters.search)
  const debouncedSearch = useDebouncedValue(searchInput, 200)

  // Remembers the last value both sides agreed on, so a slow debounce never overwrites fresh typing.
  const lastSynced = useRef(filters.search)

  useEffect(() => {
    if (debouncedSearch === lastSynced.current) return
    lastSynced.current = debouncedSearch
    setFilter('search', debouncedSearch)
  }, [debouncedSearch, setFilter])

  // Keep the input in sync when the URL changes from outside (Back button, "Clear filters").
  useEffect(() => {
    if (filters.search === lastSynced.current) return
    lastSynced.current = filters.search
    setSearchInput(filters.search)
  }, [filters.search])

  const { icons, status, error, reload } = useIcons(filters)
  const isFirstLoad = status === 'loading' && icons.length === 0

  const clearAll = () => {
    setSearchInput('')
    resetFilters()
  }

  return (
    <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-8">
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <CategoryFilter
            variant="sidebar"
            value={filters.category}
            onChange={(v) => setFilter('category', v)}
          />
        </div>
      </aside>

      <div className="min-w-0">
        <section className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Icon library</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Browse, customise and export icons for MAIB products. Click an icon for size, colour
            and code options.
          </p>
        </section>

        <div className="space-y-4">
          <SearchBar value={searchInput} onChange={setSearchInput} />

          <div className="lg:hidden">
            <CategoryFilter
              variant="chips"
              value={filters.category}
              onChange={(v) => setFilter('category', v)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <StyleFilter value={filters.style} onChange={(v) => setFilter('style', v)} />
            <SortSelect value={filters.sort} onChange={(v) => setFilter('sort', v)} />
          </div>

          <div className="flex min-h-5 items-center justify-between text-xs text-ink-muted">
            <p aria-live="polite">
              {isFirstLoad ? (
                'Loading icons…'
              ) : (
                <>
                  <span className="font-semibold text-ink">{icons.length}</span>{' '}
                  {icons.length === 1 ? 'icon' : 'icons'}
                  {filters.category !== 'all' && ` in ${categoryLabel(filters.category)}`}
                  {filters.search && ` matching “${filters.search}”`}
                </>
              )}
            </p>
            {hasActiveFilters && (
              <button type="button" onClick={clearAll} className="font-medium text-brand-500 hover:underline">
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div
          className={`mt-4 transition-opacity ${status === 'loading' && !isFirstLoad ? 'opacity-60' : ''}`}
        >
          {status === 'error' ? (
            <EmptyState
              icon="alert"
              title="Icons could not be loaded"
              description={error}
              action={<Button onClick={reload}>Try again</Button>}
            />
          ) : isFirstLoad ? (
            <GridSkeleton />
          ) : icons.length === 0 ? (
            <EmptyState
              title="No icons found"
              description={
                filters.search
                  ? `Nothing matches “${filters.search}” with the current filters. Try another keyword or clear the filters.`
                  : 'There are no icons with these filters yet.'
              }
              action={
                <>
                  <Button onClick={clearAll}>Clear filters</Button>
                  <Link to="/upload" className={buttonClasses('primary')}>
                    Upload an icon
                  </Link>
                </>
              }
            />
          ) : (
            <IconGrid icons={icons} />
          )}
        </div>
      </div>
    </div>
  )
}

function GridSkeleton() {
  return (
    <ul
      aria-hidden="true"
      className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))]"
    >
      {Array.from({ length: 24 }, (_, i) => (
        <li key={i} className="aspect-square animate-pulse rounded-xl border border-line bg-surface" />
      ))}
    </ul>
  )
}

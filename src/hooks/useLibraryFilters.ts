import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { isCategory, isSortOption, isStyle } from '../config/iconMeta'
import type { IconCategory, IconStyle, SortOption } from '../types/icon'

export interface LibraryFilters {
  search: string
  category: IconCategory | 'all'
  style: IconStyle | 'all'
  sort: SortOption
}

const DEFAULTS: LibraryFilters = { search: '', category: 'all', style: 'all', sort: 'name-asc' }

const PARAM_NAMES: Record<keyof LibraryFilters, string> = {
  search: 'q',
  category: 'category',
  style: 'style',
  sort: 'sort',
}

/**
 * Stores the library filters in the URL (?q=card&category=finance).
 *
 * This makes filtered views shareable and bookmarkable, and keeps the filters
 * when the user opens an icon and presses Back.
 */
export function useLibraryFilters() {
  const [params, setParams] = useSearchParams()

  const filters = useMemo<LibraryFilters>(() => {
    const category = params.get('category')
    const style = params.get('style')
    const sort = params.get('sort')
    return {
      search: params.get('q') ?? '',
      category: isCategory(category) ? category : 'all',
      style: isStyle(style) ? style : 'all',
      sort: isSortOption(sort) ? sort : DEFAULTS.sort,
    }
  }, [params])

  const setFilter = useCallback(
    <K extends keyof LibraryFilters>(key: K, value: LibraryFilters[K]) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (value === DEFAULTS[key]) next.delete(PARAM_NAMES[key])
          else next.set(PARAM_NAMES[key], value)
          return next
        },
        // Typing in search should not create a history entry per keystroke.
        { replace: key === 'search' },
      )
    },
    [setParams],
  )

  const resetFilters = useCallback(() => setParams({}), [setParams])

  const hasActiveFilters =
    filters.search !== '' || filters.category !== 'all' || filters.style !== 'all'

  return { filters, setFilter, resetFilters, hasActiveFilters }
}

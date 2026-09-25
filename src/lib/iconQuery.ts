import type { Icon, IconQuery } from '../types/icon'

/**
 * Applies search, filters and sorting to a list of icons.
 *
 * Used by the mock service. With a real backend this work moves to the server
 * (e.g. GET /icons?search=card&category=finance), and this file is no longer needed.
 */
export function applyIconQuery(icons: Icon[], query: IconQuery = {}): Icon[] {
  const search = query.search?.trim().toLowerCase() ?? ''
  const terms = search.split(/\s+/).filter(Boolean)

  const filtered = icons.filter((icon) => {
    if (query.category && query.category !== 'all' && icon.category !== query.category) return false
    if (query.style && query.style !== 'all' && icon.style !== query.style) return false
    if (terms.length === 0) return true
    const haystack = [icon.name, icon.name.replace(/-/g, ' '), icon.category, ...icon.tags]
      .join(' ')
      .toLowerCase()
    return terms.every((term) => haystack.includes(term))
  })

  const byName = (a: Icon, b: Icon) => a.name.localeCompare(b.name) || a.style.localeCompare(b.style)
  const byDate = (a: Icon, b: Icon) => a.createdAt.localeCompare(b.createdAt)

  switch (query.sort ?? 'name-asc') {
    case 'name-desc':
      return filtered.sort((a, b) => byName(b, a))
    case 'newest':
      return filtered.sort((a, b) => byDate(b, a) || byName(a, b))
    case 'oldest':
      return filtered.sort((a, b) => byDate(a, b) || byName(a, b))
    default:
      return filtered.sort(byName)
  }
}

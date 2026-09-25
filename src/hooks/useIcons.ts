import { useCallback, useEffect, useState } from 'react'
import { errorMessage, iconService } from '../services'
import type { Icon, IconQuery } from '../types/icon'

interface Result {
  /** Which request this result belongs to. */
  key: string
  icons: Icon[]
  error: string | null
}

/**
 * Loads icons that match a query through the service layer.
 * Previous results stay visible while a new query loads, so the grid does not flash.
 */
export function useIcons(query: IconQuery) {
  const [result, setResult] = useState<Result | null>(null)
  const [reloadCount, setReloadCount] = useState(0)

  const { search, category, style, sort } = query
  const key = JSON.stringify([search, category, style, sort, reloadCount])

  useEffect(() => {
    // Ignore responses from queries that are no longer current (the user kept typing).
    let cancelled = false
    iconService
      .getIcons({ search, category, style, sort })
      .then((icons) => {
        if (!cancelled) setResult({ key, icons, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) setResult((prev) => ({ key, icons: prev?.icons ?? [], error: errorMessage(err) }))
      })
    return () => {
      cancelled = true
    }
  }, [key, search, category, style, sort])

  const reload = useCallback(() => setReloadCount((count) => count + 1), [])

  // Loading is derived: the latest result belongs to an older request.
  const status = result?.key !== key ? 'loading' : result.error ? 'error' : 'success'

  return { icons: result?.icons ?? [], status, error: result?.error ?? null, reload } as const
}

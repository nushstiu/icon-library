import { useEffect, useState } from 'react'
import { errorMessage, iconService } from '../services'
import type { Icon } from '../types/icon'

type State =
  | { status: 'loading'; icon: null; error: null }
  | { status: 'success'; icon: Icon; error: null }
  | { status: 'not-found'; icon: null; error: null }
  | { status: 'error'; icon: null; error: string }

const LOADING: State = { status: 'loading', icon: null, error: null }
const NOT_FOUND: State = { status: 'not-found', icon: null, error: null }

/** Loads a single icon by id. */
export function useIcon(id: string | undefined): State {
  const [result, setResult] = useState<{ id: string; state: State } | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    iconService
      .getIconById(id)
      .then((icon) => {
        if (!cancelled) {
          setResult({ id, state: icon ? { status: 'success', icon, error: null } : NOT_FOUND })
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setResult({ id, state: { status: 'error', icon: null, error: errorMessage(err) } })
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (!id) return NOT_FOUND
  // A result for a different id means the new one is still loading.
  return result?.id === id ? result.state : LOADING
}

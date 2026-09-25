import type { Icon, IconQuery } from '../types/icon'
import { IconServiceError, type IconService, type IconServiceErrorCode } from './iconService'

/**
 * REST implementation of `IconService`, ready for when a backend exists.
 *
 * It is not used by default. Set `VITE_ICON_API_URL` in `.env.local` to switch
 * the whole app over to it (see `services/index.ts`). The expected endpoints are:
 *
 *   GET    /icons?search=&category=&style=&sort=   → Icon[]
 *   GET    /icons/:id                              → Icon | 404
 *   POST   /icons                                  → Icon     (body: NewIconInput)
 *   PATCH  /icons/:id                              → Icon     (body: IconUpdate)
 *   DELETE /icons/:id                              → 204
 */

const STATUS_CODES: Record<number, IconServiceErrorCode> = {
  400: 'invalid',
  401: 'forbidden',
  403: 'forbidden',
  404: 'not-found',
  409: 'conflict',
  422: 'invalid',
}

export function createHttpIconService(baseUrl: string): IconService {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    let response: Response
    try {
      response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers: { 'Content-Type': 'application/json', ...init?.headers },
      })
    } catch {
      throw new IconServiceError('network', 'Could not reach the icon server.')
    }
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null
      throw new IconServiceError(
        STATUS_CODES[response.status] ?? 'network',
        body?.message ?? `Request failed with status ${response.status}.`,
      )
    }
    return response.status === 204 ? (undefined as T) : ((await response.json()) as T)
  }

  function toSearchParams(query: IconQuery = {}): string {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value && value !== 'all') params.set(key, value)
    }
    const text = params.toString()
    return text ? `?${text}` : ''
  }

  return {
    getIcons: (query) => request<Icon[]>(`/icons${toSearchParams(query)}`),

    async getIconById(id) {
      try {
        return await request<Icon>(`/icons/${encodeURIComponent(id)}`)
      } catch (error) {
        if (error instanceof IconServiceError && error.code === 'not-found') return null
        throw error
      }
    },

    uploadIcon: (input) => request<Icon>('/icons', { method: 'POST', body: JSON.stringify(input) }),

    updateIcon: (id, changes) =>
      request<Icon>(`/icons/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(changes),
      }),

    deleteIcon: (id) => request<void>(`/icons/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  }
}

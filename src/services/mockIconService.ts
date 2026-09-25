import { MOCK_ICONS } from '../data/mockIcons'
import { toKebabCase } from '../lib/format'
import { applyIconQuery } from '../lib/iconQuery'
import { sanitizeSvg } from '../lib/svg'
import type { Icon } from '../types/icon'
import { IconServiceError, type IconService } from './iconService'

/**
 * Mock implementation of `IconService`.
 *
 * - Built-in icons come from `MOCK_ICONS` and are read-only.
 * - Uploaded icons are kept in localStorage so they survive a page reload.
 * - Every method is async and has a small artificial delay, so the UI is
 *   already built to handle loading states exactly as it will with a real API.
 */

const STORAGE_KEY = 'maib-icon-library:uploaded-icons:v1'
const LATENCY_MS = 150

const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms))

function readUploads(): Icon[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // localStorage can be edited by hand, so re-sanitise before anything is rendered.
    return parsed.flatMap((item: Icon) => {
      const svg = typeof item?.svg === 'string' ? sanitizeSvg(item.svg) : null
      return svg ? [{ ...item, svg, source: 'uploaded' as const }] : []
    })
  } catch {
    return []
  }
}

function writeUploads(icons: Icon[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(icons))
  } catch {
    throw new IconServiceError('invalid', 'Browser storage is full or unavailable. The icon was not saved.')
  }
}

const allIcons = () => [...MOCK_ICONS, ...readUploads()]

const clone = <T>(value: T): T => structuredClone(value)

export function createMockIconService(): IconService {
  return {
    async getIcons(query) {
      await delay()
      return clone(applyIconQuery(allIcons(), query))
    },

    async getIconById(id) {
      await delay()
      const icon = allIcons().find((i) => i.id === id)
      return icon ? clone(icon) : null
    },

    async uploadIcon(input) {
      await delay(300)
      const name = toKebabCase(input.name)
      const svg = sanitizeSvg(input.svg)
      if (!svg) throw new IconServiceError('invalid', 'The SVG could not be processed.')

      const duplicate = allIcons().some((i) => i.name === name && i.style === input.style)
      if (duplicate) {
        throw new IconServiceError('conflict', `An icon named "${name}" already exists in this style.`)
      }

      const icon: Icon = {
        id: `${name}-${input.style}-${crypto.randomUUID().slice(0, 8)}`,
        name,
        category: input.category,
        style: input.style,
        svg,
        tags: input.tags,
        createdAt: new Date().toISOString(),
        source: 'uploaded',
      }
      writeUploads([...readUploads(), icon])
      return clone(icon)
    },

    async updateIcon(id, changes) {
      await delay()
      const uploads = readUploads()
      const index = uploads.findIndex((i) => i.id === id)
      if (index === -1) {
        const isBuiltIn = MOCK_ICONS.some((i) => i.id === id)
        throw isBuiltIn
          ? new IconServiceError('forbidden', 'Built-in library icons cannot be edited.')
          : new IconServiceError('not-found', 'Icon not found.')
      }
      const updated: Icon = {
        ...uploads[index],
        ...changes,
        name: changes.name ? toKebabCase(changes.name) : uploads[index].name,
      }
      uploads[index] = updated
      writeUploads(uploads)
      return clone(updated)
    },

    async deleteIcon(id) {
      await delay()
      const uploads = readUploads()
      if (!uploads.some((i) => i.id === id)) {
        const isBuiltIn = MOCK_ICONS.some((i) => i.id === id)
        throw isBuiltIn
          ? new IconServiceError('forbidden', 'Built-in library icons cannot be deleted.')
          : new IconServiceError('not-found', 'Icon not found.')
      }
      writeUploads(uploads.filter((i) => i.id !== id))
    },
  }
}

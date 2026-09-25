import type { IconCategory, IconStyle, SortOption } from '../types/icon'

/** Display metadata for categories, styles and sort options, shared by filters and forms. */

export const CATEGORIES: { value: IconCategory; label: string }[] = [
  { value: 'finance', label: 'Finance' },
  { value: 'security', label: 'Security' },
  { value: 'communication', label: 'Communication' },
  { value: 'interface', label: 'Interface' },
  { value: 'arrows', label: 'Arrows' },
  { value: 'files', label: 'Files' },
  { value: 'users', label: 'Users' },
  { value: 'devices', label: 'Devices' },
]

export const STYLES: { value: IconStyle; label: string; description: string }[] = [
  { value: 'linear', label: 'Linear', description: '1.5px outline, single colour' },
  { value: 'twotone', label: 'Two-tone', description: 'Outline with a softened secondary layer' },
  { value: 'bulk', label: 'Bulk', description: 'Outline over a translucent filled body' },
  { value: 'custom', label: 'Custom', description: 'Uploaded artwork that follows its own style' },
]

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
]

export const categoryLabel = (value: IconCategory) =>
  CATEGORIES.find((c) => c.value === value)?.label ?? value

export const styleLabel = (value: IconStyle) => STYLES.find((s) => s.value === value)?.label ?? value

export const isCategory = (value: string | null): value is IconCategory =>
  CATEGORIES.some((c) => c.value === value)

export const isStyle = (value: string | null): value is IconStyle =>
  STYLES.some((s) => s.value === value)

export const isSortOption = (value: string | null): value is SortOption =>
  SORT_OPTIONS.some((s) => s.value === value)

/** Upload rules, kept together so the UI hint text and the validator never disagree. */
export const UPLOAD_LIMITS = {
  maxFileSizeBytes: 100 * 1024,
  maxTags: 10,
  nameMinLength: 2,
  nameMaxLength: 40,
} as const

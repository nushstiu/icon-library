/**
 * Domain types for the icon library.
 *
 * These describe the shape of the data the UI works with. A future backend
 * should return JSON that matches `Icon`, so components never need to change.
 */

export type IconStyle = 'linear' | 'twotone' | 'bulk' | 'custom'

export type IconCategory =
  | 'finance'
  | 'security'
  | 'communication'
  | 'interface'
  | 'arrows'
  | 'files'
  | 'users'
  | 'devices'

/** Where an icon came from. Only user uploads can be deleted in the MVP. */
export type IconSource = 'library' | 'uploaded'

export interface Icon {
  id: string
  /** Machine-friendly name in kebab-case, e.g. "credit-card". */
  name: string
  category: IconCategory
  style: IconStyle
  /** Sanitised SVG markup. Built-in icons use `currentColor` so they can be recoloured. */
  svg: string
  tags: string[]
  /** ISO 8601 timestamp. */
  createdAt: string
  source: IconSource
}

/** Data the user provides when uploading. The service fills in id, createdAt and source. */
export interface NewIconInput {
  name: string
  category: IconCategory
  style: IconStyle
  svg: string
  tags: string[]
}

/** Fields that can be edited after an icon exists. */
export type IconUpdate = Partial<Omit<NewIconInput, 'svg'>>

export type SortOption = 'name-asc' | 'name-desc' | 'newest' | 'oldest'

export interface IconQuery {
  search?: string
  category?: IconCategory | 'all'
  style?: IconStyle | 'all'
  sort?: SortOption
}

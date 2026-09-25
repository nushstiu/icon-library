import type { Icon, IconQuery, IconUpdate, NewIconInput } from '../types/icon'

/**
 * The contract between the UI and wherever icons are stored.
 *
 * Components and hooks only depend on this interface. Today it is implemented
 * by `mockIconService` (in-memory + localStorage); later by `httpIconService`
 * (REST API). Swapping one for the other does not change any component.
 */
export interface IconService {
  getIcons(query?: IconQuery): Promise<Icon[]>
  getIconById(id: string): Promise<Icon | null>
  uploadIcon(input: NewIconInput): Promise<Icon>
  updateIcon(id: string, changes: IconUpdate): Promise<Icon>
  deleteIcon(id: string): Promise<void>
}

export type IconServiceErrorCode = 'not-found' | 'conflict' | 'forbidden' | 'invalid' | 'network'

/** A predictable error type, so the UI can show a helpful message whichever implementation is used. */
export class IconServiceError extends Error {
  readonly code: IconServiceErrorCode

  constructor(code: IconServiceErrorCode, message: string) {
    super(message)
    this.name = 'IconServiceError'
    this.code = code
  }
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}

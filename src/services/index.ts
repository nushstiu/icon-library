import { createHttpIconService } from './httpIconService'
import type { IconService } from './iconService'
import { createMockIconService } from './mockIconService'

/**
 * The single place that decides which data source the app uses.
 * Everything else imports `iconService` from here.
 */
const apiUrl = import.meta.env.VITE_ICON_API_URL

export const isMockMode = !apiUrl

export const iconService: IconService = apiUrl
  ? createHttpIconService(apiUrl)
  : createMockIconService()

export { IconServiceError, errorMessage } from './iconService'
export type { IconService } from './iconService'

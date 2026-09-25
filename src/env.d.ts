/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the icon REST API. When unset, the app uses mock/local data. */
  readonly VITE_ICON_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

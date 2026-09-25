/**
 * Icons used by the application's own interface (buttons, inputs, navigation).
 *
 * Kept separate from the icon library data on purpose: the app chrome must keep
 * working even if the library data is empty or served by a backend.
 */
const PATHS = {
  search: 'M11 18.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM16.5 16.5 21 21',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  copy: 'M8.5 8.5V5a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 20.5 5v9a1.5 1.5 0 0 1-1.5 1.5h-3.5M5 8.5h9A1.5 1.5 0 0 1 15.5 10v9a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19v-9A1.5 1.5 0 0 1 5 8.5Z',
  download: 'M12 3.5V15M7.5 10.5 12 15l4.5-4.5M4 17v1.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V17',
  upload: 'M12 15V3.5M7.5 8 12 3.5 16.5 8M4 17v1.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V17',
  'arrow-left': 'M20 12H4M10 6l-6 6 6 6',
  trash: 'M3.5 7h17M9 7V4.5h6V7M5.5 7l1 12.2A1.5 1.5 0 0 0 8 20.5h8a1.5 1.5 0 0 0 1.5-1.3L18.5 7',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  alert: 'M12 8v5M12 16.5v.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15',
  file: 'M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5ZM13.5 3v5.5H19',
  sliders: 'M4 7h9M17 7h3M4 17h3M11 17h9M15 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
} as const

export type UiIconName = keyof typeof PATHS

interface UiIconProps {
  name: UiIconName
  className?: string
}

export function UiIcon({ name, className = 'size-5' }: UiIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}

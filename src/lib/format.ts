/** "Credit Card.svg" → "credit-card" */
export function toKebabCase(value: string): string {
  return value
    .replace(/\.svg$/i, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** "credit-card" → "Credit card" */
export function toDisplayName(name: string): string {
  const words = name.replace(/-/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(iso),
  )
}

/** "finance, Bank , , card" → ["finance", "bank", "card"] (deduplicated) */
export function parseTags(value: string): string[] {
  const tags = value
    .split(',')
    .map((tag) => toKebabCase(tag))
    .filter(Boolean)
  return Array.from(new Set(tags))
}

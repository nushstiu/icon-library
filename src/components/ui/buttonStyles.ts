export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand-900 text-white hover:bg-brand-700 disabled:bg-brand-200',
  secondary:
    'border border-line bg-surface text-ink hover:border-brand-200 hover:bg-brand-50 disabled:text-ink-subtle',
  ghost: 'text-ink-muted hover:bg-brand-50 hover:text-ink',
  danger: 'border border-red-200 bg-surface text-danger-700 hover:bg-danger-50',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-xs',
  md: 'h-10 gap-2 px-4 text-sm',
}

/** Shared class list, so links (<Link>) can look like buttons too. */
export function buttonClasses(variant: ButtonVariant = 'secondary', size: ButtonSize = 'md', extra = '') {
  return `inline-flex shrink-0 items-center justify-center rounded-lg font-medium transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${extra}`
}

export function inputClasses(hasError: boolean) {
  return `h-10 w-full rounded-lg border bg-surface px-3 text-sm text-ink placeholder:text-ink-subtle focus:ring-4 focus:outline-none ${
    hasError
      ? 'border-danger-600 focus:ring-danger-600/15'
      : 'border-line focus:border-accent-500 focus:ring-accent-500/15'
  }`
}

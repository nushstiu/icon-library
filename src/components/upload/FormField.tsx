import type { ReactNode } from 'react'

interface FormFieldProps {
  id: string
  label: string
  hint?: ReactNode
  error?: string
  children: ReactNode
}

/** Label + control + hint/error, with ids wired up for screen readers. */
export function FormField({ id, label, hint, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-danger-700">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-subtle">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

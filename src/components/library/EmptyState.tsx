import type { ReactNode } from 'react'
import { UiIcon, type UiIconName } from '../ui/UiIcon'

interface EmptyStateProps {
  icon?: UiIconName
  title: string
  description: ReactNode
  action?: ReactNode
}

/** Used for "no results", "not found" and error states. */
export function EmptyState({ icon = 'search', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface px-6 py-16 text-center">
      <div className="mb-4 grid size-12 place-items-center rounded-full bg-brand-50 text-brand-500">
        <UiIcon name={icon} className="size-6" />
      </div>
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  )
}

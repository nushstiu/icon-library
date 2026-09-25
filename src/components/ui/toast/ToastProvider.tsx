import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { UiIcon } from '../UiIcon'
import { ToastContext, type ToastTone } from './toastContext'

interface Toast {
  id: number
  message: string
  tone: ToastTone
}

const DURATION_MS = 2600

const TONE_STYLES: Record<ToastTone, string> = {
  success: 'text-accent-400',
  error: 'text-red-400',
  info: 'text-brand-200',
}

/** Small notification stack in the bottom corner ("SVG copied", "Icon deleted", ...). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  const show = useCallback((message: string, tone: ToastTone = 'info') => {
    const id = nextId.current++
    // Keep at most three visible.
    setToasts((current) => [...current.slice(-2), { id, message, tone }])
    setTimeout(() => setToasts((current) => current.filter((t) => t.id !== id)), DURATION_MS)
  }, [])

  const api = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.tone === 'error' ? 'alert' : 'status'}
            className="flex items-center gap-2.5 rounded-lg bg-brand-900 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-brand-900/20"
          >
            <UiIcon
              name={toast.tone === 'error' ? 'alert' : 'check'}
              className={`size-4 ${TONE_STYLES[toast.tone]}`}
            />
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

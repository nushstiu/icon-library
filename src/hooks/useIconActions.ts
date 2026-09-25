import { useCallback } from 'react'
import { useToast } from '../components/ui/toast/useToast'
import { copyText, downloadTextFile } from '../lib/browser'
import { INHERIT_COLOR, customizeSvg } from '../lib/svg'
import type { Icon } from '../types/icon'

export interface ExportOptions {
  size: number
  color: string
}

export const DEFAULT_EXPORT: ExportOptions = { size: 24, color: INHERIT_COLOR }

/** Copy and download actions shared by icon cards and the details page. */
export function useIconActions() {
  const toast = useToast()

  const copySvg = useCallback(
    async (icon: Icon, options: ExportOptions = DEFAULT_EXPORT, markup?: string) => {
      try {
        await copyText(markup ?? customizeSvg(icon.svg, options))
        toast.show(`Copied ${icon.name} to clipboard`, 'success')
      } catch {
        toast.show('Could not copy. Your browser blocked clipboard access.', 'error')
      }
    },
    [toast],
  )

  const downloadSvg = useCallback(
    (icon: Icon, options: ExportOptions = DEFAULT_EXPORT) => {
      downloadTextFile(`${icon.name}-${icon.style}.svg`, customizeSvg(icon.svg, options))
      toast.show(`Downloaded ${icon.name}-${icon.style}.svg`, 'success')
    },
    [toast],
  )

  return { copySvg, downloadSvg }
}

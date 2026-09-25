/**
 * Thin wrappers around browser APIs used for copying and downloading.
 */

export async function copyText(text: string): Promise<void> {
  // The async Clipboard API only exists in secure contexts (https or localhost).
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text)
    return
  }
  // Fallback, e.g. when opening the dev server from a phone over the local network.
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const ok = document.execCommand('copy')
  textarea.remove()
  if (!ok) throw new Error('Copy command was rejected by the browser.')
}

export function downloadTextFile(filename: string, content: string, mimeType = 'image/svg+xml') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

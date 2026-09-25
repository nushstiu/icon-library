import { useState } from 'react'
import { prettifySvg, svgToJsx } from '../../lib/svg'
import { UiIcon } from '../ui/UiIcon'

type Tab = 'svg' | 'jsx'

interface CodeViewerProps {
  /** Already customised (size + colour) SVG markup. */
  svg: string
  onCopy: (code: string) => void
}

/** Shows the exact code that "Copy" will put on the clipboard, as SVG or React JSX. */
export function CodeViewer({ svg, onCopy }: CodeViewerProps) {
  const [tab, setTab] = useState<Tab>('svg')
  const code = prettifySvg(tab === 'svg' ? svg : svgToJsx(svg))

  return (
    <div className="overflow-hidden rounded-xl border border-brand-900 bg-brand-900">
      <div className="flex items-center justify-between border-b border-white/10 px-2">
        <div role="tablist" aria-label="Code format" className="flex">
          {(['svg', 'jsx'] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={`border-b-2 px-3 py-2.5 font-mono text-xs uppercase transition-colors ${
                tab === value
                  ? 'border-accent-400 text-white'
                  : 'border-transparent text-brand-200 hover:text-white'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onCopy(code)}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-brand-100 hover:bg-white/10 hover:text-white"
        >
          <UiIcon name="copy" className="size-3.5" />
          Copy {tab.toUpperCase()}
        </button>
      </div>
      <pre className="max-h-72 overflow-auto p-4 font-mono text-xs leading-relaxed text-brand-50">
        <code>{code}</code>
      </pre>
    </div>
  )
}

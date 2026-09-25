import { useIconActions } from '../../hooks/useIconActions'
import type { Icon } from '../../types/icon'
import { IconCard } from './IconCard'

export function IconGrid({ icons }: { icons: Icon[] }) {
  const { copySvg, downloadSvg } = useIconActions()

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))]">
      {icons.map((icon) => (
        <IconCard key={icon.id} icon={icon} onCopy={copySvg} onDownload={downloadSvg} />
      ))}
    </ul>
  )
}

import { Link, NavLink } from 'react-router'
import { UiIcon } from '../ui/UiIcon'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors ${
    isActive ? 'bg-white/12 text-white' : 'text-brand-100 hover:bg-white/8 hover:text-white'
  }`

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-brand-900 text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="MAIB Icon Library home">
          <Logo />
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold tracking-tight">MAIB Icons</span>
            <span className="hidden text-[11px] text-brand-200 sm:block">Internal icon library</span>
          </span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-1">
          <NavLink to="/" end className={navClass}>
            <UiIcon name="grid" className="size-4" />
            <span className="hidden sm:inline">Library</span>
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `ml-1 inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-accent-400 text-brand-900'
                  : 'bg-accent-500 text-brand-900 hover:bg-accent-400'
              }`
            }
          >
            <UiIcon name="upload" className="size-4" />
            <span>Upload</span>
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="size-9" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.08)" />
      <rect x="8" y="8" width="7" height="7" rx="2" fill="var(--color-accent-400)" />
      <rect x="17" y="8" width="7" height="7" rx="2" fill="#fff" fillOpacity=".9" />
      <rect x="8" y="17" width="7" height="7" rx="2" fill="#fff" fillOpacity=".9" />
      <rect x="17" y="17" width="7" height="7" rx="3.5" fill="#fff" fillOpacity=".45" />
    </svg>
  )
}

import { Outlet, ScrollRestoration } from 'react-router'
import { isMockMode } from '../../services'
import { Header } from './Header'

export function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 text-xs text-ink-subtle sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <span>MAIB Icon Library · Internship MVP</span>
          <span>
            {isMockMode
              ? 'Mock data mode · uploads are stored in this browser only'
              : 'Connected to icon API'}
          </span>
        </div>
      </footer>
      <ScrollRestoration />
    </div>
  )
}

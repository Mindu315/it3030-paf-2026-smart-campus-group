import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import Sidebar from './Sidebar'

function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--text-primary)]">
      <div className="flex min-h-screen">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile sidebar */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden" aria-hidden="true">
            <button
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsMobileOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-72 shadow-2xl">
              <Sidebar onNavigate={() => setIsMobileOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur md:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                onClick={() => setIsMobileOpen((open) => !open)}
              >
                {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
                Menu
              </button>
              <div className="text-sm font-bold text-slate-900">Smart Campus Hub</div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout

import { useEffect, useState } from 'react'
import {
  filterResources,
  getAllResources,
} from '../api/resourceService'
import ResourceCard from './Resources/ResourceCard'
import ResourceDetailsModal from './Resources/ResourceDetailsModal'
import ResourceFilterBar from './Resources/ResourceFilterBar'
import { Menu, Home, Box, Calendar, Ticket, Bell, LogOut } from 'lucide-react'

const initialFilters = {
  type: '',
  location: '',
  minCapacity: '',
  status: '',
}

function ResourceCatalog() {
  const [resources, setResources] = useState([])
  const [filters, setFilters] = useState(initialFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedResource, setSelectedResource] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const loadResources = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await getAllResources()
      setResources(response.data)
    } catch (err) {
      setError('Failed to load resources. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResources()
  }, [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleApplyFilters = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await filterResources(filters)
      setResources(response.data)
    } catch (err) {
      setError('Failed to filter resources. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetFilters = async () => {
    setFilters(initialFilters)
    try {
      setLoading(true)
      setError('')
      const response = await getAllResources()
      setResources(response.data)
    } catch (err) {
      setError('Failed to reload resources. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (resource) => {
    setSelectedResource(resource)
    setIsDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setSelectedResource(null)
    setIsDetailsOpen(false)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--text-primary)]">
      <div className="lg:flex lg:gap-6">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-52 transform bg-[var(--color-card)] border-r border-slate-100 transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          aria-label="Sidebar"
        >
          <div className="flex h-full flex-col justify-between">
            {/* Top: brand */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 flex-none rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-semibold shadow-sm">
                  SC
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">Smart Campus Hub</div>
                  <div className="text-xs text-[var(--text-secondary)]">Admin</div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="px-3">
              <div className="h-px bg-slate-100" />
            </div>

            {/* Middle: nav */}
            <nav className="px-2 py-3 flex-1 overflow-y-auto">
              <ul className="space-y-1">
                <li>
                  <a className="group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--color-light-purple)] hover:text-[var(--text-primary)]">
                    <Home className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                    <span>Dashboard</span>
                  </a>
                </li>

                <li>
                  <a className="relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] shadow-sm">
                    {/* left accent */}
                    <span className="absolute left-0 top-0 h-full w-1 rounded-r-md bg-[var(--color-secondary)]" aria-hidden />
                    <Box className="h-4 w-4 text-white" />
                    <span>Resources</span>
                  </a>
                </li>

                <li>
                  <a className="group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--color-light-purple)] hover:text-[var(--text-primary)]">
                    <Calendar className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                    <span>Bookings</span>
                  </a>
                </li>

                <li>
                  <a className="group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--color-light-purple)] hover:text-[var(--text-primary)]">
                    <Ticket className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                    <span>Tickets</span>
                  </a>
                </li>

                <li>
                  <a className="group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--color-light-purple)] hover:text-[var(--text-primary)]">
                    <Bell className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                    <span>Notifications</span>
                  </a>
                </li>
              </ul>
            </nav>

            {/* Bottom: action */}
            <div className="px-4 py-3">
              <div className="h-px bg-slate-100 mb-3" />
              <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--color-light-purple)]">
                <LogOut className="h-4 w-4 text-[var(--text-secondary)]" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <button
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}

        {/* Main content area */}
          <main className="lg:ml-1 flex-1">
          <div className="sticky top-0 z-20 bg-[var(--color-background)] border-b border-transparent px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-lg p-2 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6 text-[var(--text-primary)]" />
                </button>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">Resource Catalog</h1>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">Browse and manage campus resources.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-7xl">
            <div className="mb-4">
              <div className="rounded-xl p-4" style={{ background: 'var(--gradient)', color: 'white' }}>
                <h2 className="text-base font-medium">Find the best campus spaces</h2>
                <p className="mt-1 text-sm text-white/90">Filter and explore rooms, labs, and venues across campus.</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="rounded-xl bg-[var(--color-card)] p-4 shadow-md">
                <ResourceFilterBar
                  filters={filters}
                  onChange={handleFilterChange}
                  onApply={handleApplyFilters}
                  onReset={handleResetFilters}
                />
              </div>
            </div>

            {loading && (
              <div className="rounded-2xl border border-transparent bg-[var(--color-card)] p-10 text-center shadow-sm">
                <p className="text-sm font-medium text-[var(--text-secondary)]">Loading resources...</p>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">{error}</div>
            )}

            {!loading && !error && resources.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-[var(--color-card)] p-10 text-center shadow-sm">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">No resources found</h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Try changing your filters or add resources from the management page.</p>
              </div>
            )}

            {!loading && !error && resources.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 items-start">
                {resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} onView={handleViewDetails} />
                ))}
              </div>
            )}

            <ResourceDetailsModal resource={selectedResource} isOpen={isDetailsOpen} onClose={handleCloseDetails} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ResourceCatalog
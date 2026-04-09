import { useEffect, useState } from 'react'
import {
  filterResources,
  getAllResources,
} from '../api/resourceService'
import ResourceCard from './Resources/ResourceCard'
import ResourceDetailsModal from './Resources/ResourceDetailsModal'
import ResourceFilterBar from './Resources/ResourceFilterBar'

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
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
          Smart Campus
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-800">
          Resource Catalog
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Browse available campus resources, view their details, and use filters
          to quickly find the most suitable option.
        </p>
      </div>

      <div className="mb-8">
        <ResourceFilterBar
          filters={filters}
          onChange={handleFilterChange}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-600">
            Loading resources...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      )}

      {!loading && !error && resources.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700">
            No resources found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Try changing your filters or add resources from the management page.
          </p>
        </div>
      )}

      {!loading && !error && resources.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onView={handleViewDetails}
            />
          ))}
        </div>
      )}

      <ResourceDetailsModal
        resource={selectedResource}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </section>
  )
}

export default ResourceCatalog
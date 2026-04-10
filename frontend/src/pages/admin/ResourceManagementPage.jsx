import { useEffect, useState } from 'react'
import {
  createResource,
  deleteResource,
  getAllResources,
  updateResource,
} from '../../api/resourceService'
import { defaultResourceForm } from '../../utils/ResourceConstants'
import { validateResourceForm } from '../../utils/ResourceValidation'

import ResourceTable from '../../components/Resources/ResourceTable'
import ResourceForm from '../../components/Resources/ResourceForm'
import ResourceDetailsModal from '../../components/Resources/ResourceDetailsModal'
import ConfirmDeleteModal from '../../components/Resources/ConfirmDeleteModal'

function ResourceManagement() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState(defaultResourceForm)
  const [formErrors, setFormErrors] = useState({})
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const [selectedResource, setSelectedResource] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const loadResources = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await getAllResources()
      setResources(response.data)
    } catch (err) {
      setError('Failed to load resources.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResources()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleOpenCreate = () => {
    setFormData(defaultResourceForm)
    setFormErrors({})
    setIsEditMode(false)
    setIsFormOpen(true)
  }

  const handleEdit = (resource) => {
    setFormData({
      ...resource,
    })
    setFormErrors({})
    setIsEditMode(true)
    setIsFormOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateResourceForm(formData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      if (isEditMode) {
        await updateResource(formData.id, formData)
      } else {
        await createResource(formData)
      }

      setIsFormOpen(false)
      setFormData(defaultResourceForm)
      loadResources()
    } catch (err) {
      setError('Failed to save resource.')
    }
  }

  const handleDeleteClick = (resource) => {
    setSelectedResource(resource)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteResource(selectedResource.id)
      setIsDeleteOpen(false)
      setSelectedResource(null)
      loadResources()
    } catch (err) {
      setError('Failed to delete resource.')
    }
  }

  const handleView = (resource) => {
    setSelectedResource(resource)
    setIsDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setSelectedResource(null)
    setIsDetailsOpen(false)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Resource Management
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage all campus resources including adding, editing, and deleting.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
        >
          + Add Resource
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          Loading resources...
        </div>
      ) : (
        <ResourceTable
          resources={resources}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {isFormOpen && (
        <div className="mt-8">
          <ResourceForm
            formData={formData}
            errors={formErrors}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            isEditMode={isEditMode}
          />
        </div>
      )}

      <ResourceDetailsModal
        resource={selectedResource}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        resourceName={selectedResource?.name}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </section>
  )
}

export default ResourceManagement

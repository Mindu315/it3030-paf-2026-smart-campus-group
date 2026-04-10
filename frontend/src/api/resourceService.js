import api from './axiosConfig'

export const getAllResources = () => api.get('/resources')

export const getResourceById = (id) => api.get(`/resources/${id}`)

export const createResource = (data) => api.post('/resources', data)

export const updateResource = (id, data) => api.put(`/resources/${id}`, data)

export const deleteResource = (id) => api.delete(`/resources/${id}`)

export const filterResources = (filters = {}) => {
  const params = {}

  if (filters.type) params.type = filters.type
  if (filters.location) params.location = filters.location
  if (filters.minCapacity !== undefined && filters.minCapacity !== null && filters.minCapacity !== '') {
    params.minCapacity = filters.minCapacity
  }
  if (filters.status) params.status = filters.status

  return api.get('/resources/filter', { params })
}


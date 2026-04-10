import api from '../api/axiosConfig'

export const createTicket = (formData) => api.post('/api/v1/tickets', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const getMyTickets = (page = 0, size = 10) => api.get('/api/v1/tickets/my', { params: { page, size } })
export const getAllTickets = (filters = {}) => api.get('/api/v1/tickets', { params: filters })
export const getTicketById = (id) => api.get(`/api/v1/tickets/${id}`)
export const updateTicket = (id, data) => api.put(`/api/v1/tickets/${id}`, data)
export const deleteTicket = (id) => api.delete(`/api/v1/tickets/${id}`)
export const updateTicketStatus = (id, data) => api.patch(`/api/v1/tickets/${id}/status`, data)
export const assignTechnician = (id, data) => api.patch(`/api/v1/tickets/${id}/assign`, data)
export const uploadAttachments = (id, formData) => api.post(`/api/v1/tickets/${id}/attachments`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const deleteAttachment = (id, filename) => api.delete(`/api/v1/tickets/${id}/attachments/${filename}`)

export const getComments = (ticketId) => api.get(`/api/v1/tickets/${ticketId}/comments`)
export const addComment = (ticketId, data) => api.post(`/api/v1/tickets/${ticketId}/comments`, data)
export const editComment = (ticketId, commentId, data) => api.put(`/api/v1/tickets/${ticketId}/comments/${commentId}`, data)
export const deleteCommentById = (ticketId, commentId) => api.delete(`/api/v1/tickets/${ticketId}/comments/${commentId}`)

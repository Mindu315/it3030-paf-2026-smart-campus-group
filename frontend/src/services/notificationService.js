import api from '../api/axiosConfig'

const NotificationService = {
  getRecent: () => api.get('/notifications/recent'),
  getByStudent: (studentId) => api.get(`/notifications/student/${studentId}`),
  getUnreadCount: (studentId) => api.get(`/notifications/unread-count/${studentId}`),
  markAsRead: (id) => api.put(`/notifications/read/${id}`),
}

export default NotificationService

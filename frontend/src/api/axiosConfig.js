import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8081',
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('smartCampusUser')
  const parsed = stored ? JSON.parse(stored) : null
  const token = localStorage.getItem('token') || parsed?.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (parsed?.id) config.headers['X-User-Id'] = parsed.id
  if (parsed?.email) config.headers['X-User-Email'] = parsed.email
  if (parsed?.roles?.length) config.headers['X-User-Role'] = Array.isArray(parsed.roles) ? parsed.roles[0] : parsed.roles
  return config
})

export default api

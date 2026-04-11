import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('smartCampusUser')
  const parsed = stored ? JSON.parse(stored) : null
  const token = localStorage.getItem('token') || parsed?.token

  config.headers = config.headers || {}
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (parsed?.id) config.headers['X-User-Id'] = parsed.id
  if (parsed?.email) config.headers['X-User-Email'] = parsed.email
  if (parsed?.roles) {
    const roles = Array.isArray(parsed.roles) ? parsed.roles : [parsed.roles]
    const joined = roles.map(String).filter(Boolean).join(',')
    if (joined) config.headers['X-User-Role'] = joined
  }

  return config
})

export default api

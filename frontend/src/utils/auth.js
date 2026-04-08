const STORAGE_KEY = 'smartCampusUser'

function normalizeRoles(roles) {
  if (!roles) return []

  if (Array.isArray(roles)) {
    return roles.map((role) => String(role).toUpperCase())
  }

  return [String(roles).toUpperCase()]
}

export function saveUser(user) {
  if (!user || typeof user !== 'object') return

  const safeUser = { ...user }
  delete safeUser.password

  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
}

export function getCurrentUser() {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEY)
}

export function isAuthenticated() {
  return Boolean(getCurrentUser())
}

export function hasRole(targetRole) {
  const user = getCurrentUser()
  const roles = normalizeRoles(user?.roles)
  const normalizedTarget = String(targetRole).toUpperCase()

  return roles.includes(normalizedTarget) || roles.includes(`ROLE_${normalizedTarget}`)
}

export function getLandingRoute(user = getCurrentUser()) {
  const roles = normalizeRoles(user?.roles)

  if (roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')) {
    return '/admin'
  }

  return '/home'
}

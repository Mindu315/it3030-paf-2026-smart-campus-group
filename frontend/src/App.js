import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './components/ui/ToastContext'
import DashboardHome from './pages/HomePage'
import Login from './pages/auth/LoginPage'
import Register from './pages/auth/RegisterPage'
import NotificationsPage from './pages/NotificationsPage'
import BookingsPage from './pages/bookings/BookingsPage'
import BookingHistory from './pages/bookings/BookingHistoryPage'
import ResourceCatalog from './pages/resources/ResourceCatalogPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminLogin from './pages/admin/AdminLoginPage'
import AdminUsersPage from './pages/admin/UsersPage'
import AdminSettingsPage from './pages/admin/SettingsPage'
import AdminBookingList from './pages/admin/ReviewBookingsPage'
import ResourceManagement from './pages/admin/ResourceManagementPage'
import DashboardLayout from './components/layout/DashboardLayout'
import CreateTicketPage from './pages/tickets/CreateTicketPage'
import EditTicketPage from './pages/tickets/EditTicketPage'
import TicketDetailPage from './pages/tickets/TicketDetailPage'
import TicketListPage from './pages/tickets/TicketListPage'
import UserProfilePage from './pages/user/UserProfilePage'
import { getLandingRoute, hasRole, isAuthenticated } from './utils/auth'

function RootRedirect() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={getLandingRoute()} replace />
}

function PublicRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to={getLandingRoute()} replace />
  }

  return children
}

function ProtectedRoute({ allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  const isAllowed = allowedRoles.some((role) => hasRole(role))

  if (!isAllowed) {
    return <Navigate to={getLandingRoute()} replace />
  }

  return <Outlet />
}

function AdminOnlyRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }

  if (!hasRole('ADMIN')) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}

function App() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-60 bg-[radial-gradient(circle_at_15%_10%,rgba(33,75,167,0.20),transparent_40%),radial-gradient(circle_at_85%_15%,rgba(124,58,237,0.16),transparent_42%)]" aria-hidden="true"></div>

      <BrowserRouter>
        <ToastProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/dashboard" element={<Navigate to="/home" replace />} />

          <Route
            path="/login"
            element={(
              <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <PublicRoute>
                  <Login />
                </PublicRoute>
              </section>
            )}
          />

          <Route
            path="/admin/login"
            element={(
              <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <PublicRoute>
                  <AdminLogin />
                </PublicRoute>
              </section>
            )}
          />

          <Route
            path="/register"
            element={(
              <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <PublicRoute>
                  <Register />
                </PublicRoute>
              </section>
            )}
          />

          <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/home" element={<DashboardHome />} />
              <Route path="/notifications" element={<NotificationsPage />} />

              <Route path="/profile" element={<UserProfilePage />} />

              <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
                <Route path="/resources" element={<ResourceCatalog />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/booking-history" element={<BookingHistory />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']} />}>
                <Route path="/tickets" element={<TicketListPage />} />
                <Route path="/tickets/new" element={<CreateTicketPage />} />
                <Route path="/tickets/create" element={<Navigate to="/tickets/new" replace />} />
                <Route path="/tickets/:id" element={<TicketDetailPage />} />
                <Route path="/tickets/:id/edit" element={<EditTicketPage />} />
              </Route>

              <Route element={<AdminOnlyRoute />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
                <Route path="/admin/review-bookings" element={<AdminBookingList />} />
                <Route path="/admin/bookings" element={<Navigate to="/admin/review-bookings" replace />} />
                <Route path="/admin/resources" element={<ResourceManagement />} />
                <Route path="/admin/tickets" element={<TicketListPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ToastProvider>
      </BrowserRouter>
    </div>
  )
}

export default App

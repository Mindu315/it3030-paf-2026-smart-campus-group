import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Admin from './components/Admin'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import AdminBookingList from './components/AdminBookingList'
import BookingHistory from './components/BookingHistory'
import BookingPage from './components/BookingPage'
import ResourceCatalog from './components/ResourceCatalog'
import ResourceManagement from './components/ResourceManagement'
import AdminSettingsPage from './components/AdminSettingsPage'
import AdminTicketsPage from './components/AdminTicketsPage'
import AdminUsersPage from './components/AdminUsersPage'
import NotificationsPage from './components/NotificationsPage'
import TicketCreatePage from './components/TicketCreatePage'
import TicketsPage from './components/TicketsPage'
import DashboardLayout from './components/layout/DashboardLayout'
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

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(125,211,252,0.25),transparent_40%),radial-gradient(circle_at_85%_15%,rgba(110,231,183,0.18),transparent_42%)]" aria-hidden="true"></div>

      <BrowserRouter>
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
            path="/register"
            element={(
              <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <PublicRoute>
                  <Register />
                </PublicRoute>
              </section>
            )}
          />

          <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/notifications" element={<NotificationsPage />} />

              <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
                <Route path="/resources" element={<ResourceCatalog />} />
                <Route path="/bookings" element={<BookingPage />} />
                <Route path="/booking-history" element={<BookingHistory />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/tickets/create" element={<TicketCreatePage />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
                <Route path="/admin/review-bookings" element={<AdminBookingList />} />
                <Route path="/admin/resources" element={<ResourceManagement />} />
                <Route path="/admin/tickets" element={<AdminTicketsPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

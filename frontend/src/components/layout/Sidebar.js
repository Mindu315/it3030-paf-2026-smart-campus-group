import { NavLink, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  ClipboardList,
  Clock,
  LayoutDashboard,
  LogOut,
  Settings,
  Ticket,
  Users,
  Bell,
  Building2,
} from 'lucide-react'

import { clearCurrentUser, hasRole } from '../../utils/auth'

function buildNav() {
  const items = []

  items.push({
    key: 'home',
    to: '/home',
    label: 'Dashboard',
    Icon: LayoutDashboard,
    roles: ['USER', 'ADMIN'],
  })

  items.push({
    key: 'resources',
    to: '/resources',
    label: 'Resources',
    Icon: Building2,
    roles: ['USER'],
  })

  items.push({
    key: 'bookings',
    to: '/bookings',
    label: 'Bookings',
    Icon: CalendarDays,
    roles: ['USER'],
  })

  items.push({
    key: 'booking-history',
    to: '/booking-history',
    label: 'Booking History',
    Icon: Clock,
    roles: ['USER'],
  })

  items.push({
    key: 'tickets',
    to: '/tickets',
    label: 'Tickets',
    Icon: Ticket,
    roles: ['USER'],
  })

  items.push({
    key: 'notifications',
    to: '/notifications',
    label: 'Notifications',
    Icon: Bell,
    roles: ['USER', 'ADMIN'],
  })

  items.push({ key: 'divider-admin', type: 'divider', roles: ['ADMIN'] })

  items.push({
    key: 'admin',
    to: '/admin',
    label: 'Admin Dashboard',
    Icon: ClipboardList,
    roles: ['ADMIN'],
  })

  items.push({
    key: 'admin-users',
    to: '/admin/users',
    label: 'Manage Users',
    Icon: Users,
    roles: ['ADMIN'],
  })

  items.push({
    key: 'admin-review-bookings',
    to: '/admin/review-bookings',
    label: 'Review Bookings',
    Icon: CalendarDays,
    roles: ['ADMIN'],
  })

  items.push({
    key: 'admin-resources',
    to: '/admin/resources',
    label: 'Resource Management',
    Icon: Building2,
    roles: ['ADMIN'],
  })

  items.push({
    key: 'admin-tickets',
    to: '/admin/tickets',
    label: 'Ticket Management',
    Icon: Ticket,
    roles: ['ADMIN'],
  })

  items.push({
    key: 'admin-settings',
    to: '/admin/settings',
    label: 'Settings',
    Icon: Settings,
    roles: ['ADMIN'],
  })

  return items.filter((item) => {
    const roles = item.roles ?? []
    return roles.some((role) => hasRole(role))
  })
}

function SidebarLink({ Icon, label, to, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
          isActive
            ? 'bg-sky-50 text-sky-700 ring-1 ring-sky-100'
            : 'text-slate-700 hover:bg-slate-100',
        ].join(' ')
      }
    >
      <Icon size={18} className="text-slate-500 group-hover:text-slate-700" />
      <span className="truncate">{label}</span>
    </NavLink>
  )
}

function Sidebar({ onNavigate }) {
  const navigate = useNavigate()
  const nav = buildNav()

  const handleLogout = () => {
    clearCurrentUser()
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-[var(--color-card)] px-5 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] shadow-md">
          <span className="text-lg font-bold text-white">SC</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900">Smart Campus Hub</h1>
          <p className="text-xs text-slate-500">Dashboard</p>
        </div>
      </div>

      <nav className="mt-8 flex-1 space-y-2 overflow-y-auto">
        {nav.map((item) => {
          if (item.type === 'divider') {
            return (
              <div key={item.key} className="py-2">
                <div className="h-px bg-slate-200" />
                <p className="mt-3 px-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Admin
                </p>
              </div>
            )
          }

          return (
            <SidebarLink
              key={item.key}
              to={item.to}
              label={item.label}
              Icon={item.Icon}
              onNavigate={onNavigate}
            />
          )
        })}
      </nav>

      <div className="pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50"
        >
          <LogOut size={18} className="text-rose-600" />
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

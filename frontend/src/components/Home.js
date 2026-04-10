import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { clearCurrentUser } from "../utils/auth"
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Bell,
  Building2,
  LogOut,
  UserCircle,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react"

function DashboardHome() {
  const navigate = useNavigate()

  // Dummy data (replace later with API data)
  const stats = [
    { title: "Total Bookings", value: "12", icon: CalendarDays, color: "text-sky-600" },
    { title: "Active Tickets", value: "4", icon: ClipboardList, color: "text-emerald-600" },
    { title: "Unread Notifications", value: "7", icon: Bell, color: "text-violet-600" },
    { title: "Resources Available", value: "18", icon: Building2, color: "text-orange-600" },
  ]

  const activities = [
    { message: "Booking request submitted for Lab A1", time: "2 hours ago" },
    { message: "Ticket updated: Projector issue marked In Progress", time: "5 hours ago" },
    { message: "Booking approved for Meeting Room B2", time: "Yesterday" },
    { message: "New comment added on your ticket", time: "2 days ago" },
  ]

  function handleLogout() {
    // Clear centralized auth session key used by route guards.
    clearCurrentUser()

    // Also clear legacy keys if they exist.
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    navigate("/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <div className="flex">

        {/* Sidebar */}
        <aside className="hidden min-h-screen w-72 flex-col border-r border-slate-200 bg-white px-6 py-6 md:flex">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 shadow-md">
              <span className="text-lg font-bold text-white">SC</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900">Smart Campus Hub</h1>
              <p className="text-xs text-slate-500">Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-10 space-y-2 text-sm font-medium">
            <Link
              to="/home"
              className="flex items-center gap-3 rounded-xl bg-sky-50 px-4 py-3 text-sky-700"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              to="/resources"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100"
            >
              <Building2 size={18} />
              Resources
            </Link>

            <Link
              to="/bookings"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100"
            >
              <CalendarDays size={18} />
              Bookings
            </Link>

            <Link
              to="/tickets"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100"
            >
              <ClipboardList size={18} />
              Tickets
            </Link>

            <Link
              to="/notifications"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100"
            >
              <Bell size={18} />
              Notifications
            </Link>
          </nav>

          {/* Logout */}
          <div className="mt-auto pt-6">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-6 py-8">

          {/* Top Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome back 👋
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Here’s what’s happening in your campus system today.
              </p>
            </div>

            {/* User Card */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <UserCircle className="text-slate-500" size={28} />

              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-800">Umi</p>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  USER ROLE
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        {item.title}
                      </p>
                      <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
                        {item.value}
                      </h3>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
                      <Icon className={item.color} size={22} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Grid */}
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  Recent Activity
                </h3>

                <Link
                  to="/notifications"
                  className="flex items-center gap-1 text-sm font-semibold text-sky-700 hover:text-sky-800"
                >
                  View all <ArrowUpRight size={16} />
                </Link>
              </div>

              <div className="mt-5 space-y-4">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {activity.message}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-slate-900">
                Quick Actions
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Shortcuts to manage tasks faster.
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  to="/bookings/create"
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 hover:bg-sky-100"
                >
                  Create Booking
                  <ArrowUpRight size={16} />
                </Link>

                <Link
                  to="/tickets/new"
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  Report Incident
                  <ArrowUpRight size={16} />
                </Link>

                <Link
                  to="/resources"
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-100"
                >
                  Browse Resources
                  <ArrowUpRight size={16} />
                </Link>

                <Link
                  to="/notifications"
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 hover:bg-orange-100"
                >
                  View Notifications
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              {/* Logout Button inside main (mobile friendly) */}
              <button
                onClick={handleLogout}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-100 md:hidden"
              >
                <LogOut size={18} />
                Logout
              </button>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardHome
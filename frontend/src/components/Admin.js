import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Users,
  ClipboardList,
  CalendarDays,
  ShieldCheck,
  Settings,
  Bell,
  ArrowUpRight,
  UserCircle,
} from "lucide-react"

import { getCurrentUser } from "../utils/auth"

function Admin() {
  const user = getCurrentUser()

  const stats = [
    {
      title: "Registered Users",
      value: "124",
      icon: Users,
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      title: "Open Incident Tickets",
      value: "08",
      icon: ClipboardList,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      title: "Active Facility Bookings",
      value: "37",
      icon: CalendarDays,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Security Status",
      value: "OK",
      icon: ShieldCheck,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ]

  const activities = [
    { title: "New user registered", time: "10 mins ago" },
    { title: "Booking approved by Admin", time: "1 hour ago" },
    { title: "Ticket marked In Progress", time: "4 hours ago" },
    { title: "New notification sent to users", time: "Yesterday" },
  ]

  return (
    <section className="mx-auto max-w-6xl">
        
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-600">
              Admin Dashboard
            </p>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
              Welcome, {user?.name || "Administrator"} 👋
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Manage users, monitor campus operations, and review system activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <UserCircle className="text-slate-500" size={32} />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {user?.email || "admin@campus.com"}
                </p>
                <p className="text-xs font-semibold text-indigo-600">ADMIN</p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
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

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg}`}
                  >
                    <Icon className={item.color} size={22} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.section>

        {/* Main Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Recent System Activity
              </h2>

              <Link
                to="/notifications"
                className="flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:text-indigo-800"
              >
                View Logs <ArrowUpRight size={16} />
              </Link>
            </div>

            <p className="mt-1 text-sm text-slate-600">
              Latest operations recorded in the campus system.
            </p>

            <div className="mt-6 space-y-4">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    System
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Admin Tools */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-slate-900">Admin Tools</h2>
            <p className="mt-1 text-sm text-slate-600">
              Quick shortcuts for admin management tasks.
            </p>

            <div className="mt-6 space-y-3">
              <Link
                to="/admin/users"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 hover:bg-sky-100"
              >
                <span className="flex items-center gap-2">
                  <Users size={18} />
                  Manage Users
                </span>
                <ArrowUpRight size={16} />
              </Link>

              <Link
                to="/admin/review-bookings"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
              >
                <span className="flex items-center gap-2">
                  <CalendarDays size={18} />
                  Review Bookings
                </span>
                <ArrowUpRight size={16} />
              </Link>

              <Link
                to="/admin/tickets"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-100"
              >
                <span className="flex items-center gap-2">
                  <ClipboardList size={18} />
                  Ticket Management
                </span>
                <ArrowUpRight size={16} />
              </Link>

              <Link
                to="/admin/settings"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-100"
              >
                <span className="flex items-center gap-2">
                  <Settings size={18} />
                  System Settings
                </span>
                <ArrowUpRight size={16} />
              </Link>

              <Link
                to="/notifications"
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 hover:bg-orange-100"
              >
                <span className="flex items-center gap-2">
                  <Bell size={18} />
                  Notifications
                </span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <p className="mt-12 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Smart Campus Operations Hub — Admin Panel
        </p>
    </section>
  )
}

export default Admin

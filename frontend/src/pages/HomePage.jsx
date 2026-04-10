import React, { useState, useEffect } from 'react' // 1. Added React hooks
import api from '../api/axiosConfig'
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import {
  CalendarDays,
  ClipboardList,
  Bell,
  Building2,
  UserCircle,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react"
import NotificationService from '../services/notificationService'
import BookingService from '../services/BookingService'
import { getAllTickets } from '../services/ticketService'
import { getAllResources } from '../api/resourceService'

function DashboardHome() {
  const navigate = useNavigate()

  const [unreadCount, setUnreadCount] = useState(0)
  const [bookingsCount, setBookingsCount] = useState('-')
  const [ticketsCount, setTicketsCount] = useState('-')
  const [resourcesCount, setResourcesCount] = useState('-')
  // --- THE FIX: Using the correct key 'smartCampusUser' ---
  const rawData = localStorage.getItem("smartCampusUser");
  const savedUser = rawData ? JSON.parse(rawData) : null;
  const studentId = savedUser?.studentId || savedUser?.id;
  const userName = savedUser?.name || "Student";
  
  const stats = [
    { title: "Total Bookings", value: bookingsCount, icon: CalendarDays, color: "text-sky-600" },
    { title: "Active Tickets", value: ticketsCount, icon: ClipboardList, color: "text-emerald-600" },
    { title: "Unread Notifications", value: unreadCount.toString(), icon: Bell, color: "text-violet-600" },
    { title: "Resources Available", value: resourcesCount, icon: Building2, color: "text-orange-600" },
  ]

  const activities = [
    { message: "Booking request submitted for Lab A1", time: "2 hours ago" },
    { message: "Ticket updated: Projector issue marked In Progress", time: "5 hours ago" },
    { message: "Booking approved for Meeting Room B2", time: "Yesterday" },
    { message: "New comment added on your ticket", time: "2 days ago" },
  ]

    const [recentActivities, setRecentActivities] = useState([])

    const fetchRecent = async () => {
      if (!studentId) return
      try {
        const res = await NotificationService.getByStudent(studentId)
        const list = Array.isArray(res.data) ? res.data : []
        // map to activity shape and take top 4
        const mapped = list.slice(0, 4).map((n) => ({ message: n.message, time: n.timestamp ? new Date(n.timestamp).toLocaleString() : '' }))
        setRecentActivities(mapped)
      } catch (err) {
        console.error('Error fetching recent notifications:', err)
      }
    }

    const fetchCounts = async () => {
      try {
        // Bookings
        const bRes = await BookingService.getAllBookings()
        const bCount = Array.isArray(bRes.data) ? bRes.data.length : (bRes.data?.totalElements ?? '-')
        setBookingsCount(bCount ?? '-')

        // Tickets (paged API returns totalElements)
        const tRes = await getAllTickets({ page: 0, size: 1 })
        const tCount = Array.isArray(tRes.data) ? tRes.data.length : (tRes.data?.totalElements ?? (tRes.data?.length ?? '-'))
        setTicketsCount(tCount ?? '-')

        // Resources
        const rRes = await getAllResources()
        const rCount = Array.isArray(rRes.data) ? rRes.data.length : (rRes.data?.totalElements ?? '-')
        setResourcesCount(rCount ?? '-')
      } catch (err) {
        console.error('Error fetching dashboard counts:', err)
      }
    }


// --- Replace your old 'const studentId = "STU_2026"' with this ---
/*const savedUser = JSON.parse(localStorage.getItem("user"));
console.log("DEBUG: Stored User Object:", savedUser); // <--- Add this
const studentId = savedUser?.studentId || savedUser?.id; */


const fetchNotifications = async () => {
    if (!studentId) return;

    try {
      const countRes = await api.get(`/notifications/unread-count/${studentId}`)
      setUnreadCount(countRes.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

useEffect(() => {
    // Safety: If no user data is found, redirect to login
    if (!savedUser) {
      navigate("/login");
      return;
    }

    fetchNotifications();
    fetchRecent();
    fetchCounts();
  }, [studentId, navigate, savedUser]);


  return (
    <div className="mx-auto max-w-7xl px-0 py-0">

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
                <p className="text-sm font-semibold text-slate-800">{userName}</p>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  {savedUser?.role || "STUDENT"}
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
                {(recentActivities.length ? recentActivities : activities).map((activity, index) => (
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
                <button 
                    onClick={() => navigate('/booking-history')} // Navigate to the new page
                    className="flex items-center justify-between w-full p-4 rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 transition-all"
                >
                    <span className="font-semibold text-blue-600">Booking History</span>
                    <ArrowUpRight className="text-blue-600" size={18} />
                </button>

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
            </motion.div>
          </div>
    </div>
  )
}

export default DashboardHome

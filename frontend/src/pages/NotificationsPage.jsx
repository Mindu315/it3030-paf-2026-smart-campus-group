import { useEffect, useState, useCallback } from 'react'
import { getCurrentUser } from '../utils/auth'
import NotificationService from '../services/notificationService'
import { Bell, Check, X } from 'lucide-react'
import { useToast } from '../components/ui/ToastContext'

function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  return `${days}d`
}

function NotificationsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  const [filter, setFilter] = useState('ALL') // ALL | UNREAD | READ

  const load = useCallback(async () => {
    setLoading(true)
    const user = getCurrentUser()
    const uid = user?.studentId || user?.id
    if (!uid) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      const res = await NotificationService.getByStudent(uid)
      const list = Array.isArray(res.data) ? res.data : []
      setItems(list)
      const unread = list.filter((it) => !it.read).length
      window.dispatchEvent(new CustomEvent('notificationsUpdated', { detail: { unreadCount: unread } }))
    } catch (err) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const markRead = async (id) => {
    try {
      await NotificationService.markAsRead(id)
      const updated = items.map((it) => (it.id === id ? { ...it, read: true } : it))
      setItems(updated)
      const unread = updated.filter((it) => !it.read).length
      window.dispatchEvent(new CustomEvent('notificationsUpdated', { detail: { unreadCount: unread } }))
      toast.push('Marked read', { type: 'success' })
    } catch (err) {
      toast.push('Could not mark read', { type: 'error' })
    }
  }

  const markAllRead = async () => {
    const unread = items.filter((it) => !it.read)
    if (unread.length === 0) {
      toast.push('No unread notifications', { type: 'info' })
      return
    }
    try {
      await Promise.all(unread.map((n) => NotificationService.markAsRead(n.id)))
      const updated = items.map((it) => ({ ...it, read: true }))
      setItems(updated)
      window.dispatchEvent(new CustomEvent('notificationsUpdated', { detail: { unreadCount: 0 } }))
      toast.push(`Marked ${unread.length} notifications`, { type: 'success' })
    } catch (err) {
      toast.push('Failed to mark all as read', { type: 'error' })
    }
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Bell size={22} /> Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-600">Recent system messages for you.</p>
        </div>

        <div className="flex items-center gap-3">
            <div className="inline-flex rounded-md bg-slate-50 p-1">
              <button onClick={() => setFilter('ALL')} className={`px-3 py-1 text-sm font-medium rounded-md ${filter==='ALL' ? 'bg-white shadow-sm' : 'text-slate-600'}`}>All</button>
              <button onClick={() => setFilter('UNREAD')} className={`px-3 py-1 text-sm font-medium rounded-md ${filter==='UNREAD' ? 'bg-white shadow-sm' : 'text-slate-600'}`}>Unread</button>
              <button onClick={() => setFilter('READ')} className={`px-3 py-1 text-sm font-medium rounded-md ${filter==='READ' ? 'bg-white shadow-sm' : 'text-slate-600'}`}>Read</button>
            </div>
            <button onClick={markAllRead} className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700">Mark all read</button>
          </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4">
        {loading && <div className="p-6 rounded-2xl border border-slate-200 bg-white text-sm text-slate-500">Loading notifications…</div>}

        {!loading && items.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <div className="text-6xl">🔔</div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No notifications</h3>
            <p className="mt-2 text-sm text-slate-500">You’re all caught up — we’ll notify you here about approvals, ticket updates, and more.</p>
          </div>
        )}

        {!loading && (() => {
          const filtered = items.filter((it) => (filter === 'ALL') || (filter === 'UNREAD' && !it.read) || (filter === 'READ' && it.read))
          return filtered.map((n) => (
          <article key={n.id} className={`flex items-start gap-4 rounded-2xl border p-4 ${n.read ? 'bg-white' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex-shrink-0">
              <div className="relative">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center bg-slate-100 text-slate-700`}>{n.message?.slice(0,1)}</div>
                {!n.read && <span className="absolute -top-1 -right-1 inline-block h-3 w-3 rounded-full bg-rose-500 ring-2 ring-white" />}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">{n.message}</p>
                  <p className="mt-1 text-xs text-slate-500">{n.timestamp ? timeAgo(n.timestamp) + ' • ' + new Date(n.timestamp).toLocaleString() : ''}</p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2">
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white flex items-center gap-2">
                      <Check size={14} /> Mark
                    </button>
                  )}
                  <button onClick={() => { navigator.clipboard?.writeText(n.message || '') ; toast.push('Copied message', { type: 'success' }) }} className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </article>
          ))
        })()}
      </div>
    </section>
  )
}

export default NotificationsPage


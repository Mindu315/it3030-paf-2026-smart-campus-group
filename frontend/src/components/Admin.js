import { useNavigate } from 'react-router-dom'
import { clearCurrentUser, getCurrentUser } from '../utils/auth'

const summaryRows = [
  { metric: 'Registered Users', value: '124' },
  { metric: 'Open Incident Tickets', value: '08' },
  { metric: 'Active Facility Bookings', value: '37' },
]

function Admin() {
  const navigate = useNavigate()
  const user = getCurrentUser()

  function handleLogout() {
    clearCurrentUser()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_15px_45px_-35px_rgba(15,23,42,0.35)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-slate-500">Admin Dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Welcome, {user?.name || 'Administrator'}</h1>
          <p className="mt-2 text-sm text-slate-600">Overview of user management and campus system health.</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Logout
        </button>
      </header>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">System Overview</h2>
        <p className="mt-1 text-sm text-slate-600">Placeholder metrics for all smart campus users and operations.</p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-3 py-2 font-semibold">Metric</th>
                <th className="px-3 py-2 font-semibold">Value</th>
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((row) => (
                <tr key={row.metric} className="border-b border-slate-100 last:border-0">
                  <td className="px-3 py-3 text-slate-700">{row.metric}</td>
                  <td className="px-3 py-3 font-semibold text-slate-900">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Admin

import { useNavigate } from 'react-router-dom'
import { clearCurrentUser, getCurrentUser } from '../utils/auth'

function Home() {
  const navigate = useNavigate()
  const user = getCurrentUser()

  function handleLogout() {
    clearCurrentUser()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_15px_45px_-35px_rgba(15,23,42,0.35)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-slate-500">User Dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Welcome, {user?.name || 'Campus User'}</h1>
          <p className="mt-2 text-sm text-slate-600">Monitor your tasks and campus requests from one place.</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Logout
        </button>
      </header>

      <section className="mt-6 grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">My Bookings</h2>
          <p className="mt-2 text-sm text-slate-600">Classroom, lab, and resource bookings will appear here.</p>
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            No active bookings yet.
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">My Incident Tickets</h2>
          <p className="mt-2 text-sm text-slate-600">Track maintenance and safety requests in real time.</p>
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            No incident tickets submitted.
          </div>
        </article>
      </section>
    </div>
  )
}

export default Home

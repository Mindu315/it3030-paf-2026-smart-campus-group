import { Link } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'

function TicketsPage() {
  return (
    <section className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tickets</h1>
          <p className="mt-1 text-sm text-slate-600">
            Track incidents and maintenance requests.
          </p>
        </div>

        <Link
          to="/tickets/create"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
        >
          <PlusCircle size={18} />
          New Ticket
        </Link>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Ticket UI is not implemented yet. Add the ticket form/list here once the
        backend endpoints are ready.
      </div>
    </section>
  )
}

export default TicketsPage


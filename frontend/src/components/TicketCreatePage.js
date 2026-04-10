import { useNavigate } from 'react-router-dom'

function TicketCreatePage() {
  const navigate = useNavigate()

  return (
    <section className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Report Incident</h1>
          <p className="mt-1 text-sm text-slate-600">
            Create a new support ticket.
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Ticket creation form is not implemented yet.
      </div>
    </section>
  )
}

export default TicketCreatePage


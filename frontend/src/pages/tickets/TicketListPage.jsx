import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TicketCard from '../../components/tickets/TicketCard'
import { deleteTicket, getAllTickets, getMyTickets } from '../../services/ticketService'
import { hasRole } from '../../utils/auth'

function TicketListPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const isAdmin = hasRole('ADMIN')

  useEffect(() => {
    loadTickets()
  }, [isAdmin])

  const loadTickets = async () => {
      try {
        setLoading(true)
        const res = isAdmin ? await getAllTickets({ page: 0, size: 10 }) : await getMyTickets(0, 10)
        setTickets(res.data.content || [])
      } catch {
        setTickets([])
      } finally {
        setLoading(false)
      }
  }

  const handleDelete = async (ticketId) => {
    if (!window.confirm('Delete this ticket?')) return
    await deleteTicket(ticketId)
    loadTickets()
  }

  return (
    <section className="mx-auto max-w-4xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isAdmin ? 'All Tickets' : 'My Tickets'}</h1>
        <div className="flex items-center gap-2">
          <Link to={isAdmin ? '/admin' : '/home'} className="rounded border border-slate-300 px-3 py-2 text-slate-700">Back</Link>
          <Link to="/tickets/new" className="rounded bg-slate-900 px-3 py-2 text-white">New Ticket</Link>
        </div>
      </div>
      {loading && <p className="text-sm text-slate-500">Loading tickets...</p>}
      {!loading && !tickets.length ? (
        <p data-testid="empty-state" className="rounded border border-dashed p-4 text-slate-600">No tickets found.</p>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  )
}

export default TicketListPage

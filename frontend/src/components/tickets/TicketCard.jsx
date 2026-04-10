import { Link } from 'react-router-dom'
import TicketStatusBadge from './TicketStatusBadge'
import { getCurrentUser, hasRole } from '../../utils/auth'

function TicketCard({ ticket, onDelete }) {
  const currentUser = getCurrentUser()
  const canDelete = hasRole('ADMIN') || currentUser?.id === ticket.reportedByUserId

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link to={`/tickets/${ticket.id}`} className="text-lg font-semibold text-slate-900 hover:underline">{ticket.title}</Link>
          <p className="text-sm text-slate-600">{ticket.category || 'Uncategorized'} • {ticket.location}</p>
          <p className="mt-1 text-xs text-slate-500">Assigned: {ticket.assignedTechnicianName || 'Not assigned'}</p>
        </div>
        <TicketStatusBadge status={ticket.status} />
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-slate-700">{ticket.description}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="rounded bg-slate-100 px-2 py-1">Priority: {ticket.priority || 'N/A'}</span>
        <span className="rounded bg-slate-100 px-2 py-1">Attachments: {ticket.attachmentUrls?.length || 0}</span>
      </div>
      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete?.(ticket.id)}
          className="mt-3 rounded px-3 py-1 text-xs font-medium btn-delete"
        >
          Delete
        </button>
      )}
    </div>
  )
}

export default TicketCard

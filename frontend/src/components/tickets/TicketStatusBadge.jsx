const STATUS_CLASSES = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-slate-200 text-slate-700',
  REJECTED: 'bg-red-100 text-red-700',
}

function TicketStatusBadge({ status = 'OPEN' }) {
  return (
    <span data-testid="status-badge" className={`rounded-full px-2 py-1 text-xs font-semibold ${STATUS_CLASSES[status] || STATUS_CLASSES.OPEN}`}>
      {status}
    </span>
  )
}

export default TicketStatusBadge

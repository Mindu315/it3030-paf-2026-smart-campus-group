import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AttachmentGallery from '../../components/tickets/AttachmentGallery'
import CommentSection from '../../components/tickets/CommentSection'
import TicketStatusBadge from '../../components/tickets/TicketStatusBadge'
import { getTicketById, updateTicketStatus } from '../../services/ticketService'
import { getCurrentUser, hasRole } from '../../utils/auth'

function TicketDetailPage() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState('')
  const [statusData, setStatusData] = useState({ status: 'IN_PROGRESS', resolutionNotes: '' })
  const [statusError, setStatusError] = useState('')
  const [statusSuccess, setStatusSuccess] = useState('')

  const loadTicket = async () => {
    try {
      const res = await getTicketById(id)
      setTicket(res.data)
    } catch {
      setError('Ticket not found')
    }
  }

  useEffect(() => { loadTicket() }, [id])
  useEffect(() => {
    if (!ticket) return
    if (ticket.status === 'OPEN') setStatusData((prev) => ({ ...prev, status: 'IN_PROGRESS' }))
    if (ticket.status === 'IN_PROGRESS') setStatusData((prev) => ({ ...prev, status: 'RESOLVED' }))
    if (ticket.status === 'RESOLVED') setStatusData((prev) => ({ ...prev, status: 'CLOSED' }))
  }, [ticket?.status])

  if (error) return <p className="p-4">{error}</p>
  if (!ticket) return <p className="p-4">Loading...</p>
  const availableNextStatuses = ticket.status === 'OPEN'
    ? ['IN_PROGRESS']
    : ticket.status === 'IN_PROGRESS'
      ? ['RESOLVED']
      : ticket.status === 'RESOLVED'
        ? ['CLOSED']
        : []
  const currentUser = getCurrentUser()
  const canUpdateStatus = hasRole('ADMIN') || hasRole('TECHNICIAN') || currentUser?.id === ticket.assignedTechnicianId

  const submitStatus = async () => {
    setStatusError('')
    setStatusSuccess('')
    if (!availableNextStatuses.length) {
      setStatusError(`No valid status transition from ${ticket.status}`)
      return
    }
    if (statusData.status === 'RESOLVED' && !statusData.resolutionNotes.trim()) {
      setStatusError('Resolution notes are required for RESOLVED')
      return
    }
    try {
      await updateTicketStatus(ticket.id, statusData)
      setStatusSuccess('Status updated successfully')
      await loadTicket()
    } catch (err) {
      setStatusError(err?.response?.data?.message || 'Failed to update status')
    }
  }

  return (
    <section className="mx-auto max-w-4xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <Link className="inline-block text-sm text-blue-700" to="/tickets">Back</Link>
        <Link className="text-sm text-slate-700 underline" to={`/tickets/${ticket.id}/edit`}>Edit</Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">{ticket.title}</h1>
          <TicketStatusBadge status={ticket.status} />
        </div>

        <div className="grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <p><span className="font-medium">Priority:</span> {ticket.priority || 'N/A'}</p>
          <p><span className="font-medium">Category:</span> {ticket.category || 'N/A'}</p>
          <p><span className="font-medium">Location:</span> {ticket.location || 'N/A'}</p>
          <p><span className="font-medium">Resource ID:</span> {ticket.resourceId || 'N/A'}</p>
          <p><span className="font-medium">Reported by:</span> {ticket.reportedByEmail || 'N/A'}</p>
          <p><span className="font-medium">Created:</span> {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}</p>
          <p><span className="font-medium">Assigned to:</span> {ticket.assignedTechnicianName || 'Not assigned'}</p>
        </div>

        <div className="mt-4">
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Description</h3>
          <p className="rounded bg-slate-50 p-3 text-slate-800">{ticket.description}</p>
        </div>

        <div className="mt-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Attachments</h3>
          <AttachmentGallery attachments={ticket.attachmentUrls || []} />
        </div>

        {canUpdateStatus && (
          <div className="mt-4 rounded border border-slate-200 p-3">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Update Status</h3>
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                value={statusData.status}
                onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
                className="rounded border p-2 text-sm"
              >
                {availableNextStatuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <input
                placeholder="Resolution notes (required for RESOLVED)"
                value={statusData.resolutionNotes}
                onChange={(e) => setStatusData({ ...statusData, resolutionNotes: e.target.value })}
                className="flex-1 rounded border p-2 text-sm"
              />
              <button onClick={submitStatus} className="rounded bg-slate-900 px-3 py-2 text-sm text-white">Apply</button>
            </div>
            {statusError && <p className="mt-2 text-sm text-rose-600">{statusError}</p>}
            {statusSuccess && <p className="mt-2 text-sm text-emerald-600">{statusSuccess}</p>}
          </div>
        )}
      </div>

      <CommentSection ticketId={id} />
    </section>
  )
}

export default TicketDetailPage

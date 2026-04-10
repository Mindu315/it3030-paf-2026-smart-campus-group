import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getTicketById, updateTicket } from '../../services/ticketService'

function EditTicketPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTicketById(id)
        setForm({
          title: res.data.title || '',
          category: res.data.category || '',
          priority: res.data.priority || '',
          location: res.data.location || '',
          resourceId: res.data.resourceId || '',
          description: res.data.description || '',
          preferredContactEmail: res.data.preferredContactEmail || '',
          preferredContactPhone: res.data.preferredContactPhone || '',
        })
      } catch {
        setError('Unable to load ticket')
      }
    }
    load()
  }, [id])

  const submit = async (e) => {
    e.preventDefault()
    await updateTicket(id, form)
    navigate(`/tickets/${id}`)
  }

  if (error) return <p className="p-4">{error}</p>
  if (!form) return <p className="p-4">Loading...</p>

  return (
    <section className="mx-auto max-w-3xl p-4">
      <Link to={`/tickets/${id}`} className="mb-3 inline-block text-sm text-blue-700">Back</Link>
      <h1 className="mb-4 text-2xl font-bold">Edit Ticket</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full rounded border p-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="w-full rounded border p-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="w-full rounded border p-2" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
        <input className="w-full rounded border p-2" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input className="w-full rounded border p-2" value={form.resourceId} onChange={(e) => setForm({ ...form, resourceId: e.target.value })} />
        <textarea className="w-full rounded border p-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="w-full rounded border p-2" value={form.preferredContactEmail} onChange={(e) => setForm({ ...form, preferredContactEmail: e.target.value })} />
        <input className="w-full rounded border p-2" value={form.preferredContactPhone} onChange={(e) => setForm({ ...form, preferredContactPhone: e.target.value })} />
        <button className="rounded bg-slate-900 px-4 py-2 text-white">Save</button>
      </form>
    </section>
  )
}

export default EditTicketPage

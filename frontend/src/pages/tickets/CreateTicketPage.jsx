import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AttachmentUploader from '../../components/tickets/AttachmentUploader'
import { createTicket } from '../../services/ticketService'

const initial = { title: '', category: '', priority: '', location: '', resourceId: '', description: '', preferredContactEmail: '', preferredContactPhone: '' }

function CreateTicketPage() {
  const [form, setForm] = useState(initial)
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const remaining = useMemo(() => 1000 - form.description.length, [form.description])

  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = 'title is required'
    if (!form.description.trim()) next.description = 'description is required'
    if (!form.location.trim()) next.location = 'location is required'
    if (!form.category.trim()) next.category = 'category is required'
    if (!form.priority.trim()) next.priority = 'priority is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => v && formData.append(k, v))
    files.forEach((file) => formData.append('attachments', file))
    try {
      const res = await createTicket(formData)
      navigate(`/tickets/${res.data.id}`)
    } catch (err) {
      setErrors((err.response?.data?.details) || { form: 'Failed to create ticket' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-3xl p-4">
      <Link to="/tickets" className="mb-3 inline-block text-sm text-blue-700">Back</Link>
      <h1 className="mb-4 text-2xl font-bold">Create Ticket</h1>
      <form onSubmit={submit} className="space-y-3">
        <label className="block">Title<input aria-label="title" className="w-full rounded border p-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
        <label className="block">Category<select aria-label="category" className="w-full rounded border p-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="">Select</option><option>IT_EQUIPMENT</option><option>ELECTRICAL</option><option>PLUMBING</option><option>STRUCTURAL</option><option>OTHER</option></select></label>
        <label className="block">Priority<select aria-label="priority" className="w-full rounded border p-2" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option value="">Select</option><option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>CRITICAL</option></select></label>
        <label className="block">Location<input aria-label="location" className="w-full rounded border p-2" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
        {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
        <label className="block">Resource ID<input className="w-full rounded border p-2" value={form.resourceId} onChange={(e) => setForm({ ...form, resourceId: e.target.value })} /></label>
        <label className="block">Description<textarea aria-label="description" maxLength={1000} className="w-full rounded border p-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <p className="text-xs text-slate-500">{remaining}</p>
        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
        <label className="block">Preferred Contact Email<input type="email" className="w-full rounded border p-2" value={form.preferredContactEmail} onChange={(e) => setForm({ ...form, preferredContactEmail: e.target.value })} /></label>
        <label className="block">Preferred Contact Phone<input type="tel" className="w-full rounded border p-2" value={form.preferredContactPhone} onChange={(e) => setForm({ ...form, preferredContactPhone: e.target.value })} /></label>
        <AttachmentUploader files={files} onChange={setFiles} />
        {errors.form && <p className="text-sm text-red-600">{errors.form}</p>}
        <button disabled={submitting} type="submit" className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit'}</button>
      </form>
    </section>
  )
}

export default CreateTicketPage

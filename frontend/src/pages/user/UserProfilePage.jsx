import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserService from '../../services/userService'
import { getCurrentUser, saveUser, clearCurrentUser } from '../../utils/auth'

function UserProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getCurrentUser())
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })

  useEffect(() => {
    if (!user?.id) return
    // fetch fresh user data if available
    UserService.getUserById(user.id)
      .then((res) => setUser(res.data || user))
      .catch(() => {})
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async () => {
    try {
      const res = await UserService.updateUser(user.id, form)
      saveUser(res.data)
      setUser(res.data)
      setEditing(false)
    } catch (err) {
      console.error(err)
      alert('Failed to update profile')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete your account? This cannot be undone.')) return
    try {
      await UserService.deleteUser(user.id)
      clearCurrentUser()
      localStorage.removeItem('token')
      navigate('/login')
    } catch (err) {
      console.error(err)
      alert('Failed to delete account')
    }
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-2 text-sm text-slate-600">No user data available. Please login.</p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      <p className="mt-1 text-sm text-slate-600">View and update your account details.</p>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input
              name="name"
              value={editing ? form.name : user.name}
              onChange={handleChange}
              readOnly={!editing}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              value={editing ? form.email : user.email}
              onChange={handleChange}
              readOnly={!editing}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
            />
          </div>

          <div className="flex gap-2 pt-3">
            {editing ? (
              <>
                <button onClick={handleSave} className="rounded bg-sky-600 px-4 py-2 text-white">Save</button>
                <button onClick={() => setEditing(false)} className="rounded border px-4 py-2">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => { setEditing(true); setForm({ name: user.name, email: user.email }) }} className="rounded bg-sky-600 px-4 py-2 text-white">Edit</button>
                <button onClick={handleDelete} className="rounded px-4 py-2 btn-delete">Delete Account</button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserProfilePage

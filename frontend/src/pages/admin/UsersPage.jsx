import { useEffect, useState } from 'react'
import UserService from '../../services/userService'

function AdminUsersPage() {
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    try {
      const res = await UserService.getAllUsers()
      setUsers(res.data || [])
    } catch (err) {
      console.error(err)
      setUsers([])
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete user?')) return
    try {
      await UserService.deleteUser(id)
      fetchUsers()
    } catch (err) {
      console.error(err)
      alert('Delete failed')
    }
  }

  return (
    <section className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-bold text-slate-900">Manage Users</h1>
      <p className="mt-1 text-sm text-slate-600">View, search, and remove users.</p>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            {users.length === 0 ? (
          <p className="text-sm text-slate-500">No users found.</p>
        ) : (
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-semibold text-slate-800">{u.name || u.email}</div>
                  <div className="text-xs text-slate-500">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDelete(u.id)} className="px-2 py-1 btn-delete text-sm rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminUsersPage


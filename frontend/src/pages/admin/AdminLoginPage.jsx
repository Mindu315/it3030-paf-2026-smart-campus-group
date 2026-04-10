import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

import api from '../../api/axiosConfig'
import { getLandingRoute, saveUser } from '../../utils/auth'

const initialForm = {
  email: 'admin@smart.com',
  password: '',
}

function AdminLogin() {
  const [formData, setFormData] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await api.post('/admin/login', formData)
      const user = response.data
      saveUser(user)
      navigate(getLandingRoute(user), { replace: true })
    } catch (requestError) {
      const message =
        requestError.response?.data || 'Admin login failed. Please try again.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[var(--color-background)] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)] shadow-md">
            <span className="text-xl font-bold text-white">SC</span>
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Admin Login
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Sign in to manage Smart Campus.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Admin Email
            </label>

            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Admin123@"
                className="w-full rounded-2xl border border-slate-300 bg-white py-2.5 pl-10 pr-12 text-sm text-slate-900 outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-sky-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--color-secondary)] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Student login?{' '}
          <Link to="/login" className="font-semibold text-sky-700 hover:text-sky-800">
            Go to Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AdminLogin

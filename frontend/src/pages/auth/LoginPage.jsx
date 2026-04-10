import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { GoogleLogin } from "@react-oauth/google"
import api from "../../api/axiosConfig"
import { getLandingRoute, saveUser } from "../../utils/auth"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

const initialForm = {
  email: "",
  password: "",
}

function Login() {
  const [formData, setFormData] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await api.post("/api/users/login", formData)
      const user = response.data
      saveUser(user)
      navigate(getLandingRoute(user), { replace: true })
    } catch (requestError) {
      const message =
        requestError.response?.data || "Login failed. Please check your credentials."
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-sky-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.35)]">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-600 shadow-md">
            <span className="text-xl font-bold text-white">SC</span>
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Smart Campus Hub
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Login to access your dashboard and campus services.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@campus.edu"
                className="w-full rounded-2xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-slate-300 bg-white py-2.5 pl-10 pr-12 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              Remember me
            </label>

            <button
              type="button"
              className="font-medium text-sky-700 hover:text-sky-800"
            >
              Forgot password?
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sky-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-sky-300"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>

          {/* Separator */}
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative bg-white px-2 text-sm text-slate-500">Or</div>
          </div>

          {/* Google Login */}
          <div className="flex w-full justify-center">
            <GoogleLogin
              theme="outline"
              size="large"
              width="100%"
              onSuccess={async (credentialResponse) => {
                try {
                  const response = await api.post('/users/google-login', { token: credentialResponse.credential })
                  const user = response.data
                  saveUser(user)
                  navigate(getLandingRoute(user), { replace: true })
                } catch (requestError) {
                  const message = requestError.response?.data || "Google Login failed."
                  setError(message)
                }
              }}
              onError={() => {
                setError("Google Login failed.")
              }}
            />
          </div>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Create Account
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Smart Campus Operations Hub
        </p>
      </div>
    </div>
  )
}

export default Login

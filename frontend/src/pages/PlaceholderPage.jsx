import { Link } from 'react-router-dom'

function PlaceholderPage({ title = 'Coming Soon' }) {
  return (
    <section className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-slate-600">This page is not implemented yet.</p>
      <Link to="/" className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 text-white">
        Back to dashboard
      </Link>
    </section>
  )
}

export default PlaceholderPage

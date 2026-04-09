function ResourceDetailsModal({ resource, isOpen, onClose }) {
  if (!isOpen || !resource) {
    return null
  }

  const statusBadgeClass =
    resource.status === 'OUT_OF_SERVICE'
      ? 'bg-red-100 text-red-700'
      : resource.status === 'ACTIVE'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-emerald-100 text-emerald-700'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              {resource.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{resource.type}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Capacity
            </p>
            <p className="mt-1 text-sm text-slate-800">{resource.capacity}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Location
            </p>
            <p className="mt-1 text-sm text-slate-800">{resource.location}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Availability Start
            </p>
            <p className="mt-1 text-sm text-slate-800">
              {resource.availabilityStart}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Availability End
            </p>
            <p className="mt-1 text-sm text-slate-800">
              {resource.availabilityEnd}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </p>
            <div className="mt-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass}`}
              >
                {resource.status}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-800">
              {resource.description?.trim()
                ? resource.description
                : 'No description provided'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceDetailsModal
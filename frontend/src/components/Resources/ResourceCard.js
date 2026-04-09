function ResourceCard({ resource, onView }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            {resource.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{resource.type}</p>
        </div>

        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            resource.status === 'OUT_OF_SERVICE'
              ? 'bg-red-100 text-red-700'
              : resource.status === 'ACTIVE'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {resource.status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-medium text-slate-700">Location:</span>{' '}
          {resource.location}
        </p>
        <p>
          <span className="font-medium text-slate-700">Capacity:</span>{' '}
          {resource.capacity}
        </p>
        <p>
          <span className="font-medium text-slate-700">Availability:</span>{' '}
          {resource.availabilityStart} - {resource.availabilityEnd}
        </p>
        <p>
          <span className="font-medium text-slate-700">Description:</span>{' '}
          {resource.description?.trim()
            ? resource.description
            : 'No description provided'}
        </p>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => onView(resource)}
          className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-700"
        >
          View Details
        </button>
      </div>
    </div>
  )
}

export default ResourceCard
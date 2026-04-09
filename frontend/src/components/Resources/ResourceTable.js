function ResourceTable({ resources, onView, onEdit, onDelete }) {
  if (!resources || resources.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <h3 className="text-lg font-semibold text-slate-700">No resources found</h3>
        <p className="mt-2 text-sm text-slate-500">
          There are no resources to display right now.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Capacity</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Location</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Availability</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {resources.map((resource) => (
              <tr key={resource.id} className="hover:bg-slate-50">
                <td className="px-4 py-4 text-sm font-medium text-slate-800">
                  {resource.name}
                </td>

                <td className="px-4 py-4 text-sm text-slate-600">
                  {resource.type}
                </td>

                <td className="px-4 py-4 text-sm text-slate-600">
                  {resource.capacity}
                </td>

                <td className="px-4 py-4 text-sm text-slate-600">
                  {resource.location}
                </td>

                <td className="px-4 py-4 text-sm text-slate-600">
                  {resource.availabilityStart} - {resource.availabilityEnd}
                </td>

                <td className="px-4 py-4 text-sm">
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
                </td>

                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onView(resource)}
                      className="rounded-lg bg-sky-100 px-3 py-1.5 text-xs font-medium text-sky-700 transition hover:bg-sky-200"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(resource)}
                      className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-200"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(resource)}
                      className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResourceTable
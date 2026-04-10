import { RESOURCE_STATUSES, RESOURCE_TYPES } from '../../utils/ResourceConstants'

function ResourceFilterBar({ filters, onChange, onApply, onReset }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[var(--color-card)] p-3 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5 items-end">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
          >
            <option value="">All Types</option>
            {RESOURCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Location</label>
          <input
            name="location"
            type="text"
            value={filters.location}
            onChange={onChange}
            placeholder="e.g. Building A"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Min Capacity</label>
          <input
            name="minCapacity"
            type="number"
            min="1"
            value={filters.minCapacity}
            onChange={onChange}
            placeholder="e.g. 20"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[var(--text-primary)] outline-none"
          >
            <option value="">All Statuses</option>
            {RESOURCE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-slate-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onApply}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResourceFilterBar


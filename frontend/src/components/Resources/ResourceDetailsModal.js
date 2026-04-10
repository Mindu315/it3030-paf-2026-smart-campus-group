import { MapPin, Users, Clock, Info, X } from 'lucide-react'

function ResourceDetailsModal({ resource, isOpen, onClose }) {
  if (!isOpen || !resource) return null

  const statusBadge = (status) => {
    const base = 'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold'
    if (status === 'OUT_OF_SERVICE') return `${base} bg-red-50 text-red-700`
    if (status === 'ACTIVE') return `${base} bg-[rgba(37,99,235,0.08)] text-[var(--color-primary)]`
    return `${base} bg-emerald-50 text-emerald-700`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" aria-modal="true" role="dialog">
      {/* overlay */}
      <div className="absolute inset-0 bg-[rgba(6,11,33,0.72)] backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl bg-[#dfe9f6] p-6 sm:p-8 shadow-[0_18px_50px_rgba(2,6,23,0.32)] ring-1 ring-black/5">
        {/* gradient accent */}
        <div className="absolute -top-1 left-6 right-6 h-1 rounded-t-2xl" style={{ background: 'var(--gradient)' }} />

        {/* header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[rgba(37,99,235,0.14)] to-[rgba(124,58,237,0.10)] ring-1 ring-[rgba(37,99,235,0.08)] shadow-sm">
              <Info className="h-6 w-6 text-[var(--color-primary)]" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] leading-tight">{resource.name}</h2>
              <div className="mt-1 flex items-center gap-3">
                <p className="text-sm text-[var(--text-secondary)]">{resource.type}</p>
                <p className="text-xs text-[var(--text-secondary)]">•</p>
                <p className="text-xs font-mono text-[var(--text-secondary)]">ID: {resource.id ?? '—'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--text-secondary)] bg-white/60 hover:bg-white transition border border-transparent shadow-sm"
              aria-label="Close details"
            >
              <X className="h-4 w-4" />
              Close
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg bg-[var(--color-card)] border border-[rgba(37,99,235,0.06)] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              <Users className="inline-block mr-2 -mt-0.5 h-4 w-4 text-[var(--color-primary)]" />
              Capacity
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{resource.capacity}</p>
          </div>

          <div className="rounded-lg bg-[var(--color-card)] border border-[rgba(37,99,235,0.06)] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              <MapPin className="inline-block mr-2 -mt-0.5 h-4 w-4 text-[var(--color-primary)]" />
              Location
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{resource.location}</p>
          </div>

          <div className="rounded-lg bg-[rgba(37,99,235,0.02)] border border-[rgba(37,99,235,0.06)] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              <Clock className="inline-block mr-2 -mt-0.5 h-4 w-4 text-[var(--color-primary)]" />
              Availability Start
            </p>
            <p className="mt-2 text-sm text-[var(--text-primary)]">{resource.availabilityStart}</p>
          </div>

          <div className="rounded-lg bg-[rgba(37,99,235,0.02)] border border-[rgba(37,99,235,0.06)] p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              <Clock className="inline-block mr-2 -mt-0.5 h-4 w-4 text-[var(--color-primary)]" />
              Availability End
            </p>
            <p className="mt-2 text-sm text-[var(--text-primary)]">{resource.availabilityEnd}</p>
          </div>

          <div className="rounded-lg bg-[var(--color-card)] border border-[rgba(37,99,235,0.06)] p-4 shadow-sm md:col-span-2 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Status</p>
              <div className="mt-2">
                <span className={statusBadge(resource.status)}>{resource.status}</span>
              </div>
            </div>

            {/* resource ID removed from here; placed under title for better hierarchy */}
            <div className="hidden md:block text-right">
              <p className="text-xs text-[var(--text-secondary)]">Last updated</p>
              <p className="mt-1 text-sm text-[var(--text-primary)]">{resource.updatedAt ?? '—'}</p>
            </div>
          </div>

          <div className="rounded-lg bg-[rgba(124,58,237,0.03)] border border-[rgba(124,58,237,0.06)] p-5 shadow-sm md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Description</p>
            <p className="mt-3 text-sm leading-7 text-[var(--text-primary)]">{resource.description?.trim() ? resource.description : 'No description provided'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceDetailsModal
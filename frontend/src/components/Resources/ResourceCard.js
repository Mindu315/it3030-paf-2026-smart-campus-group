import { MapPin, Users, Clock, Camera, Monitor } from 'lucide-react'

function ResourceCard({ resource, onView }) {
  const getBadgeClasses = (status) => {
    if (!status) return 'bg-slate-100 text-[var(--text-primary)]'
    if (status === 'OUT_OF_SERVICE') return 'bg-red-100 text-red-700 font-medium'
    if (status === 'ACTIVE') return 'bg-blue-100 text-blue-700 font-medium'
    if (status === 'AVAILABLE') return 'bg-green-100 text-green-700 font-medium'
    return 'bg-slate-100 text-[var(--text-primary)]'
  }

  const typeIcon = (type) => {
    if (!type) return Monitor
    const t = String(type).toUpperCase()
    if (t.includes('LAB')) return Monitor
    if (t.includes('LECTURE') || t.includes('HALL')) return Monitor
    if (t.includes('MEETING')) return Users
    if (t.includes('PROJECTOR')) return Monitor
    if (t.includes('CAMERA')) return Camera
    return Monitor
  }

  const Icon = typeIcon(resource.type)

  const iconBg = (type) => {
    const t = String(type || '').toUpperCase()
    if (t.includes('LAB')) return 'bg-[rgba(124,58,237,0.08)] text-[var(--color-accent)]'
    if (t.includes('LECTURE') || t.includes('HALL')) return 'bg-[rgba(37,99,235,0.08)] text-[var(--color-primary)]'
    if (t.includes('MEETING')) return 'bg-[rgba(14,165,233,0.06)] text-[var(--color-secondary)]'
    if (t.includes('PROJECTOR')) return 'bg-[rgba(37,99,235,0.06)] text-[var(--color-primary)]'
    if (t.includes('CAMERA')) return 'bg-[rgba(124,58,237,0.06)] text-[var(--color-accent)]'
    return 'bg-[rgba(15,23,42,0.03)] text-[var(--text-primary)]'
  }

  return (
    <div
      className="group rounded-2xl bg-[#eae7fa] p-4 shadow-sm transition-transform transform hover:-translate-y-1 hover:shadow-lg border w-full"
      style={{ borderColor: 'rgba(14,165,233,0.04)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`flex h-11 w-11 flex-none items-center justify-center rounded-lg ${iconBg(resource.type)} transition-transform group-hover:scale-105`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-[var(--text-primary)]">{resource.name}</h3>
            <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{resource.type}</p>
          </div>
        </div>

        <div className="flex-shrink-0">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${getBadgeClasses(resource.status)}`}>
            {resource.status}
          </span>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3 pb-3">
        <div className="grid grid-cols-1 gap-2 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--text-primary)]" />
            <span className="text-[var(--text-primary)] font-medium">Location:</span>
            <span className="ml-1 truncate">{resource.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[var(--text-primary)]" />
            <span className="text-[var(--text-primary)] font-medium">Capacity:</span>
            <span className="ml-1">{resource.capacity}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[var(--text-primary)]" />
            <span className="text-[var(--text-primary)] font-medium">Availability:</span>
            <span className="ml-1">{resource.availabilityStart} - {resource.availabilityEnd}</span>
          </div>
        </div>
      </div>

      <div className="pt-3">
        <p className="text-sm text-[var(--text-secondary)] leading-5">
          {resource.description?.trim() ? resource.description : 'No description provided'}
        </p>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => onView(resource)}
          className="inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
          style={{ background: 'var(--color-primary)', boxShadow: '0 8px 24px rgba(37,99,235,0.12)' }}
        >
          View Details
        </button>
      </div>
    </div>
  )
}

export default ResourceCard
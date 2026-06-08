import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bell,
  Building2,
  CalendarDays,
  Database,
  Download,
  Laptop,
  Lock,
  RefreshCcw,
  Save,
  Server,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Ticket,
  Users,
} from 'lucide-react'

import { useToast } from '../../components/ui/ToastContext'
import { getCurrentUser } from '../../utils/auth'

const STORAGE_KEY = 'smart-campus-admin-settings'

const defaultSettings = {
  appName: 'Smart Campus Hub',
  supportEmail: 'support@smartcampus.edu',
  timezone: 'Asia/Colombo',
  language: 'English',
  sessionTimeout: '30 minutes',
  idleLogout: '15 minutes',
  theme: 'System',
  accent: 'Sky',
  density: 'Comfortable',
  backupSchedule: 'Daily at 02:00',
  retention: '90 days',
  mfaRequired: true,
  maintenanceMode: false,
  emailDigest: true,
  pushAlerts: true,
  bookingReminders: true,
  ticketEscalation: true,
  autoBackups: true,
  auditTrail: true,
}

const toneStyles = {
  sky: 'bg-sky-50 text-sky-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  violet: 'bg-violet-50 text-violet-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-700',
}

const inputClasses =
  'mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100'

function SectionCard({ icon: Icon, eyebrow, title, description, delay = 0, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
          <Icon size={20} />
        </div>

        <div>
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 text-lg font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </motion.section>
  )
}

function TextField({ label, description, name, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      {description && (
        <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClasses}
      />
    </label>
  )
}

function SelectField({ label, description, name, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      {description && (
        <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
      )}
      <select name={name} value={value} onChange={onChange} className={inputClasses}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function ToggleField({ label, description, checked, onChange, icon: Icon }) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-slate-100/60">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm ring-1 ring-slate-200">
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>

      <span className="relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-sky-600" />
        <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
      </span>
    </label>
  )
}

function StatCard({ icon: Icon, label, value, tone = 'sky' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{value}</p>
        </div>

        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${toneStyles[tone] ?? toneStyles.sky}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  )
}

function QuickLink({ to, icon: Icon, title, description, cardClassName, iconClassName }) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md ${cardClassName}`}
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}>
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>

      <ArrowRight size={16} className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-600" />
    </Link>
  )
}

function AdminSettingsPage() {
  const { push } = useToast()
  const currentUser = getCurrentUser()
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setSettings((previous) => ({
          ...previous,
          ...JSON.parse(saved),
        }))
      }
    } catch (error) {
      console.error('Failed to load saved admin settings', error)
    }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleToggle = (name, value) => {
    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSave = (event) => {
    event.preventDefault()

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      push('Settings saved successfully.', { type: 'success' })
    } catch (error) {
      console.error('Failed to save admin settings', error)
      push('Could not save settings.', { type: 'error' })
    }
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    window.localStorage.removeItem(STORAGE_KEY)
    push('Settings reset to defaults.', { type: 'info' })
  }

  const handleExport = () => {
    const payload = JSON.stringify(settings, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')

    anchor.href = url
    anchor.download = 'smart-campus-admin-settings.json'
    anchor.click()

    window.URL.revokeObjectURL(url)
    push('Configuration exported.', { type: 'success' })
  }

  const statusCards = [
    {
      label: 'Admin owner',
      value: currentUser?.name || currentUser?.email || 'Administrator',
      icon: Users,
      tone: 'sky',
    },
    {
      label: 'Security posture',
      value: settings.mfaRequired ? 'MFA enforced' : 'Standard access',
      icon: ShieldCheck,
      tone: 'emerald',
    },
    {
      label: 'Theme mode',
      value: settings.theme,
      icon: SunMedium,
      tone: 'amber',
    },
    {
      label: 'Backups',
      value: settings.autoBackups ? settings.backupSchedule : 'Disabled',
      icon: Server,
      tone: 'violet',
    },
  ]

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] sm:p-7"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.12),transparent_34%)]"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              <Sparkles size={14} />
              Admin control center
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              System Settings
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Tune the campus platform from one place. This panel keeps your branding,
              security, notifications, and maintenance preferences aligned with the rest
              of the admin workspace.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Signed in as
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {currentUser?.name || 'Administrator'}
              </p>
              <p className="text-xs text-slate-500">{currentUser?.email || 'admin@smartcampus.edu'}</p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                Persistence
              </p>
              <p className="mt-2 text-sm font-semibold text-emerald-900">Browser draft enabled</p>
              <p className="text-xs text-emerald-700/80">Save or export the current configuration.</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(320px,1fr)]">
        <form onSubmit={handleSave} className="space-y-6">
          <SectionCard
            icon={Building2}
            eyebrow="Identity"
            title="Branding & identity"
            description="Control the basic information that appears across the app and in system notifications."
            delay={0.05}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Application name"
                description="Displayed in the sidebar, headers, and browser title."
                name="appName"
                value={settings.appName}
                onChange={handleChange}
                placeholder="Smart Campus Hub"
              />

              <TextField
                label="Support email"
                description="Shown in system messages and help prompts."
                name="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={handleChange}
                placeholder="support@smartcampus.edu"
              />

              <SelectField
                label="Timezone"
                description="Used for timestamps, deadlines, and backup windows."
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                options={[
                  { value: 'Asia/Colombo', label: 'Asia/Colombo' },
                  { value: 'Asia/Kolkata', label: 'Asia/Kolkata' },
                  { value: 'UTC', label: 'UTC' },
                ]}
              />

              <SelectField
                label="Language"
                description="Choose the primary language for the workspace."
                name="language"
                value={settings.language}
                onChange={handleChange}
                options={[
                  { value: 'English', label: 'English' },
                  { value: 'Sinhala', label: 'Sinhala' },
                  { value: 'Tamil', label: 'Tamil' },
                ]}
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={Lock}
            eyebrow="Security"
            title="Access & security"
            description="Set how administrators enter the system and how long sessions remain active."
            delay={0.1}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Session timeout"
                description="Force sign-out after a period of inactivity."
                name="sessionTimeout"
                value={settings.sessionTimeout}
                onChange={handleChange}
                options={[
                  { value: '15 minutes', label: '15 minutes' },
                  { value: '30 minutes', label: '30 minutes' },
                  { value: '60 minutes', label: '60 minutes' },
                  { value: '120 minutes', label: '120 minutes' },
                ]}
              />

              <SelectField
                label="Idle logout"
                description="Logout window when a user stops interacting."
                name="idleLogout"
                value={settings.idleLogout}
                onChange={handleChange}
                options={[
                  { value: '5 minutes', label: '5 minutes' },
                  { value: '15 minutes', label: '15 minutes' },
                  { value: '30 minutes', label: '30 minutes' },
                  { value: '60 minutes', label: '60 minutes' },
                ]}
              />

              <ToggleField
                label="Require MFA for admins"
                description="Adds a stronger login step before admin access is granted."
                checked={settings.mfaRequired}
                onChange={(checked) => handleToggle('mfaRequired', checked)}
                icon={ShieldCheck}
              />

              <ToggleField
                label="Maintenance mode"
                description="Temporarily pause user-facing features while changes are applied."
                checked={settings.maintenanceMode}
                onChange={(checked) => handleToggle('maintenanceMode', checked)}
                icon={Server}
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={Bell}
            eyebrow="Alerts"
            title="Notifications & messaging"
            description="Control the updates students and administrators receive from the platform."
            delay={0.15}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <ToggleField
                label="Email digest"
                description="Send a compact summary of recent activity by email."
                checked={settings.emailDigest}
                onChange={(checked) => handleToggle('emailDigest', checked)}
                icon={Sparkles}
              />

              <ToggleField
                label="Push alerts"
                description="Trigger instant in-app alerts for important changes."
                checked={settings.pushAlerts}
                onChange={(checked) => handleToggle('pushAlerts', checked)}
                icon={Bell}
              />

              <ToggleField
                label="Booking reminders"
                description="Remind users before their scheduled booking starts."
                checked={settings.bookingReminders}
                onChange={(checked) => handleToggle('bookingReminders', checked)}
                icon={CalendarDays}
              />

              <ToggleField
                label="Ticket escalation"
                description="Escalate unresolved incidents to the admin queue."
                checked={settings.ticketEscalation}
                onChange={(checked) => handleToggle('ticketEscalation', checked)}
                icon={Ticket}
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={Laptop}
            eyebrow="Appearance"
            title="Interface & presentation"
            description="Keep the UI comfortable for both long admin sessions and shared workstations."
            delay={0.2}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <SelectField
                label="Theme mode"
                description="Choose how the workspace should feel by default."
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                options={[
                  { value: 'Light', label: 'Light' },
                  { value: 'System', label: 'System' },
                  { value: 'Midnight', label: 'Midnight' },
                ]}
              />

              <SelectField
                label="Accent color"
                description="Set the main visual accent used in highlights."
                name="accent"
                value={settings.accent}
                onChange={handleChange}
                options={[
                  { value: 'Sky', label: 'Sky' },
                  { value: 'Emerald', label: 'Emerald' },
                  { value: 'Violet', label: 'Violet' },
                  { value: 'Slate', label: 'Slate' },
                ]}
              />

              <SelectField
                label="Layout density"
                description="Adjust spacing for compact or comfortable views."
                name="density"
                value={settings.density}
                onChange={handleChange}
                options={[
                  { value: 'Compact', label: 'Compact' },
                  { value: 'Comfortable', label: 'Comfortable' },
                  { value: 'Spacious', label: 'Spacious' },
                ]}
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={Database}
            eyebrow="Maintenance"
            title="Data & backup policy"
            description="Set the local maintenance rhythm, retention window, and auditing basics."
            delay={0.25}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Backup schedule"
                description="How often the system should capture a fresh backup."
                name="backupSchedule"
                value={settings.backupSchedule}
                onChange={handleChange}
                options={[
                  { value: 'Daily at 02:00', label: 'Daily at 02:00' },
                  { value: 'Weekly on Sunday', label: 'Weekly on Sunday' },
                  { value: 'Hourly for labs', label: 'Hourly for labs' },
                ]}
              />

              <SelectField
                label="Retention window"
                description="How long logs and snapshots are kept."
                name="retention"
                value={settings.retention}
                onChange={handleChange}
                options={[
                  { value: '30 days', label: '30 days' },
                  { value: '90 days', label: '90 days' },
                  { value: '180 days', label: '180 days' },
                ]}
              />

              <ToggleField
                label="Automatic backups"
                description="Keep a regular snapshot of the configuration and data."
                checked={settings.autoBackups}
                onChange={(checked) => handleToggle('autoBackups', checked)}
                icon={Database}
              />

              <ToggleField
                label="Audit trail"
                description="Record key administrative changes for later review."
                checked={settings.auditTrail}
                onChange={(checked) => handleToggle('auditTrail', checked)}
                icon={ShieldCheck}
              />
            </div>
          </SectionCard>

          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Keep the admin workspace in sync</p>
              <p className="mt-1 text-sm text-slate-600">
                Save local changes, export a copy, or reset the panel to the defaults used by the app.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                <Save size={16} />
                Save changes
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <RefreshCcw size={16} />
                Reset
              </button>

              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </form>

        <aside className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-700">
                  Snapshot
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">Current system profile</h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <Server size={18} />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {[
                {
                  label: 'Admin owner',
                  value: currentUser?.name || currentUser?.email || 'Administrator',
                  icon: Users,
                  tone: 'sky',
                },
                {
                  label: 'Security posture',
                  value: settings.mfaRequired ? 'MFA enforced' : 'Standard access',
                  icon: ShieldCheck,
                  tone: 'emerald',
                },
                {
                  label: 'Theme mode',
                  value: settings.theme,
                  icon: SunMedium,
                  tone: 'amber',
                },
                {
                  label: 'Backups',
                  value: settings.autoBackups ? settings.backupSchedule : 'Disabled',
                  icon: Server,
                  tone: 'violet',
                },
              ].map((card) => (
                <StatCard
                  key={card.label}
                  icon={card.icon}
                  label={card.label}
                  value={card.value}
                  tone={card.tone}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
                  Navigate
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">Related admin areas</h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                <Sparkles size={18} />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <QuickLink
                to="/admin/users"
                icon={Users}
                title="Manage users"
                description="Review accounts, roles, and access levels."
                cardClassName="hover:border-sky-200 hover:bg-sky-50/50"
                iconClassName="bg-sky-50 text-sky-700"
              />

              <QuickLink
                to="/admin/resources"
                icon={Building2}
                title="Resource management"
                description="Update rooms, equipment, and availability."
                cardClassName="hover:border-emerald-200 hover:bg-emerald-50/50"
                iconClassName="bg-emerald-50 text-emerald-700"
              />

              <QuickLink
                to="/admin/review-bookings"
                icon={CalendarDays}
                title="Review bookings"
                description="Approve or reject pending campus bookings."
                cardClassName="hover:border-violet-200 hover:bg-violet-50/50"
                iconClassName="bg-violet-50 text-violet-700"
              />

              <QuickLink
                to="/admin/tickets"
                icon={Ticket}
                title="Ticket management"
                description="Track incidents, priorities, and assignments."
                cardClassName="hover:border-amber-200 hover:bg-amber-50/50"
                iconClassName="bg-amber-50 text-amber-700"
              />

              <QuickLink
                to="/notifications"
                icon={Bell}
                title="Notifications"
                description="See recent activity and unread alerts."
                cardClassName="hover:border-rose-200 hover:bg-rose-50/50"
                iconClassName="bg-rose-50 text-rose-700"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                  Baseline
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">Recommended defaults</h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <SunMedium size={18} />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Keep MFA enabled for admin accounts so privileged actions remain protected.
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Leave automatic backups on and keep a 90-day retention window for recovery.
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Use the system theme for shared workstations and switch to compact layout on smaller screens.
              </div>
            </div>
          </motion.div>
        </aside>
      </div>
    </section>
  )
}

export default AdminSettingsPage


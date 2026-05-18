import type { ReactNode } from 'react'

export function StatPill({ label, value, tone = 'default' }: { label: string; value: ReactNode; tone?: 'default' | 'good' | 'warn' | 'bad' }) {
  const toneCls = {
    default: 'bg-black/5',
    good: 'bg-emerald-100 text-emerald-900',
    warn: 'bg-amber-100 text-amber-900',
    bad: 'bg-rose-100 text-rose-900',
  }[tone]
  return (
    <div className={`rounded-xl px-4 py-3 ${toneCls}`}>
      <div className="text-xs uppercase tracking-wider opacity-70">{label}</div>
      <div className="text-xl font-medium">{value}</div>
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    discovered: 'bg-slate-100 text-slate-700',
    closing: 'bg-amber-100 text-amber-800',
    closed: 'bg-slate-200 text-slate-700',
    transferred: 'bg-emerald-100 text-emerald-800',
    current: 'bg-emerald-100 text-emerald-800',
    past_due: 'bg-amber-100 text-amber-800',
    in_collections: 'bg-rose-100 text-rose-800',
    pending: 'bg-slate-100 text-slate-700',
    sent: 'bg-sky-100 text-sky-800',
    confirmed: 'bg-emerald-100 text-emerald-800',
    disputed: 'bg-rose-100 text-rose-800',
    draft: 'bg-slate-100 text-slate-700',
    ready: 'bg-sky-100 text-sky-800',
    notarized: 'bg-emerald-100 text-emerald-800',
    filed: 'bg-emerald-200 text-emerald-900',
  }
  const cls = map[status] ?? 'bg-black/5'
  return <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
    {status.replace(/_/g, ' ')}
  </span>
}

export function Money({ value }: { value: number }) {
  return <span>{value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
}

export function SectionHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-xl ${wide ? 'max-w-2xl' : 'max-w-md'} w-full max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
          <h3 className="font-serif text-xl">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-ink" aria-label="Close">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function Star({ filled = true }: { filled?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="1.5">
      <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.8L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" />
    </svg>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/Layout'
import PipelineTracker from '../components/PipelineTracker'
import { Modal, SectionHeader, StatPill, StatusBadge } from '../components/ui'
import { useStore } from '../store'
import type { ChannelType, NotificationStatus } from '../data/types'

type TargetKind = 'asset' | 'liability'

interface Target {
  kind: TargetKind
  id: string
  name: string
  detail: string
  contact: { phone: string; email?: string; mailingAddress?: string; faxNumber?: string }
}

const CHANNEL_LABEL: Record<ChannelType, string> = {
  email: 'Email',
  fax: 'Fax',
  phone: 'Phone',
  mail: 'Mail',
}

export default function Closures() {
  const {
    assets, liabilities, notifications, sendNotification, updateNotificationStatus,
    deceased, setStep,
  } = useStore((s) => ({
    assets: s.assets, liabilities: s.liabilities,
    notifications: s.notifications, sendNotification: s.sendNotification,
    updateNotificationStatus: s.updateNotificationStatus,
    deceased: s.deceased, setStep: s.setStep,
  }))
  const [open, setOpen] = useState<Target | null>(null)

  useEffect(() => { setStep(4) }, [setStep])

  const targets: Target[] = useMemo(() => [
    ...assets.map((a) => ({
      kind: 'asset' as const,
      id: a.id,
      name: a.institution,
      detail: `${a.type} ••${a.accountLast4}`,
      contact: a.contact,
    })),
    ...liabilities.map((l) => ({
      kind: 'liability' as const,
      id: l.id,
      name: l.creditor,
      detail: `${l.type} ••${l.accountLast4}`,
      contact: l.contact,
    })),
  ], [assets, liabilities])

  const counts = useMemo(() => ({
    total: notifications.length,
    sent: notifications.filter((n) => n.status === 'sent').length,
    confirmed: notifications.filter((n) => n.status === 'confirmed').length,
    disputed: notifications.filter((n) => n.status === 'disputed').length,
    overdue: notifications.filter((n) => n.followUpDue && n.followUpDue < new Date().toISOString().slice(0, 10) && n.status !== 'confirmed').length,
  }), [notifications])

  return (
    <AppShell>
      <SectionHeader
        title="Step 4 — Closure & creditor notifications"
        subtitle="Notify every custodian, creditor, and agency. We compose the right letter for the right channel and track every response."
        right={
          notifications.length > 0 && (
            <Link to="/app/transfers" className="btn-primary text-sm">Next: transfers →</Link>
          )
        }
      />
      <PipelineTracker />

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-8">
        <StatPill label="Total notifications" value={counts.total} />
        <StatPill label="Awaiting response" value={counts.sent} tone="warn" />
        <StatPill label="Confirmed" value={counts.confirmed} tone="good" />
        <StatPill label="Disputed" value={counts.disputed} tone={counts.disputed ? 'bad' : 'default'} />
        <StatPill label="14/30-day flag" value={counts.overdue} tone={counts.overdue ? 'warn' : 'default'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="card">
          <h2 className="font-serif text-2xl mb-4">Accounts & creditors</h2>
          <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
            {targets.map((t) => {
              const sent = notifications.find((n) => n.targetId === t.id)
              return (
                <div key={`${t.kind}-${t.id}`} className="rounded-lg border border-black/10 p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{t.name}</div>
                    <div className="text-xs text-muted truncate">{t.detail} · {t.kind === 'asset' ? 'Custodian' : 'Creditor'}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {sent ? <StatusBadge status={sent.status} /> : <span className="chip">Not contacted</span>}
                    <button onClick={() => setOpen(t)} className="btn-ghost text-sm">Compose</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <h2 className="font-serif text-2xl mb-4">Notification log</h2>
          {notifications.length === 0 ? (
            <p className="text-muted text-sm">No notifications sent yet. Compose one from the list at left.</p>
          ) : (
            <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
              {notifications.map((n) => (
                <div key={n.id} className="rounded-lg border border-black/10 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{n.targetName}</div>
                      <div className="text-xs text-muted">via {CHANNEL_LABEL[n.channel]} · {new Date(n.createdAt).toLocaleDateString()} · follow-up due {n.followUpDue}</div>
                    </div>
                    <StatusBadge status={n.status} />
                  </div>
                  <div className="mt-2 text-xs text-muted truncate">{n.subject}</div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs">
                    {(['confirmed', 'disputed', 'pending'] as NotificationStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateNotificationStatus(n.id, s)}
                        className={`px-2 py-0.5 rounded-full border border-black/10 hover:bg-black/5 capitalize ${n.status === s ? 'bg-black/10' : ''}`}
                      >Mark {s}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {open && (
        <ComposeModal
          target={open}
          deceasedName={deceased?.fullName ?? ''}
          onClose={() => setOpen(null)}
          onSend={(channel, subject, body) => {
            sendNotification({ targetType: open.kind, targetId: open.id, targetName: open.name, channel, subject, body })
            setOpen(null)
          }}
        />
      )}
    </AppShell>
  )
}

function ComposeModal({ target, deceasedName, onClose, onSend }: {
  target: Target
  deceasedName: string
  onClose: () => void
  onSend: (ch: ChannelType, subject: string, body: string) => void
}) {
  const availableChannels: ChannelType[] = []
  if (target.contact.email) availableChannels.push('email')
  if (target.contact.faxNumber) availableChannels.push('fax')
  if (target.contact.mailingAddress) availableChannels.push('mail')
  if (target.contact.phone) availableChannels.push('phone')

  const [channel, setChannel] = useState<ChannelType>(availableChannels[0] ?? 'email')
  const [subject, setSubject] = useState(`Notification of death — ${deceasedName}`)
  const [body, setBody] = useState(defaultBody(target, deceasedName))

  return (
    <Modal open onClose={onClose} title={`Notify ${target.name}`} wide>
      <div className="space-y-4">
        <div className="text-sm text-muted">{target.detail}</div>

        <div>
          <div className="label">Channel</div>
          <div className="flex flex-wrap gap-2">
            {availableChannels.map((c) => (
              <button
                key={c}
                onClick={() => setChannel(c)}
                className={`px-3 py-1.5 rounded-full border text-sm ${
                  channel === c ? 'bg-ink text-cream border-ink' : 'border-black/15 hover:bg-black/5'
                }`}
              >{CHANNEL_LABEL[c]}</button>
            ))}
          </div>
          <div className="text-xs text-muted mt-2">
            {channel === 'email' && <>Will deliver to <span className="font-mono">{target.contact.email}</span></>}
            {channel === 'fax' && <>Will fax to <span className="font-mono">{target.contact.faxNumber}</span></>}
            {channel === 'mail' && <>Will mail to <span className="font-mono">{target.contact.mailingAddress}</span></>}
            {channel === 'phone' && <>Will queue call to <span className="font-mono">{target.contact.phone}</span> with a Sunset specialist</>}
          </div>
        </div>

        {(channel === 'email' || channel === 'fax' || channel === 'mail') && (
          <>
            <div>
              <label className="label">Subject</label>
              <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea className="input min-h-[12rem] font-mono text-xs" value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
          </>
        )}
        {channel === 'phone' && (
          <div className="rounded-lg bg-cream border border-black/10 p-4 text-sm">
            A Sunset specialist will place this call on your behalf within one business day. They will reference the estate of <span className="font-medium">{deceasedName}</span> and request next steps for {target.kind === 'asset' ? 'transfer/closure' : 'final balance and dispute window'}.
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted">Notifications are simulated in this demo and logged to the workspace, not actually transmitted.</div>
          <button className="btn-primary" onClick={() => onSend(channel, subject, body)}>Send via {CHANNEL_LABEL[channel]}</button>
        </div>
      </div>
    </Modal>
  )
}

function defaultBody(target: Target, deceasedName: string): string {
  return `To Whom It May Concern,

We are writing to inform you of the passing of ${deceasedName || '____________________'}, a customer of ${target.name}.

Account reference: ${target.detail}
Date of death: ${useStore.getState().deceased?.dod ?? '____________________'}

Please consider this letter formal notice. We request the following:
  1. Acknowledge receipt of this notification within 14 business days.
  2. Provide a written final statement of balance as of the date of death.
  3. Cease any further charges, autopayments, or marketing communications.
  4. ${target.kind === 'asset'
        ? 'Outline the documentation required to transfer or close this account in favor of the estate.'
        : 'Outline the dispute window and any documentation needed to negotiate the final settlement amount.'}

We have enclosed a certified copy of the death certificate. The personal representative of the estate is available for any required follow-up.

Sincerely,
The Estate of ${deceasedName}
c/o Sunset Estate Services
`
}

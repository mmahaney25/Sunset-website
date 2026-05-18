import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '../components/Layout'
import PipelineTracker from '../components/PipelineTracker'
import { Money, SectionHeader, StatPill, StatusBadge } from '../components/ui'
import { useStore } from '../store'
import { demoBeneficiaries } from '../data/demoEstate'
import type { Beneficiary } from '../data/types'

type Mode = 'will' | 'trust' | 'intestacy'

const INTESTACY_RULES: Record<Mode, string> = {
  will: 'Allocations follow the percentages set in the decedent\'s will.',
  trust: 'Allocations follow the trust schedule. Trustee approval is required before disbursement.',
  intestacy: 'No valid will. Allocations follow the state intestacy formula: spouse first, then equally to surviving children.',
}

export default function Distribution() {
  const {
    beneficiaries, setBeneficiaries, approveBeneficiary, distributeFunds,
    estateAccount, setStep,
  } = useStore((s) => ({
    beneficiaries: s.beneficiaries, setBeneficiaries: s.setBeneficiaries,
    approveBeneficiary: s.approveBeneficiary, distributeFunds: s.distributeFunds,
    estateAccount: s.estateAccount, setStep: s.setStep,
  }))
  const [mode, setMode] = useState<Mode>('will')

  useEffect(() => { setStep(5) }, [setStep])

  const totalPct = useMemo(() => beneficiaries.reduce((s, b) => s + b.sharePct, 0), [beneficiaries])
  const valid = totalPct === 100 && beneficiaries.length > 0
  const allApproved = beneficiaries.length > 0 && beneficiaries.every((b) => b.approvalState !== 'pending')
  const done = beneficiaries.length > 0 && beneficiaries.every((b) => b.approvalState === 'sent')

  function update(id: string, patch: Partial<Beneficiary>) {
    setBeneficiaries(beneficiaries.map((b) => b.id === id ? { ...b, ...patch } : b))
  }
  function add() {
    setBeneficiaries([
      ...beneficiaries,
      { id: `b-${Math.random().toString(36).slice(2, 8)}`, name: '', relationship: '', sharePct: 0, email: '', approvalState: 'pending' },
    ])
  }
  function remove(id: string) {
    setBeneficiaries(beneficiaries.filter((b) => b.id !== id))
  }
  function loadDemoBeneficiaries() {
    setBeneficiaries(demoBeneficiaries)
  }
  function recalcIntestacy() {
    // Spouse 50%, remainder split among non-spouse heirs equally.
    const spouse = beneficiaries.find((b) => b.relationship.toLowerCase() === 'spouse')
    const others = beneficiaries.filter((b) => b.relationship.toLowerCase() !== 'spouse')
    const updated: Beneficiary[] = beneficiaries.map((b) => {
      if (spouse && b.id === spouse.id) return { ...b, sharePct: 50 }
      if (others.length > 0) return { ...b, sharePct: Math.round((50 / others.length) * 100) / 100 }
      return { ...b, sharePct: 100 / beneficiaries.length }
    })
    setBeneficiaries(updated)
  }

  return (
    <AppShell>
      <SectionHeader
        title="Step 6 — Inheritance distribution"
        subtitle="Allocate remaining estate funds to heirs per the will, trust, or state intestacy law."
      />
      <PipelineTracker />

      <div className="grid sm:grid-cols-4 gap-3 mt-8">
        <StatPill label="Available to distribute" value={<Money value={estateAccount.balance} />} tone="good" />
        <StatPill label="Heirs" value={beneficiaries.length} />
        <StatPill label="Allocation" value={`${totalPct}%`} tone={totalPct === 100 ? 'good' : 'warn'} />
        <StatPill label="Approvals" value={`${beneficiaries.filter((b) => b.approvalState !== 'pending').length}/${beneficiaries.length}`} tone={allApproved ? 'good' : 'default'} />
      </div>

      <div className="card mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-serif text-2xl">Distribution basis</h2>
            <p className="text-sm text-muted">{INTESTACY_RULES[mode]}</p>
          </div>
          <div className="flex gap-2">
            {(['will', 'trust', 'intestacy'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-full border text-sm capitalize ${mode === m ? 'bg-ink text-cream border-ink' : 'border-black/15 hover:bg-black/5'}`}
              >{m}</button>
            ))}
          </div>
        </div>
        {mode === 'intestacy' && (
          <button onClick={recalcIntestacy} className="btn-ghost text-sm">Recalculate shares per state formula</button>
        )}
      </div>

      <div className="card mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl">Beneficiaries</h2>
          <div className="flex gap-2">
            {beneficiaries.length === 0 && (
              <button onClick={loadDemoBeneficiaries} className="btn-ghost text-sm">Load demo heirs</button>
            )}
            <button onClick={add} className="btn-secondary text-sm">+ Add beneficiary</button>
          </div>
        </div>

        {beneficiaries.length === 0 ? (
          <p className="text-muted text-sm">No beneficiaries added yet. Add the heirs named in the will, or load the demo set to walk through this step.</p>
        ) : (
          <div className="space-y-2">
            {beneficiaries.map((b) => {
              const share = (estateAccount.balance * b.sharePct) / 100
              return (
                <div key={b.id} className="rounded-xl border border-black/10 p-3">
                  <div className="grid sm:grid-cols-12 gap-2 items-center">
                    <input className="input sm:col-span-3" placeholder="Full name" value={b.name} onChange={(e) => update(b.id, { name: e.target.value })} />
                    <input className="input sm:col-span-2" placeholder="Relationship" value={b.relationship} onChange={(e) => update(b.id, { relationship: e.target.value })} />
                    <input className="input sm:col-span-3" placeholder="Email" value={b.email} onChange={(e) => update(b.id, { email: e.target.value })} />
                    <div className="sm:col-span-2 flex items-center gap-1">
                      <input type="number" step="0.01" className="input" placeholder="Share %" value={b.sharePct} onChange={(e) => update(b.id, { sharePct: parseFloat(e.target.value) || 0 })} />
                      <span className="text-sm text-muted">%</span>
                    </div>
                    <div className="sm:col-span-2 text-right text-sm">
                      <div className="font-medium"><Money value={share} /></div>
                      <div className="text-xs text-muted">allocated</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <StatusBadge status={b.approvalState === 'sent' ? 'confirmed' : b.approvalState === 'approved' ? 'ready' : 'pending'} />
                    <div className="flex items-center gap-2">
                      {b.approvalState === 'pending' && (
                        <button onClick={() => approveBeneficiary(b.id)} className="text-sm text-sunset-700 hover:underline">Approve</button>
                      )}
                      <button onClick={() => remove(b.id)} className="text-sm text-muted hover:text-rose-700">Remove</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {beneficiaries.length > 0 && !valid && (
          <div className="mt-4 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Shares total {totalPct}% — must equal 100% before distribution.
          </div>
        )}

        {valid && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted">
              {!allApproved && 'All beneficiaries must approve before funds are released.'}
              {allApproved && !done && 'All approvals received. Ready to distribute.'}
              {done && '✓ Distribution complete. Each heir received a confirmation by email.'}
            </div>
            <button
              onClick={distributeFunds}
              disabled={!allApproved || done || estateAccount.balance === 0}
              className="btn-primary disabled:opacity-50"
            >
              {done ? 'Funds distributed' : 'Distribute funds'}
            </button>
          </div>
        )}
      </div>

      {done && (
        <div className="card mt-6">
          <h2 className="font-serif text-2xl mb-3">Distribution summary</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-muted border-b border-black/5">
              <tr>
                <th className="py-2 pr-3 font-normal">Heir</th>
                <th className="py-2 pr-3 font-normal">Relationship</th>
                <th className="py-2 pr-3 font-normal">Share</th>
                <th className="py-2 pr-3 font-normal text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((b) => (
                <tr key={b.id} className="border-b border-black/5 last:border-0">
                  <td className="py-2 pr-3">{b.name}</td>
                  <td className="py-2 pr-3">{b.relationship}</td>
                  <td className="py-2 pr-3">{b.sharePct}%</td>
                  <td className="py-2 pr-3 text-right font-medium"><Money value={b.amountAllocated ?? 0} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  )
}

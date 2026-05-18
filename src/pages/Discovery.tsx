import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/Layout'
import PipelineTracker from '../components/PipelineTracker'
import { Money, SectionHeader, StatPill, StatusBadge } from '../components/ui'
import { useStore } from '../store'
import type { Asset, Liability } from '../data/types'

export default function Discovery() {
  const { assets, liabilities, discoveryComplete, runDiscovery, setStep } = useStore((s) => ({
    assets: s.assets, liabilities: s.liabilities,
    discoveryComplete: s.discoveryComplete,
    runDiscovery: s.runDiscovery, setStep: s.setStep,
  }))
  const [loading, setLoading] = useState(false)
  const [scanLogs, setScanLogs] = useState<string[]>([])

  useEffect(() => { setStep(1) }, [setStep])

  useEffect(() => {
    if (assets.length === 0 && !discoveryComplete) {
      void start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function start() {
    setLoading(true)
    setScanLogs([])
    const sources = [
      'Querying IRS Form 1099 records…',
      'Scanning Fidelity, Schwab, Vanguard custodian networks…',
      'Searching FDIC bank registry…',
      'Checking NAIC life insurance policy locator…',
      'Cross-referencing DTCC unclaimed securities…',
      'Pulling county deed and title records…',
      'Scanning credit bureau debt files…',
    ]
    sources.forEach((s, i) => setTimeout(() => setScanLogs((logs) => [...logs, s]), i * 280))
    await runDiscovery()
    setLoading(false)
  }

  const dedupedAssets = useMemo(() => dedupe(assets), [assets])
  const dedupedLiabs = useMemo(() => dedupeL(liabilities), [liabilities])

  const totalAssets = dedupedAssets.reduce((s, a) => s + a.balance, 0)
  const totalLiabs = dedupedLiabs.reduce((s, l) => s + l.balance, 0)
  const shared = dedupedLiabs.filter((l) => l.sharedDebt)

  const assetTypes = Array.from(new Set(dedupedAssets.map((a) => a.type)))

  return (
    <AppShell>
      <SectionHeader
        title="Step 1 — Discovery"
        subtitle="A unified, deduplicated report of every account and debt we found."
        right={
          discoveryComplete && (
            <Link to="/app/probate" className="btn-primary text-sm">Next: probate →</Link>
          )
        }
      />
      <PipelineTracker />

      {loading || !discoveryComplete ? (
        <div className="card mt-8 text-center">
          <div className="font-serif text-2xl mb-2">Searching across registries…</div>
          <div className="text-muted text-sm mb-6">Most searches finish in seconds.</div>
          <div className="max-w-md mx-auto text-left bg-cream rounded-xl p-4 text-sm font-mono space-y-1">
            {scanLogs.map((l, i) => <div key={i} className="text-ink/70">→ {l}</div>)}
            {scanLogs.length < 7 && <div className="animate-pulse text-sunset-700">▌</div>}
          </div>
          <button onClick={start} className="btn-ghost mt-6 text-sm" disabled={loading}>Restart scan</button>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
            <StatPill label="Accounts found" value={dedupedAssets.length} tone="good" />
            <StatPill label="Total asset value" value={<Money value={totalAssets} />} tone="good" />
            <StatPill label="Debts found" value={dedupedLiabs.length} tone="warn" />
            <StatPill label="Shared debts flagged" value={shared.length} tone={shared.length ? 'warn' : 'default'} />
          </div>

          <div className="card mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl">Assets — {dedupedAssets.length} accounts across {assetTypes.length} types</h2>
              <div className="text-sm text-muted">Deduplicated from {assets.length} raw matches</div>
            </div>
            <AssetTable assets={dedupedAssets} />
          </div>

          <div className="card mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl">Liabilities — {dedupedLiabs.length} debts</h2>
              {shared.length > 0 && (
                <div className="text-sm text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  {shared.length} joint / co-signed — shared with surviving account holder
                </div>
              )}
            </div>
            <LiabilityTable liabilities={dedupedLiabs} />
          </div>

          <div className="flex items-center justify-end mt-6">
            <Link to="/app/probate" className="btn-primary">Continue to probate →</Link>
          </div>
        </>
      )}
    </AppShell>
  )
}

function dedupe(items: Asset[]): Asset[] {
  const seen = new Map<string, Asset>()
  for (const a of items) {
    const key = `${a.institution}|${a.accountLast4}|${a.type}`
    if (!seen.has(key)) seen.set(key, a)
  }
  return Array.from(seen.values())
}
function dedupeL(items: Liability[]): Liability[] {
  const seen = new Map<string, Liability>()
  for (const a of items) {
    const key = `${a.creditor}|${a.accountLast4}|${a.type}`
    if (!seen.has(key)) seen.set(key, a)
  }
  return Array.from(seen.values())
}

function AssetTable({ assets }: { assets: Asset[] }) {
  const byType = assets.reduce<Record<string, Asset[]>>((acc, a) => {
    (acc[a.type] = acc[a.type] || []).push(a); return acc
  }, {})
  return (
    <div className="space-y-5">
      {Object.entries(byType).map(([type, list]) => {
        const subtotal = list.reduce((s, a) => s + a.balance, 0)
        return (
          <div key={type}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <div className="font-medium">{type} <span className="text-muted">· {list.length}</span></div>
              <div className="text-muted">Subtotal <span className="text-ink font-medium"><Money value={subtotal} /></span></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted border-b border-black/5">
                  <tr>
                    <th className="py-2 pr-3 font-normal">Institution</th>
                    <th className="py-2 pr-3 font-normal">Account</th>
                    <th className="py-2 pr-3 font-normal">Ownership</th>
                    <th className="py-2 pr-3 font-normal">Discovered via</th>
                    <th className="py-2 pr-3 font-normal text-right">Balance</th>
                    <th className="py-2 pr-3 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((a) => (
                    <tr key={a.id} className="border-b border-black/5 last:border-0">
                      <td className="py-2 pr-3 font-medium">{a.institution}</td>
                      <td className="py-2 pr-3 font-mono text-xs">••{a.accountLast4}</td>
                      <td className="py-2 pr-3 capitalize">{a.ownership}{a.beneficiaryNamed ? ` (→ ${a.beneficiaryNamed})` : ''}</td>
                      <td className="py-2 pr-3 text-muted">{a.discoveredVia}</td>
                      <td className="py-2 pr-3 text-right font-medium"><Money value={a.balance} /></td>
                      <td className="py-2 pr-3"><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LiabilityTable({ liabilities }: { liabilities: Liability[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-muted border-b border-black/5">
          <tr>
            <th className="py-2 pr-3 font-normal">Creditor</th>
            <th className="py-2 pr-3 font-normal">Type</th>
            <th className="py-2 pr-3 font-normal">Account</th>
            <th className="py-2 pr-3 font-normal">Shared</th>
            <th className="py-2 pr-3 font-normal">Contact</th>
            <th className="py-2 pr-3 font-normal text-right">Balance</th>
            <th className="py-2 pr-3 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {liabilities.map((l) => (
            <tr key={l.id} className="border-b border-black/5 last:border-0">
              <td className="py-2 pr-3 font-medium">{l.creditor}</td>
              <td className="py-2 pr-3">{l.type}</td>
              <td className="py-2 pr-3 font-mono text-xs">••{l.accountLast4}</td>
              <td className="py-2 pr-3">{l.sharedDebt ? <span className="chip bg-amber-100 text-amber-800">Joint{l.coSigner ? ` w/ ${l.coSigner.split(' ')[0]}` : ''}</span> : <span className="text-muted">—</span>}</td>
              <td className="py-2 pr-3 text-xs text-muted">{l.contact.phone}</td>
              <td className="py-2 pr-3 text-right font-medium"><Money value={l.balance} /></td>
              <td className="py-2 pr-3"><StatusBadge status={l.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

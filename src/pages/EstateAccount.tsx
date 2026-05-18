import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/Layout'
import PipelineTracker from '../components/PipelineTracker'
import { Modal, Money, SectionHeader, StatusBadge } from '../components/ui'
import { useStore } from '../store'

const CATEGORIES = [
  { v: 'funeral', label: 'Funeral expense' },
  { v: 'legal', label: 'Legal / probate fees' },
  { v: 'utilities', label: 'Property & utilities' },
  { v: 'tax', label: 'Tax payment' },
  { v: 'other', label: 'Other estate expense' },
] as const

export default function EstateAccount() {
  const { estateAccount, fileEIN, openEstateAccount, addTransaction, deceased, setStep } = useStore((s) => ({
    estateAccount: s.estateAccount, fileEIN: s.fileEIN, openEstateAccount: s.openEstateAccount,
    addTransaction: s.addTransaction, deceased: s.deceased, setStep: s.setStep,
  }))
  const [filing, setFiling] = useState(false)
  const [txOpen, setTxOpen] = useState(false)
  const [desc, setDesc] = useState('')
  const [amt, setAmt] = useState('')
  const [cat, setCat] = useState<typeof CATEGORIES[number]['v']>('funeral')

  useEffect(() => { setStep(3) }, [setStep])

  async function startEIN() {
    setFiling(true)
    await fileEIN()
    setFiling(false)
  }

  const status = estateAccount.status

  return (
    <AppShell>
      <SectionHeader
        title="Step 3 — Estate bank account"
        subtitle="A consolidated, FDIC-insured account that holds estate funds while you settle debts and distribute to heirs."
        right={
          status === 'opened' && (
            <Link to="/app/closures" className="btn-primary text-sm">Next: notify creditors →</Link>
          )
        }
      />
      <PipelineTracker />

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Step: file EIN */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl">1 · File for an EIN with the IRS</h2>
                <p className="text-muted text-sm mt-1">An Employer Identification Number is required to open a bank account for the estate.</p>
              </div>
              <StatusBadge status={status === 'not_started' ? 'pending' : 'confirmed'} />
            </div>

            {status === 'not_started' && (
              <button onClick={startEIN} disabled={filing} className="btn-primary mt-4">
                {filing ? 'Filing with IRS…' : 'File EIN application'}
              </button>
            )}
            {filing && (
              <div className="mt-4 text-sm text-muted">
                <div>→ Submitting SS-4 to IRS e-services…</div>
                <div>→ Estate: {deceased?.fullName}</div>
                <div>→ Awaiting confirmation…</div>
              </div>
            )}
            {estateAccount.ein && (
              <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm">
                <div className="font-medium">EIN assigned: <span className="font-mono">{estateAccount.ein}</span></div>
                <div className="text-muted">IRS confirmation received. Keep this number for all tax filings.</div>
              </div>
            )}
          </div>

          {/* Step: open account */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl">2 · Open the consolidation account</h2>
                <p className="text-muted text-sm mt-1">An FDIC-insured estate checking account held with our partner bank.</p>
              </div>
              <StatusBadge status={status === 'opened' ? 'confirmed' : 'pending'} />
            </div>

            {status === 'ein_filed' && (
              <button onClick={openEstateAccount} className="btn-primary mt-4">Open estate account</button>
            )}
            {status === 'opened' && (
              <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
                <div className="rounded-lg bg-cream border border-black/10 px-4 py-3">
                  <div className="text-xs text-muted">Account number</div>
                  <div className="font-mono">{estateAccount.accountNumber}</div>
                </div>
                <div className="rounded-lg bg-cream border border-black/10 px-4 py-3">
                  <div className="text-xs text-muted">Routing</div>
                  <div className="font-mono">{estateAccount.routingNumber}</div>
                </div>
                <div className="rounded-lg bg-cream border border-black/10 px-4 py-3">
                  <div className="text-xs text-muted">FDIC coverage</div>
                  <div>Up to $250,000</div>
                </div>
              </div>
            )}
          </div>

          {/* Transactions */}
          {status === 'opened' && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-2xl">Transactions</h2>
                <button onClick={() => setTxOpen(true)} className="btn-secondary text-sm">Log expense</button>
              </div>
              {estateAccount.transactions.length === 0 ? (
                <p className="text-muted text-sm">No transactions yet. Funds will appear here after they're transferred from closed accounts.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-left text-muted border-b border-black/5">
                    <tr>
                      <th className="py-2 pr-3 font-normal">Date</th>
                      <th className="py-2 pr-3 font-normal">Description</th>
                      <th className="py-2 pr-3 font-normal">Category</th>
                      <th className="py-2 pr-3 font-normal text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estateAccount.transactions.map((t) => (
                      <tr key={t.id} className="border-b border-black/5 last:border-0">
                        <td className="py-2 pr-3 text-muted">{t.date}</td>
                        <td className="py-2 pr-3">{t.description}</td>
                        <td className="py-2 pr-3 capitalize text-muted">{t.category.replace(/_/g, ' ')}</td>
                        <td className={`py-2 pr-3 text-right font-medium ${t.amount >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {t.amount >= 0 ? '+' : ''}<Money value={t.amount} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Balance card */}
        <aside className="card h-fit sticky top-24">
          <div className="text-xs uppercase tracking-wider text-muted">Estate balance</div>
          <div className="font-serif text-4xl mt-1"><Money value={estateAccount.balance} /></div>
          <div className="mt-4 text-sm space-y-1.5">
            <div className="flex justify-between"><span className="text-muted">EIN status</span><span>{estateAccount.ein ? 'Filed' : 'Not filed'}</span></div>
            <div className="flex justify-between"><span className="text-muted">Account status</span><span className="capitalize">{status.replace(/_/g, ' ')}</span></div>
            <div className="flex justify-between"><span className="text-muted">Transactions</span><span>{estateAccount.transactions.length}</span></div>
          </div>
          {status === 'opened' && (
            <Link to="/app/transfers" className="btn-primary w-full mt-6 text-sm">Transfer funds in</Link>
          )}
        </aside>
      </div>

      <Modal open={txOpen} onClose={() => setTxOpen(false)} title="Log an estate expense">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const n = parseFloat(amt)
            if (!isNaN(n)) {
              addTransaction({ description: desc, amount: -Math.abs(n), category: cat })
              setDesc(''); setAmt(''); setTxOpen(false)
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="label">Description</label>
            <input className="input" required value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Funeral service payment to Anderson Mortuary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Amount</label>
              <input type="number" min="0" step="0.01" required className="input" value={amt} onChange={(e) => setAmt(e.target.value)} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={cat} onChange={(e) => setCat(e.target.value as typeof cat)}>
                {CATEGORIES.map((c) => <option key={c.v} value={c.v}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <button className="btn-primary w-full">Record expense</button>
        </form>
      </Modal>
    </AppShell>
  )
}

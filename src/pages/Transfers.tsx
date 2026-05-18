import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/Layout'
import PipelineTracker from '../components/PipelineTracker'
import { Money, SectionHeader, StatPill, StatusBadge } from '../components/ui'
import { useStore } from '../store'

export default function Transfers() {
  const {
    assets, estateAccount, closeAndTransfer,
    fraudCheckPassed, runFraudCheck, setStep,
  } = useStore((s) => ({
    assets: s.assets, estateAccount: s.estateAccount,
    closeAndTransfer: s.closeAndTransfer,
    fraudCheckPassed: s.fraudCheckPassed, runFraudCheck: s.runFraudCheck,
    setStep: s.setStep,
  }))
  const [running, setRunning] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => { setStep(5) }, [setStep])

  async function doFraudCheck() {
    setRunning(true)
    await runFraudCheck()
    setRunning(false)
  }

  // Cash-like assets are eligible for transfer; physical assets are sold elsewhere.
  const transferable = assets.filter((a) =>
    ['Checking', 'Savings', 'CD', 'IRA', '401k', 'HSA', 'Stocks', 'Bonds', 'Crypto', 'Life Insurance', 'Funeral Insurance', 'Business Account', 'Pension'].includes(a.type)
  )
  const completed = transferable.filter((a) => a.status === 'transferred')

  return (
    <AppShell>
      <SectionHeader
        title="Step 5 — Financial transfer"
        subtitle="Close discovered accounts and consolidate funds into the estate account. All transfers run after an identity & fraud check."
        right={
          completed.length > 0 && (
            <Link to="/app/distribution" className="btn-primary text-sm">Next: distribution →</Link>
          )
        }
      />
      <PipelineTracker />

      <div className="grid sm:grid-cols-4 gap-3 mt-8">
        <StatPill label="Eligible accounts" value={transferable.length} />
        <StatPill label="Transferred" value={completed.length} tone="good" />
        <StatPill label="Estate balance" value={<Money value={estateAccount.balance} />} tone="good" />
        <StatPill label="Fraud check" value={fraudCheckPassed ? 'Passed' : 'Required'} tone={fraudCheckPassed ? 'good' : 'warn'} />
      </div>

      {!fraudCheckPassed && (
        <div className="card mt-8">
          <h2 className="font-serif text-2xl mb-2">Identity & fraud check</h2>
          <p className="text-muted text-sm mb-4">
            Before any funds move, we verify the personal representative's identity, validate court-issued letters,
            and run a sanctions / fraud screen against the account holders.
          </p>
          <ul className="text-sm space-y-1.5 mb-4">
            <li className="flex gap-2"><span>•</span><span>Government ID match</span></li>
            <li className="flex gap-2"><span>•</span><span>Letters Testamentary verification</span></li>
            <li className="flex gap-2"><span>•</span><span>OFAC / sanctions screening</span></li>
            <li className="flex gap-2"><span>•</span><span>Behavioral fraud score</span></li>
          </ul>
          <button onClick={doFraudCheck} disabled={running} className="btn-primary">
            {running ? 'Running checks…' : 'Run identity & fraud check'}
          </button>
        </div>
      )}

      {fraudCheckPassed && (
        <div className="card mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl">Eligible accounts</h2>
            <div className="text-sm text-emerald-700">✓ Fraud check passed — transfers unlocked</div>
          </div>
          <p className="text-muted text-sm mb-4">
            Each transfer closes the source account and credits the estate bank account.
            Tax-advantaged accounts (IRA, 401k, HSA) may go directly to named beneficiaries if applicable.
          </p>
          {estateAccount.status !== 'opened' && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm mb-4">
              Open the estate bank account first to receive incoming transfers. <Link className="underline" to="/app/estate-account">Go to step 3 →</Link>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted border-b border-black/5">
                <tr>
                  <th className="py-2 pr-3 font-normal">Institution</th>
                  <th className="py-2 pr-3 font-normal">Account</th>
                  <th className="py-2 pr-3 font-normal">Type</th>
                  <th className="py-2 pr-3 font-normal text-right">Balance</th>
                  <th className="py-2 pr-3 font-normal">Status</th>
                  <th className="py-2 pr-3 font-normal">Action</th>
                </tr>
              </thead>
              <tbody>
                {transferable.map((a) => (
                  <tr key={a.id} className="border-b border-black/5 last:border-0">
                    <td className="py-2 pr-3 font-medium">{a.institution}</td>
                    <td className="py-2 pr-3 font-mono text-xs">••{a.accountLast4}</td>
                    <td className="py-2 pr-3">{a.type}</td>
                    <td className="py-2 pr-3 text-right font-medium"><Money value={a.balance} /></td>
                    <td className="py-2 pr-3"><StatusBadge status={a.status} /></td>
                    <td className="py-2 pr-3">
                      {a.status === 'transferred' ? (
                        <span className="text-xs text-emerald-700">✓ Closed & transferred</span>
                      ) : (
                        <button
                          onClick={() => setConfirmId(a.id)}
                          disabled={estateAccount.status !== 'opened'}
                          className="text-sm text-sunset-700 hover:underline disabled:text-muted disabled:no-underline"
                        >Close & transfer →</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {completed.length >= 3 && (
            <div className="flex items-center justify-end mt-6">
              <Link to="/app/distribution" className="btn-primary">Continue to distribution →</Link>
            </div>
          )}
        </div>
      )}

      {confirmId && (
        <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4" onClick={() => setConfirmId(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl mb-2">Confirm transfer</h3>
            <p className="text-sm text-muted">
              This will instruct {assets.find((a) => a.id === confirmId)?.institution} to close ••{assets.find((a) => a.id === confirmId)?.accountLast4} and
              wire <Money value={assets.find((a) => a.id === confirmId)?.balance ?? 0} /> to the estate account. This action is logged but cannot be undone in real life.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button className="btn-ghost text-sm" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="btn-primary text-sm" onClick={() => { closeAndTransfer(confirmId); setConfirmId(null) }}>Confirm transfer</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}

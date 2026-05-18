import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/Layout'
import PipelineTracker from '../components/PipelineTracker'
import { Modal, SectionHeader, StatusBadge } from '../components/ui'
import { useStore } from '../store'
import { US_STATES, countiesFor } from '../data/statesCounties'

export default function Probate() {
  const {
    probateState, probateCounty, probateForms,
    setProbateJurisdiction, generateForms,
    notarizationScheduled, scheduleNotary, markFormStatus, setStep,
  } = useStore((s) => ({
    probateState: s.probateState, probateCounty: s.probateCounty,
    probateForms: s.probateForms,
    setProbateJurisdiction: s.setProbateJurisdiction, generateForms: s.generateForms,
    notarizationScheduled: s.notarizationScheduled, scheduleNotary: s.scheduleNotary,
    markFormStatus: s.markFormStatus, setStep: s.setStep,
  }))
  const [openForm, setOpenForm] = useState<string | null>(null)
  const [notaryOpen, setNotaryOpen] = useState(false)
  const [notaryDt, setNotaryDt] = useState('')
  const [notaryProvider, setNotaryProvider] = useState('Notarize.com')

  useEffect(() => { setStep(2) }, [setStep])

  const counties = countiesFor(probateState)
  const form = probateForms.find((f) => f.id === openForm)

  return (
    <AppShell>
      <SectionHeader
        title="Step 2 — Probate documents"
        subtitle="Generate the right court forms for your county. Notarize online when ready."
        right={
          probateForms.length > 0 && (
            <Link to="/app/estate-account" className="btn-primary text-sm">Next: estate account →</Link>
          )
        }
      />
      <PipelineTracker />

      <div className="card mt-8">
        <h2 className="font-serif text-2xl mb-4">Jurisdiction</h2>
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="label">State</label>
            <select
              className="input"
              value={probateState}
              onChange={(e) => setProbateJurisdiction(e.target.value, '')}
            >
              <option value="">Select state</option>
              {US_STATES.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">County</label>
            <select
              className="input"
              value={probateCounty}
              onChange={(e) => setProbateJurisdiction(probateState, e.target.value)}
              disabled={!probateState}
            >
              <option value="">Select county</option>
              {counties.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button
              className="btn-primary w-full"
              onClick={generateForms}
              disabled={!probateState || !probateCounty}
            >Generate forms</button>
          </div>
        </div>
        <p className="text-xs text-muted">Sunset supports all 50 states and 3,000+ counties. Forms are pre-filled with estate information from step 1.</p>
      </div>

      {probateForms.length > 0 && (
        <div className="card mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl">Forms for {probateCounty} County, {probateState}</h2>
            <button onClick={() => setNotaryOpen(true)} className="btn-secondary text-sm">
              {notarizationScheduled ? `Notary: ${new Date(notarizationScheduled.dt).toLocaleString()}` : 'Schedule online notary'}
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {probateForms.map((f) => (
              <div key={f.id} className="rounded-xl border border-black/10 p-4 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="font-medium">{f.title}</div>
                    <div className="text-xs text-muted mt-0.5">{f.jurisdiction} · {f.pages} pages</div>
                  </div>
                  <StatusBadge status={f.status} />
                </div>
                <p className="text-sm text-muted flex-1">{f.description}</p>
                <div className="flex items-center gap-2 mt-4">
                  <button onClick={() => setOpenForm(f.id)} className="btn-ghost text-sm">Preview</button>
                  {f.status === 'draft' && (
                    <button onClick={() => markFormStatus(f.id, 'ready')} className="btn-ghost text-sm">Mark ready</button>
                  )}
                  {f.status === 'ready' && (
                    <button onClick={() => markFormStatus(f.id, 'notarized')} className="btn-ghost text-sm">Mark notarized</button>
                  )}
                  {f.status === 'notarized' && (
                    <button onClick={() => markFormStatus(f.id, 'filed')} className="btn-ghost text-sm">Mark filed</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end mt-6">
            <Link to="/app/estate-account" className="btn-primary">Continue to estate account →</Link>
          </div>
        </div>
      )}

      <Modal open={!!openForm} onClose={() => setOpenForm(null)} title={form?.title ?? ''} wide>
        {form && (
          <div>
            <div className="text-xs text-muted mb-2">{form.jurisdiction} · {form.pages} pages · <StatusBadge status={form.status} /></div>
            <div className="rounded-xl bg-cream border border-black/10 p-5 font-mono text-xs leading-relaxed max-h-96 overflow-y-auto whitespace-pre-line">
{`IN THE ${form.jurisdiction.toUpperCase()} CIRCUIT COURT
PROBATE DIVISION

${form.title.toUpperCase()}

Estate of: ${useStore.getState().deceased?.fullName ?? '____________________'}
Date of Death: ${useStore.getState().deceased?.dod ?? '____________________'}
Last Known Address: ${useStore.getState().deceased?.addressLine1 ?? '____________________'}

TO THE HONORABLE COURT:

The undersigned Petitioner hereby states that the above-named Decedent
died on the date set forth above, leaving an estate within the
jurisdiction of this Court that requires administration under the laws
of ${form.jurisdiction}.

Petitioner respectfully requests that this Court enter an Order
acknowledging the matters herein, granting the relief sought, and
proceeding in accordance with applicable statutes.

[PRE-FILLED FROM ESTATE WORKSPACE — review before filing.]
`}
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button className="btn-ghost text-sm" onClick={() => setOpenForm(null)}>Close</button>
              <button className="btn-primary text-sm" onClick={() => { markFormStatus(form.id, 'ready'); setOpenForm(null) }}>Approve & mark ready</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={notaryOpen} onClose={() => setNotaryOpen(false)} title="Schedule online notarization">
        <div className="space-y-4">
          <div>
            <label className="label">Provider</label>
            <select className="input" value={notaryProvider} onChange={(e) => setNotaryProvider(e.target.value)}>
              <option>Notarize.com</option>
              <option>OneNotary</option>
              <option>Proof (Notarize)</option>
              <option>DocuSign Notary</option>
            </select>
          </div>
          <div>
            <label className="label">Appointment</label>
            <input type="datetime-local" className="input" value={notaryDt} onChange={(e) => setNotaryDt(e.target.value)} />
          </div>
          <p className="text-xs text-muted">
            The notary will join a secure video call. All ready forms will be queued for signature.
          </p>
          <button
            className="btn-primary w-full"
            disabled={!notaryDt}
            onClick={() => { scheduleNotary(notaryDt, notaryProvider); setNotaryOpen(false) }}
          >Confirm appointment</button>
        </div>
      </Modal>
    </AppShell>
  )
}

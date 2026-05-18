import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { US_STATES, countiesFor } from '../data/statesCounties'
import { Logo } from '../components/Layout'
import { demoDeceased } from '../data/demoEstate'

const STEPS = ['Their info', 'Death certificate', 'Your relationship', 'Run discovery']

export default function Intake() {
  const [stage, setStage] = useState(0)
  const [fullName, setFullName] = useState('')
  const [ssn, setSsn] = useState('')
  const [dob, setDob] = useState('')
  const [dod, setDod] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [city, setCity] = useState('')
  const [stateCode, setStateCode] = useState('')
  const [county, setCounty] = useState('')
  const [zip, setZip] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [relationship, setRelationship] = useState('')

  const { setDeceased, runDiscovery, loadDemoEstate, setStep } = useStore((s) => ({
    setDeceased: s.setDeceased, runDiscovery: s.runDiscovery,
    loadDemoEstate: s.loadDemoEstate, setStep: s.setStep,
  }))
  const nav = useNavigate()

  function fillDemo() {
    setFullName(demoDeceased.fullName)
    setSsn(demoDeceased.ssn)
    setDob(demoDeceased.dob)
    setDod(demoDeceased.dod)
    setAddressLine1(demoDeceased.addressLine1)
    setCity(demoDeceased.city)
    setStateCode(demoDeceased.state)
    setCounty(demoDeceased.county ?? '')
    setZip(demoDeceased.zip)
    setFileName('death_certificate_mitchell.pdf')
    setRelationship('Spouse')
  }

  async function startSearch() {
    setDeceased({
      fullName, ssn, dob, dod,
      addressLine1, city, state: stateCode, zip, county: county || undefined,
    })
    setStep(1)
    nav('/app/discovery')
    await runDiscovery()
  }

  return (
    <div className="min-h-screen sunset-sky-soft">
      <header className="section flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-serif text-2xl">Sunset</span>
        </div>
        <button
          onClick={() => { loadDemoEstate(); nav('/app') }}
          className="btn-ghost text-sm"
        >
          Skip — load demo estate
        </button>
      </header>

      <div className="section py-6">
        <div className="max-w-2xl mx-auto">
          <ol className="flex items-center justify-between mb-8 text-xs">
            {STEPS.map((s, i) => (
              <li key={s} className="flex-1 flex items-center">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  i <= stage ? 'bg-ink text-cream' : 'bg-black/10 text-muted'
                }`}>{i + 1}</div>
                <span className={`ml-2 ${i === stage ? 'font-medium' : 'text-muted'}`}>{s}</span>
                {i < STEPS.length - 1 && <div className="flex-1 h-px bg-black/10 mx-3" />}
              </li>
            ))}
          </ol>

          <div className="card">
            {stage === 0 && (
              <div className="space-y-4">
                <h2 className="font-serif text-3xl">Tell us about your loved one</h2>
                <p className="text-muted text-sm">This stays private. We use it only to find accounts in their name.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full legal name</label>
                    <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Social Security Number</label>
                    <input className="input" placeholder="XXX-XX-XXXX" value={ssn} onChange={(e) => setSsn(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Date of birth</label>
                    <input type="date" className="input" value={dob} onChange={(e) => setDob(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Date of death</label>
                    <input type="date" className="input" value={dod} onChange={(e) => setDod(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Address at time of death</label>
                    <input className="input mb-2" placeholder="Street address" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <input className="input" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                      <select className="input" value={stateCode} onChange={(e) => { setStateCode(e.target.value); setCounty('') }}>
                        <option value="">State</option>
                        {US_STATES.map((s) => <option key={s.code} value={s.code}>{s.code}</option>)}
                      </select>
                      <select className="input" value={county} onChange={(e) => setCounty(e.target.value)} disabled={!stateCode}>
                        <option value="">County</option>
                        {countiesFor(stateCode).map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input className="input" placeholder="ZIP" value={zip} onChange={(e) => setZip(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <button onClick={fillDemo} className="text-sm text-sunset-700 hover:underline">Fill with demo data</button>
                  <button
                    className="btn-primary"
                    disabled={!fullName || !dod}
                    onClick={() => setStage(1)}
                  >Continue</button>
                </div>
              </div>
            )}

            {stage === 1 && (
              <div className="space-y-4">
                <h2 className="font-serif text-3xl">Upload the death certificate</h2>
                <p className="text-muted text-sm">A certified copy helps us reach custodians on your behalf. You can also skip and provide it later.</p>
                <label className="block border-2 border-dashed border-black/15 rounded-xl p-10 text-center cursor-pointer hover:border-sunset-400 transition">
                  <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
                  <div className="text-4xl mb-2">📄</div>
                  <div className="font-medium">{fileName ? fileName : 'Drop a file or click to upload'}</div>
                  <div className="text-xs text-muted mt-1">PDF, PNG, or JPG up to 25 MB</div>
                </label>
                <div className="flex items-center justify-between pt-2">
                  <button onClick={() => setStage(0)} className="btn-ghost text-sm">Back</button>
                  <button onClick={() => setStage(2)} className="btn-primary">Continue</button>
                </div>
              </div>
            )}

            {stage === 2 && (
              <div className="space-y-4">
                <h2 className="font-serif text-3xl">Your relationship</h2>
                <p className="text-muted text-sm">This determines which forms you'll need and how distributions work.</p>
                <div className="grid sm:grid-cols-3 gap-2">
                  {['Spouse', 'Child', 'Parent', 'Sibling', 'Executor', 'Other'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRelationship(r)}
                      className={`rounded-xl border p-4 text-left transition ${
                        relationship === r ? 'border-sunset-500 bg-sunset-50' : 'border-black/10 hover:border-sunset-300'
                      }`}
                    >
                      <div className="font-medium">{r}</div>
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <button onClick={() => setStage(1)} className="btn-ghost text-sm">Back</button>
                  <button onClick={() => setStage(3)} className="btn-primary" disabled={!relationship}>Continue</button>
                </div>
              </div>
            )}

            {stage === 3 && (
              <div className="space-y-4">
                <h2 className="font-serif text-3xl">Ready when you are</h2>
                <p className="text-muted text-sm">We'll search across registries, custodian networks, and unclaimed-property databases. This typically takes a few seconds in our demo (and a few hours in real life).</p>
                <div className="rounded-xl border border-black/10 bg-cream p-4 text-sm space-y-1">
                  <div><span className="text-muted">Name:</span> {fullName || '—'}</div>
                  <div><span className="text-muted">SSN:</span> {ssn || '—'}</div>
                  <div><span className="text-muted">Date of death:</span> {dod || '—'}</div>
                  <div><span className="text-muted">Jurisdiction:</span> {county ? `${county} County, ` : ''}{stateCode || '—'}</div>
                  <div><span className="text-muted">Death certificate:</span> {fileName || 'Not uploaded'}</div>
                  <div><span className="text-muted">Your relationship:</span> {relationship || '—'}</div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <button onClick={() => setStage(2)} className="btn-ghost text-sm">Back</button>
                  <button onClick={startSearch} className="btn-primary">Begin search</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

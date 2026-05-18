import { Link } from 'react-router-dom'
import { useStore } from '../store'

const STEPS = [
  { key: 'discover', label: 'Discover assets & debts', to: '/app/discovery', step: 1 },
  { key: 'probate', label: 'Generate probate docs', to: '/app/probate', step: 2 },
  { key: 'estate', label: 'Open estate account', to: '/app/estate-account', step: 3 },
  { key: 'closures', label: 'Notify creditors', to: '/app/closures', step: 4 },
  { key: 'transfers', label: 'Transfer funds', to: '/app/transfers', step: 5 },
  { key: 'distribute', label: 'Distribute to heirs', to: '/app/distribution', step: 5 },
] as const

export default function PipelineTracker() {
  const { currentStep, highestStep } = useStore((s) => ({ currentStep: s.currentStep, highestStep: s.highestStep }))
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl">Your estate pipeline</h2>
        <div className="text-xs text-muted">Step {currentStep} of 5</div>
      </div>
      <ol className="grid md:grid-cols-6 gap-3">
        {STEPS.map((s, idx) => {
          const reached = s.step <= highestStep
          const active = s.step === currentStep
          return (
            <li key={s.key}>
              <Link to={s.to} className={`block rounded-xl p-3 border transition ${
                active ? 'bg-sunset-100 border-sunset-400 ring-2 ring-sunset-300' :
                reached ? 'bg-white border-black/10 hover:border-sunset-400' :
                'bg-black/5 border-transparent text-muted'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    reached ? 'bg-ink text-cream' : 'bg-black/10 text-muted'
                  }`}>{idx + 1}</span>
                  {active && <span className="text-[10px] uppercase tracking-wider text-sunset-700">Current</span>}
                </div>
                <div className="text-sm font-medium leading-tight">{s.label}</div>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

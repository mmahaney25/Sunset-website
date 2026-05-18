import { Link } from 'react-router-dom'
import { MarketingFooter, MarketingNav } from '../components/Layout'
import { TESTIMONIALS, PARTNERS } from '../data/testimonials'
import { Star } from '../components/ui'

const ASSET_TYPES = [
  { label: 'IRA', icon: '🏛️' },
  { label: '401(k)', icon: '💼' },
  { label: 'Savings', icon: '🏦' },
  { label: 'Checking', icon: '💳' },
  { label: 'CDs', icon: '📜' },
  { label: 'Stocks', icon: '📈' },
  { label: 'Bonds', icon: '🧾' },
  { label: 'Life insurance', icon: '🕊️' },
  { label: 'Funeral insurance', icon: '🌿' },
  { label: 'HSA', icon: '🩺' },
  { label: 'Credit-card rewards', icon: '🎁' },
  { label: 'Property', icon: '🏡' },
  { label: 'Vehicles', icon: '🚗' },
  { label: 'Crypto', icon: '🪙' },
  { label: 'Business accounts', icon: '🏢' },
  { label: 'Pensions', icon: '🪙' },
]

const BENEFITS = [
  {
    title: 'Expert-guided',
    body: 'A dedicated specialist works alongside you. We never hand you a checklist and walk away.',
    icon: '🤝',
  },
  {
    title: 'No cost to start',
    body: 'Discovery is free. You only pay when we find or recover something meaningful for the estate.',
    icon: '🌱',
  },
  {
    title: 'You stay in control',
    body: 'Nothing happens without your explicit approval. We surface options; the family decides.',
    icon: '🪶',
  },
]

const STEPS = [
  { n: 1, title: 'Discover', body: 'Upload a death certificate. We scan financial registries, custodian networks, and unclaimed property databases to find every account.' },
  { n: 2, title: 'Probate', body: 'We generate the right forms for your county — across all 50 states and 3,000+ jurisdictions — and queue up online notarization.' },
  { n: 3, title: 'Consolidate', body: 'Open a federally-insured estate bank account, file the EIN with the IRS, and bring all funds together in one place.' },
  { n: 4, title: 'Close', body: 'Notify creditors, custodians, and government agencies — by email, fax, mail, or phone — and track every response.' },
  { n: 5, title: 'Distribute', body: 'Pay debts, then move what remains to the heirs named in the will or determined by state intestacy law.' },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <MarketingNav />

      {/* HERO */}
      <section className="sunset-sky-soft border-b border-black/5">
        <div className="section py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 chip mb-6">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Trusted by 10,000+ families
          </div>
          <h1 className="font-serif text-5xl md:text-7xl tracking-tight leading-[1.05]">
            Find what they<br /> left behind.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
            Settling an estate is overwhelming. Sunset finds every account, prepares the paperwork,
            and walks alongside your family to the very last signature.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/begin" className="btn-primary">Begin Search</Link>
            <Link to="/how-it-works" className="btn-secondary">How it works</Link>
          </div>
          <div className="mt-10 flex items-center justify-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}
            <span className="ml-2 text-sm text-muted">4.9 average from 2,300+ reviews</span>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="border-b border-black/5 bg-cream">
        <div className="section py-10">
          <p className="text-center text-sm text-muted mb-6">Works with every major bank, brokerage, and insurer</p>
          <div className="marquee flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {PARTNERS.map((p) => (
              <div key={p} className="text-xl md:text-2xl font-serif text-ink/60 hover:text-ink transition">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section py-20">
        <h2 className="font-serif text-4xl text-center tracking-tight">A new kind of help, when it matters most</h2>
        <p className="text-muted text-center mt-3 max-w-2xl mx-auto">Three principles that guide every estate we settle.</p>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {BENEFITS.map((b) => (
            <div key={b.title} className="card">
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="font-serif text-2xl mb-2">{b.title}</h3>
              <p className="text-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DIY vs SUNSET */}
      <section id="compare" className="bg-white border-y border-black/5">
        <div className="section py-20">
          <h2 className="font-serif text-4xl text-center tracking-tight">Doing this alone vs. doing this with Sunset</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <div className="rounded-2xl border border-black/10 p-6">
              <div className="text-sm uppercase tracking-wider text-muted mb-3">On your own</div>
              <ul className="space-y-3 text-sm">
                {[
                  '6 to 18 months of paperwork on average',
                  'Dozens of phone calls to banks, custodians, agencies',
                  'Forgotten accounts go to the state as unclaimed property',
                  'Probate forms vary by county — easy to file the wrong one',
                  'No single place to track which creditor was notified',
                ].map((t) => (
                  <li key={t} className="flex gap-2"><span>✕</span><span>{t}</span></li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-sunset-400 bg-sunset-50 p-6">
              <div className="text-sm uppercase tracking-wider text-sunset-700 mb-3">With Sunset</div>
              <ul className="space-y-3 text-sm">
                {[
                  'Every account discovered in days, not months',
                  'A single specialist coordinates everyone for you',
                  'Unclaimed-property scans recover dormant funds',
                  'Forms generated for your exact county — pre-filled',
                  'One dashboard tracks every creditor and signature',
                ].map((t) => (
                  <li key={t} className="flex gap-2"><span>✓</span><span>{t}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE FIND */}
      <section id="assets" className="section py-20">
        <h2 className="font-serif text-4xl text-center tracking-tight">What we find</h2>
        <p className="text-muted text-center mt-3 max-w-2xl mx-auto">
          Sunset searches across 16 asset categories — including the ones people forget about most.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
          {ASSET_TYPES.map((a) => (
            <div key={a.label} className="card flex items-center gap-3 hover:border-sunset-400 transition">
              <span className="text-2xl">{a.icon}</span>
              <span className="font-medium">{a.label}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted mt-6">
          …plus credit cards, personal & student loans, mortgages, HELOCs, medical debt, business loans, lines of credit, and collections.
        </p>
      </section>

      {/* PROCESS */}
      <section className="bg-white border-y border-black/5">
        <div className="section py-20">
          <h2 className="font-serif text-4xl text-center tracking-tight">Five steps, start to finish</h2>
          <div className="grid md:grid-cols-5 gap-6 mt-12">
            {STEPS.map((s) => (
              <div key={s.n} className="relative">
                <div className="text-sunset-600 font-serif text-5xl">{String(s.n).padStart(2, '0')}</div>
                <h3 className="font-serif text-xl mt-2">{s.title}</h3>
                <p className="text-sm text-muted mt-2">{s.body}</p>
                <Link to="/how-it-works" className="text-sm text-sunset-700 hover:underline mt-3 inline-block">Learn more →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="section py-20">
        <h2 className="font-serif text-4xl text-center tracking-tight">Stories from the families we've helped</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}
              </div>
              <blockquote className="text-ink/90">"{t.quote}"</blockquote>
              <figcaption className="mt-4 text-sm text-muted">
                <span className="font-medium text-ink">{t.name}</span> · {t.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="sunset-sky">
        <div className="section py-20 text-center text-ink">
          <h2 className="font-serif text-5xl tracking-tight">When you're ready, we're here.</h2>
          <p className="mt-4 max-w-xl mx-auto">Start a free search. We'll show you everything we find before you commit to anything.</p>
          <Link to="/begin" className="btn-primary mt-8">Begin Search</Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}

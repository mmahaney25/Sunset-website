import { Link } from 'react-router-dom'
import { MarketingFooter, MarketingNav } from '../components/Layout'

const SECTIONS = [
  {
    n: 1,
    title: 'Discovery',
    body: 'Within hours of receiving the death certificate, Sunset queries IRS records, broker registries, the FDIC bank database, the NAIC Life Policy Locator, and county deed and title offices. Every account in the decedent\'s name is collected, deduplicated, and presented in a single report.',
  },
  {
    n: 2,
    title: 'Probate documents',
    body: 'Probate is a county-by-county process. Sunset maintains pre-filled templates for all 50 states and 3,000+ counties — petitions for administration, inventories, oaths, notices to creditors, estate-tax certifications. When the forms are ready, an online notary can join over video to witness signatures.',
  },
  {
    n: 3,
    title: 'Estate bank account',
    body: 'The IRS requires an EIN for any estate that handles money. Sunset files SS-4 on your behalf and uses the resulting EIN to open an FDIC-insured estate checking account with our partner bank — a single, transparent ledger for all incoming funds and outgoing expenses.',
  },
  {
    n: 4,
    title: 'Closure & notifications',
    body: 'Some custodians prefer email. Some still require a faxed letter. Some demand certified mail with a sealed death certificate. Sunset composes the right notice for every channel, sends it, tracks the response, and flags creditors who go silent past the 14 or 30-day deadline.',
  },
  {
    n: 5,
    title: 'Transfer & distribution',
    body: 'Once notifications are confirmed and the estate has its account, we close source accounts, transfer funds in, settle outstanding debts, and finally distribute what remains — per the will, per a trust schedule, or per state intestacy law if there\'s no will. Every step requires the personal representative\'s explicit approval.',
  },
]

export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <section className="sunset-sky-soft border-b border-black/5">
        <div className="section py-16 text-center">
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight">How Sunset works</h1>
          <p className="text-muted mt-4 max-w-2xl mx-auto">
            Five steps. One workspace. A specialist alongside you the entire way.
          </p>
          <Link to="/begin" className="btn-primary mt-8">Begin Search</Link>
        </div>
      </section>

      <section className="section py-16">
        <div className="space-y-12">
          {SECTIONS.map((s) => (
            <div key={s.n} className="grid md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-3">
                <div className="text-sunset-600 font-serif text-6xl">{String(s.n).padStart(2, '0')}</div>
                <h2 className="font-serif text-3xl mt-2">{s.title}</h2>
              </div>
              <div className="md:col-span-9">
                <p className="text-ink/85 text-lg leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-black/5">
        <div className="section py-16 text-center">
          <h2 className="font-serif text-4xl tracking-tight">Common questions</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-10 text-left">
            {[
              ['How long does it take?', 'Most estates we work on settle in 3 to 6 months. Court timelines for probate vary by county; everything else moves at the speed of the family.'],
              ['What does it cost?', 'Discovery is free. Sunset charges a flat fee for full estate administration, plus a small percentage of recovered dormant or unclaimed funds.'],
              ['Is my data secure?', 'All information is encrypted at rest and in transit. Account credentials are never stored — we use read-only API access and certified-mail channels.'],
              ['What if there\'s no will?', 'We follow state intestacy law to determine heirs and shares. The distribution step previews exactly what each heir is entitled to before anything moves.'],
            ].map(([q, a]) => (
              <div key={q} className="card">
                <h3 className="font-medium">{q}</h3>
                <p className="text-muted mt-2 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}

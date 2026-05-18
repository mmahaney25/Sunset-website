import { Link, NavLink, useLocation } from 'react-router-dom'
import { useStore } from '../store'

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-cream/80 border-b border-black/5">
      <div className="section flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-serif text-2xl tracking-tight">Sunset</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          <NavLink to="/how-it-works" className="hover:text-sunset-700">How it works</NavLink>
          <a href="#assets" className="hover:text-sunset-700">What we find</a>
          <a href="#testimonials" className="hover:text-sunset-700">Stories</a>
          <a href="#compare" className="hover:text-sunset-700">DIY vs Sunset</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link to="/begin" className="btn-primary text-sm">Begin Search</Link>
        </div>
      </div>
    </header>
  )
}

export function MarketingFooter() {
  return (
    <footer className="mt-24 bg-ink text-cream">
      <div className="section py-14 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Logo light />
            <span className="font-serif text-2xl">Sunset</span>
          </div>
          <p className="text-sm text-cream/70 max-w-xs">A gentler way to settle an estate. Built for families navigating loss.</p>
        </div>
        <div>
          <div className="font-medium mb-3">Product</div>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/how-it-works">How it works</Link></li>
            <li><Link to="/begin">Begin search</Link></li>
            <li><a href="#assets">What we find</a></li>
            <li><a href="#compare">DIY vs Sunset</a></li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3">Company</div>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><a href="#">About</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3">Resources</div>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><a href="#">Estate guide</a></li>
            <li><a href="#">Probate by state</a></li>
            <li><a href="#">Glossary</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-xs text-cream/50 text-center">
        © 2026 Sunset Estate Services. This is a demonstration clone — not a real financial service.
      </div>
    </footer>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fb923c" />
          <stop offset="1" stopColor="#c2410c" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" fill="url(#lg)" />
      <circle cx="16" cy="20" r="7" fill={light ? '#fdf6ec' : '#fff7ed'} />
      <rect x="2" y="20" width="28" height="2" fill={light ? '#fdf6ec' : '#7c2d12'} />
    </svg>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { signOut, deceased } = useStore((s) => ({ signOut: s.signOut, deceased: s.deceased }))
  const loc = useLocation()
  const nav = [
    { to: '/app', label: 'Overview' },
    { to: '/app/discovery', label: '1. Discovery' },
    { to: '/app/probate', label: '2. Probate' },
    { to: '/app/estate-account', label: '3. Estate Account' },
    { to: '/app/closures', label: '4. Closures' },
    { to: '/app/transfers', label: '5. Transfers' },
    { to: '/app/distribution', label: '6. Distribution' },
  ]
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-black/5">
        <div className="section flex items-center justify-between py-4">
          <Link to="/app" className="flex items-center gap-2">
            <Logo />
            <span className="font-serif text-xl">Sunset</span>
            <span className="hidden sm:inline text-xs text-muted ml-2">Estate workspace</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            {deceased && (
              <div className="hidden md:block text-right">
                <div className="text-xs text-muted">Estate of</div>
                <div className="font-medium">{deceased.fullName}</div>
              </div>
            )}
            <button onClick={signOut} className="btn-ghost text-sm">Sign out</button>
          </div>
        </div>
        <div className="section overflow-x-auto">
          <nav className="flex gap-1 pb-2 text-sm">
            {nav.map((n) => {
              const active = loc.pathname === n.to
              return (
                <Link key={n.to} to={n.to}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full ${active ? 'bg-ink text-cream' : 'hover:bg-black/5'}`}>
                  {n.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="section py-8">{children}</main>
    </div>
  )
}

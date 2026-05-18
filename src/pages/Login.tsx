import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { Logo } from '../components/Layout'

export default function Login() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [stage, setStage] = useState<'email' | 'code'>('email')
  const signIn = useStore((s) => s.signIn)
  const nav = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center sunset-sky-soft p-6">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <Logo />
        <span className="font-serif text-3xl">Sunset</span>
      </Link>
      <div className="card max-w-md w-full">
        <h1 className="font-serif text-3xl mb-2">Welcome back</h1>
        <p className="text-muted mb-6 text-sm">Sign in to continue settling the estate.</p>

        {stage === 'email' && (
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setStage('code') }}
            className="space-y-4"
          >
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                required
                autoFocus
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary w-full">Send sign-in code</button>
            <p className="text-xs text-muted text-center">No password — we'll email a one-time code.</p>
          </form>
        )}

        {stage === 'code' && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              signIn(email)
              nav('/begin')
            }}
            className="space-y-4"
          >
            <div className="rounded-lg bg-sunset-50 border border-sunset-200 px-3 py-2 text-sm">
              We sent a 6-digit code to <span className="font-medium">{email}</span>. Use code <span className="font-mono">482913</span> for this demo.
            </div>
            <div>
              <label className="label">6-digit code</label>
              <input
                type="text"
                required
                autoFocus
                className="input tracking-widest text-center"
                placeholder="••••••"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary w-full">Continue</button>
            <button type="button" onClick={() => setStage('email')} className="btn-ghost w-full text-sm">Use a different email</button>
          </form>
        )}
      </div>
      <p className="text-xs text-muted mt-6">
        Don't have an account? <Link to="/begin" className="underline">Start a free search</Link>
      </p>
    </div>
  )
}

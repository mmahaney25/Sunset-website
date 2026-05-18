# FuneralFlow Prototype

End-to-end estate-settlement walkthrough built around the **Margaret Chen demo
estate**. Nine phases of the FuneralFlow pipeline rendered as a Next.js +
Tailwind app — fully interactive, no real PII transmitted, deployable to any
Node host (Vercel recommended).

## What's in the demo

**Demo estate (pre-loaded automatically):**
- **Deceased:** Margaret Chen, age 74, died 2025-04-12, 1847 Elm St, Madison WI
- **Survivors:** David Chen (spouse / executor), Lisa Park (daughter), Michael Chen (son)
- **Assets:** 12 across 8 types — Chase checking/savings, Fidelity IRA, Vanguard 401(k),
  Schwab brokerage, MetLife life insurance, real property, vehicle, crypto,
  treasury bonds, HSA, auto-insurance refund
- **Liabilities:** 8 across 6 types — credit cards, joint mortgage,
  federal student loan (discharge-eligible), medical, utilities, personal loan
- **Will split:** 60 / 20 / 20

## The 9 phases

1. **Intake** — deceased info, death-cert upload, NoK selection, e-sign consent
2. **Discovery** — tri-bureau scan (~3s), unified asset & liability view
3. **Report** — interactive cards, joint-debt + discharge flags, PDF export
4. **Probate** — WI/Dane jurisdiction, small-estate eligibility logic, county forms
5. **Closure** — 4-tier creditor waterfall (email → mail → AI phone → user)
6. **Forms** — auto-filled institution-specific PDFs with highlighted prefills
7. **Consolidation** — EIN flow, estate account, running balance
8. **Monitoring** — 30/60/90-day re-pulls, aging alerts
9. **Distribution** — beneficiary shares, executor approval, final accounting

A **guided walkthrough** at `/walkthrough` auto-advances through every phase
with 1.5–3s simulated delays.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy

This is a standard Next.js 14 (App Router) project — push to GitHub and
import into Vercel for a one-click cloud URL.

```bash
npm run build
npm start
```

## Tech

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS
- Zustand (localStorage-persisted demo state)

> All data is fictional. No real PII or financial data is transmitted.

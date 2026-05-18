# Sunset — Estate Settlement Platform (clone)

A demonstration clone of the Sunset (hellosunset.com) estate-settlement product.
Pixel-faithful marketing site plus a fully working in-browser app shell that walks
a user through the five-step pipeline against simulated dummy data.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS
- React Router
- Zustand (persisted to localStorage)
- All data and "API" calls are in-memory simulations — nothing leaves the browser.

## Run locally

```
npm install
npm run start      # vite dev server on :5173
npm run build      # type-check + production build
npm run preview    # serve the built output on :4173
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Marketing homepage |
| `/how-it-works` | Long-form process explainer |
| `/login` | Email + one-time-code sign-in |
| `/begin` | Intake (deceased info, death certificate upload, relationship) |
| `/app` | Pipeline dashboard |
| `/app/discovery` | Step 1 — asset + liability discovery |
| `/app/probate` | Step 2 — county-specific probate forms + notary |
| `/app/estate-account` | Step 3 — EIN filing, account opening, transactions |
| `/app/closures` | Step 4 — creditor notifications (email/fax/mail/phone) |
| `/app/transfers` | Step 5 — fraud check + close & transfer accounts |
| `/app/distribution` | Step 6 — heirs, shares, approvals, distribution |

## Quick demo path

1. From the homepage click **Begin Search**.
2. On the login screen enter any email; the demo code is **482913**.
3. In intake, click **Fill with demo data**, then **Begin search**.
4. Discovery returns 12 assets across 11 types and 6 liabilities in ~2.4s.
5. Continue through probate → estate account → closures → transfers → distribution.
6. Alternatively, **Skip — load demo estate** in the intake header to jump straight to the dashboard with everything pre-populated.

## Notes

This is a demonstration only. No real searches, filings, transfers, or
notifications are performed. All identifiers, EINs, balances, and account
numbers are synthetic.

# BizPilot — Google Business AI Manager (MVP)

Production-ready MVP: Google OAuth + Accounts/Locations, AI drafts (posts & review replies), Stripe Pro (€30/mo) with 14-day trial, polished UX.

## 1) Environment Variables (Vercel → Project → Settings → Environment Variables; Production + Preview)

- `GOOGLE_CLIENT_ID` — from GCP OAuth Web client
- `GOOGLE_CLIENT_SECRET` — from GCP OAuth Web client
- `SESSION_SECRET` — random 32–64 chars (example: qgygYPkQHkYF-cM7pGJqx5aO0jlCHWyO4OEG4MbFChAZElU-FjHoONAGDiAh5oCN)
- `OPENAI_API_KEY` — your OpenAI key
- `STRIPE_SECRET_KEY` — from Stripe
- `STRIPE_PRICE_ID` — Price ID for €30/mo (with 14-day trial configured in Stripe)
- `STRIPE_WEBHOOK_SECRET` — From Stripe webhook (set endpoint to /api/stripe/webhook)

## 2) Google Cloud Console

- OAuth consent: External; add your Gmail as Test user (or Publish).
- OAuth client → Authorized redirect URI:
  `https://YOUR_DOMAIN/api/auth/callback`
- Enable APIs:
  - Business Profile API
  - My Business Business Information API
  - My Business Account Management API
- No billing required.

## 3) Stripe Setup

- Create Product “BizPilot Pro” → Recurring €30/month → **trial_period_days=14**
- Copy the **Price ID** to `STRIPE_PRICE_ID`.
- Create webhook endpoint at `https://YOUR_DOMAIN/api/stripe/webhook`
  - Events: `checkout.session.completed`, `customer.subscription.*`
  - Copy **Signing secret** to `STRIPE_WEBHOOK_SECRET`

## 4) Deploy

- Push to GitHub → Vercel build → open domain
- Self-test: `/api/_debug/selftest` → expect `ok:true`

## 5) Use

- Home → Connect Google Business
- Dashboard → pick account & location → Generate drafts → Upgrade to Pro for Publish endpoints.

> Note: Direct publishing to GBP may require additional Google access. Drafts are available immediately.

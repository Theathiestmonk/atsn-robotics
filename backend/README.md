# Contact API (SMTP)

Sends contact form submissions to `services@atsnai.com` using Gmail SMTP and a Google **App Password**.

## Setup

1. Copy `.env.example` to `.env` (never commit `.env`).

2. Fill in:

   - `SMTP_USER` — your Gmail address (the account that has the App Password).
   - `SMTP_PASS` — the 16-character App Password (not your normal Gmail password).
   - `CONTACT_TO_EMAIL` — usually `services@atsnai.com`.
   - `CORS_ORIGIN` — must include your frontend origin, e.g. `http://localhost:3000` for local Vite.

3. Install and run:

   ```bash
   npm install
   npm run dev
   ```

   Server listens on **http://localhost:8787** by default.

## Endpoints

- `GET /health` — health check
- `POST /contact` — JSON body: `{ name, email, subject, message, company?, phone? }`

## Frontend (Vite)

With the dev server on port 3000, `frontend/vite.config.js` proxies `/api/contact` → this server’s `/contact`, so the React app can use `fetch('/api/contact')` without CORS issues in development.

## Production

Deploy this service (Render, Railway, Fly.io, VPS, etc.) with HTTPS and set:

```env
CORS_ORIGIN=https://your-production-site.com
```

In the frontend build env:

```env
VITE_CONTACT_API_URL=https://your-api-host.com/contact
```

## Optional: Formspree instead

Set `VITE_CONTACT_USE_FORMSPREE=true` and `VITE_FORMSPREE_FORM_ID=...` in the frontend `.env` to use Formspree instead of this API.

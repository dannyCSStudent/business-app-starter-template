# Demo Guide

This repository powers the CRM demo and the supporting portfolio you use to sell it. Use this guide for a reproducible walk-through you can share with clients.

## 1. Bootstrap the stack

```bash
pnpm install
pnpm seed          # builds Supabase clients, tags, and activities
```

Start the backend:

```bash
cd apps/api
./.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

In other terminals:

- `cd apps/web && pnpm dev` for the dashboard  
- `cd apps/mobile && pnpm dev` for the Expo shell (set `EXPO_PUBLIC_API_URL_*` as needed)

## 2. Highlight the three demo scripts (see `/portfolio`)

1. **Lead to Launch** – Filter the home dashboard for a lead, update status/notes/tags, and show the client card adjusting in realtime.  
2. **Live Activity** – Use the shared quick-activity form to log a call, edit the note, and delete it from the mobile client detail workspace.  
3. **Data Ops** – Point out the `pnpm seed` script, the API `/health` diagnostics on mobile, and remind the client how Supabase schema + seeds keep this reproducible.

## 3. Share the portfolio shell

Send the `/portfolio` URL; it highlights the CRM, the other two demo ideas, and the scripted talking points plus a hero CTA so anyone can spin up the right feature with a single link.

## 4. Optional finishing touches

- Capture a 60-second Loom of the entire flow, referencing the titles in the Portfolio demo script.  
- Add environment-specific metadata (deploy URLs, staging badges) to `apps/web/app/page.tsx` so the link can stay current.  
- Keep the `pnpm seed` output handy when you demo so you can show live data refresh under a minute.

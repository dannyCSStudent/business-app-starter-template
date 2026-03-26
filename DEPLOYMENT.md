# Deployment Checklist

Use this guide when you’re ready to publish the CRM demo plus its portfolio shell.

## 1. API (FastAPI + Supabase)

1. Ensure Supabase project has:
   - Completed `apps/api/schema.sql`
   - `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` stored as secrets
   - Optional `supabase.seed.py` run for initial data
2. Provision a host for FastAPI (self-host, Fly.io, etc.)
3. Configure env vars: `API_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
4. Run `pnpm --filter api build` to compile Python files or rely on your deployment’s build step
5. Use `uvicorn app.main:app --host 0.0.0.0 --port 8000` (or Dockerfile) and keep `/health` and `/health/db` exposed

## 2. Web (Next.js)

1. Deploy via Vercel/Netlify/Render with env vars:
   - `NEXT_PUBLIC_API_URL` pointing at the deployed FastAPI host
2. Run the root `pnpm build` before deployment or let the platform run it
3. Ensure `/portfolio` and `/health` routes stay public; add redirect if needed

## 3. Mobile (Expo)

1. Build with Expo (classic or EAS) and set:
   - `EXPO_PUBLIC_API_URL_ANDROID` / `IOS` / `WEB` per environment
   - Optionally share `EXPO_PUBLIC_API_URL` for LAN testing
2. Use `pnpm --filter mobile dev` for local demos; run `pnpm mobile build` or EAS commands for production
3. Publish with `expo export` or `eas submit` once API+web are stable

## 4. Monitoring & Reliability

- Hook `/health` endpoints into your uptime checker or webhook
- Use `pnpm check-health` in deployment scripts for quick validation before post-deploy
- Keep a copy of `DEMO.md` and `/portfolio` URL handy for handoffs/shareables

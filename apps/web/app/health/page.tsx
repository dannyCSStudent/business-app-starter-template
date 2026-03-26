const apiBaseUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

async function fetchHealth() {
  const healthResponse = await fetch(`${apiBaseUrl}/health`, { cache: "no-store" });
  const dbResponse = await fetch(`${apiBaseUrl}/health/db`, { cache: "no-store" });

  return {
    api: healthResponse.ok ? await healthResponse.json() : { status: "unhealthy" },
    db: dbResponse.ok ? await dbResponse.json() : { status: "unhealthy" },
  };
}

export default async function HealthPage() {
  const { api, db } = await fetchHealth();

  const renderStatus = (label: string, payload: { status: string; [key: string]: unknown }) => (
    <div className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{payload.status}</p>
      <pre className="mt-4 rounded-2xl bg-black/40 p-3 text-xs text-slate-200">{JSON.stringify(payload, null, 2)}</pre>
    </div>
  );

  return (
    <main className="bg-slate-950 py-16">
      <div className="mx-auto max-w-5xl space-y-10 px-4">
        <div className="space-y-4 rounded-[32px] border border-white/5 bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Health checks</p>
          <h1 className="text-4xl font-semibold">API + DB readiness</h1>
          <p className="text-sm text-slate-300">
            Run this page before your pitch to confirm the FastAPI app and Supabase connection are up to date.
            Refresh after running `pnpm seed` so the CRM data stays aligned with the demo script.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {renderStatus("API Health", api)}
          {renderStatus("DB Health", db)}
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-sm text-slate-300">
          <p className="font-semibold text-white">Tip</p>
          <p className="mt-2">
            Save this page URL and refresh it when you want to verify the demo stack before a call. It hits
            `/health` and `/health/db` directly, which is exactly what the mobile diagnostics show per screen.
          </p>
        </div>
      </div>
    </main>
  );
}

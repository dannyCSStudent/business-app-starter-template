import Link from "next/link";
import type { Client, ClientActivity, ClientTag, ClientTagAssignment } from "@repo/types";
import { ClientDashboard } from "./client-dashboard";
import { ActivityDashboard } from "./activity-dashboard";
import { QuickActions } from "./quick-actions";
import { RecordEditor } from "./record-editor";
import { RecordManager } from "./record-manager";

const apiBaseUrl =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const fallbackClients: Client[] = [
  {
    id: "sample-1",
    name: "Acorn Atelier",
    email: "ops@acornatelier.com",
    status: "active",
    last_contacted_at: "2026-03-21T10:00:00.000Z",
    tags: [
      { id: "priority", name: "Priority", color: "#f97316" },
      { id: "design", name: "Design", color: "#0ea5e9" },
    ],
  },
  {
    id: "sample-2",
    name: "Blue Peak Logistics",
    phone: "(312) 555-0184",
    status: "lead",
    tags: [{ id: "follow-up", name: "Follow Up", color: "#f59e0b" }],
  },
  {
    id: "sample-3",
    name: "Fern Harbor Dental",
    email: "frontdesk@fernharbor.example",
    status: "completed",
    last_contacted_at: "2026-03-14T15:30:00.000Z",
  },
];

const fallbackActivity: ClientActivity[] = [
  {
    id: "activity-1",
    client_id: "sample-1",
    interaction_type: "meeting",
    notes: "Reviewed onboarding checklist and next quarter expansion scope.",
    timestamp: "2026-03-23T16:00:00.000Z",
  },
  {
    id: "activity-2",
    client_id: "sample-2",
    interaction_type: "follow_up",
    notes: "Sent pricing summary and requested budget confirmation.",
    timestamp: "2026-03-22T13:15:00.000Z",
  },
  {
    id: "activity-3",
    client_id: "sample-3",
    interaction_type: "email",
    notes: "Shared handoff notes after project completion.",
    timestamp: "2026-03-19T09:30:00.000Z",
  },
];

const fallbackTags: ClientTag[] = [
  { id: "priority", name: "Priority", color: "#f97316" },
  { id: "design", name: "Design", color: "#0ea5e9" },
  { id: "follow-up", name: "Follow Up", color: "#f59e0b" },
];

const fallbackClientTags: ClientTagAssignment[] = [
  { client_id: "sample-1", tag_id: "priority" },
  { client_id: "sample-1", tag_id: "design" },
  { client_id: "sample-2", tag_id: "follow-up" },
];

async function getDashboardData() {
  try {
    const [clientsResponse, activityResponse, tagsResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/clients/`, { cache: "no-store" }),
      fetch(`${apiBaseUrl}/activity/`, { cache: "no-store" }),
      fetch(`${apiBaseUrl}/tags/`, { cache: "no-store" }),
    ]);

    if (!clientsResponse.ok || !activityResponse.ok || !tagsResponse.ok) {
      throw new Error("Dashboard API request failed");
    }

    const [clients, activity, tags] = (await Promise.all([
      clientsResponse.json(),
      activityResponse.json(),
      tagsResponse.json(),
    ])) as [Client[], ClientActivity[], ClientTag[]];

    const clientTagsResponse = await fetch(`${apiBaseUrl}/client-tags/`, { cache: "no-store" });
    const clientTags = clientTagsResponse.ok
      ? ((await clientTagsResponse.json()) as ClientTagAssignment[])
      : [];

    const tagsById = new Map(tags.map((tag) => [tag.id, tag]));
    const enrichedClients = clients.map((client) => ({
      ...client,
      tags: clientTags
        .filter((assignment) => assignment.client_id === client.id)
        .map((assignment) => tagsById.get(assignment.tag_id))
        .filter((tag): tag is ClientTag => Boolean(tag)),
    }));

    return { clients: enrichedClients, activity, tags, clientTags, isFallback: false };
  } catch {
    return {
      clients: fallbackClients,
      activity: fallbackActivity,
      tags: fallbackTags,
      clientTags: fallbackClientTags,
      isFallback: true,
    };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const { clients, activity, tags, clientTags, isFallback } = await getDashboardData();
  const editClientParam = resolvedSearchParams?.editClient;
  const editActivityParam = resolvedSearchParams?.editActivity;
  const initialClientId =
    typeof editClientParam === "string" ? editClientParam : undefined;
  const initialActivityId =
    typeof editActivityParam === "string" ? editActivityParam : undefined;
  const activeClients = clients.filter((client) => client.status === "active").length;
  const leadClients = clients.filter((client) => client.status === "lead").length;
  const completedClients = clients.filter((client) => client.status === "completed").length;
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 sm:px-10 lg:px-12">
      <section className="rounded-[36px] border border-black/8 bg-(--color-surface)] p-8 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Northstar CRM
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Keep the pipeline visible before it becomes a fire drill.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Shared schema, shared UI, and a live API connection when available. The
              dashboard falls back to seeded sample data if the FastAPI app is not running.
            </p>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-900 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white">
              View the portfolio shell
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="grid min-w-full gap-3 sm:grid-cols-3 lg:min-w-105">
            <div className="rounded-3xl bg-slate-950 px-5 py-4 text-slate-50">
              <p className="text-sm text-slate-300">Active</p>
              <p className="mt-2 text-3xl font-semibold">{activeClients}</p>
            </div>
            <div className="rounded-3xl bg-white px-5 py-4 text-slate-900">
              <p className="text-sm text-slate-500">Leads</p>
              <p className="mt-2 text-3xl font-semibold">{leadClients}</p>
            </div>
            <div className="rounded-3xl bg-white px-5 py-4 text-slate-900">
              <p className="text-sm text-slate-500">Completed</p>
              <p className="mt-2 text-3xl font-semibold">{completedClients}</p>
            </div>
            <div className="rounded-3xl bg-white px-5 py-4 text-slate-900 sm:col-span-3 lg:col-span-3">
              <p className="text-sm text-slate-500">Activity / Tags</p>
              <p className="mt-2 text-3xl font-semibold">
                {activity.length} / {tags.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ClientDashboard
        clients={clients}
        tags={tags}
        apiBaseUrl={apiBaseUrl}
        isFallback={isFallback}
      />

      <QuickActions apiBaseUrl={apiBaseUrl} clients={clients} tags={tags} isFallback={isFallback} />

      <RecordEditor
        apiBaseUrl={apiBaseUrl}
        clients={clients}
        activity={activity}
        isFallback={isFallback}
        initialClientId={initialClientId}
        initialActivityId={initialActivityId}
      />

      <RecordManager
        apiBaseUrl={apiBaseUrl}
        clients={clients}
        activity={activity}
        tags={tags}
        clientTags={clientTags}
        isFallback={isFallback}
      />

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <ActivityDashboard clients={clients} activity={activity} />

        <aside className="rounded-[30px] border border-black/8 bg-slate-950 p-6 text-slate-50 shadow-[0_20px_60px_rgba(15,23,42,0.14)]">
          <h3 className="text-xl font-semibold">Tag Library</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Shared labels available across the client pipeline.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-white/12 px-3 py-2 text-sm font-medium"
                style={{ backgroundColor: `${tag.color}22`, color: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

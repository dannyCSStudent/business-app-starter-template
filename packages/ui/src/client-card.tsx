import type { Client } from "@repo/types";

type ClientCardClient = Pick<
  Client,
  "name" | "status" | "email" | "phone" | "last_contacted_at" | "tags"
>;

const statusClassName: Record<Client["status"], string> = {
  lead: "bg-amber-100 text-amber-900",
  active: "bg-emerald-100 text-emerald-900",
  completed: "bg-slate-200 text-slate-800",
};

export function ClientCard({ client }: { client: ClientCardClient }) {
  return (
    <article className="rounded-[28px] border border-black/8 bg-white/88 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{client.name}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {client.email ?? client.phone ?? "No contact details yet"}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClassName[client.status]}`}
        >
          {client.status}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <span>
          Last contact: {client.last_contacted_at ? new Date(client.last_contacted_at).toLocaleDateString() : "Not scheduled"}
        </span>
        {client.tags?.slice(0, 3).map((tag) => (
          <span
            key={tag.id}
            className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700"
          >
            {tag.name}
          </span>
        ))}
      </div>
    </article>
  );
}

"use client";

import type { Client, ClientActivity } from "@repo/types";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

type ActivityDashboardProps = {
  clients: Client[];
  activity: ClientActivity[];
};

type InteractionFilter = "all" | ClientActivity["interaction_type"];

const interactionOptions: InteractionFilter[] = [
  "all",
  "call",
  "email",
  "meeting",
  "note",
  "follow_up",
];

export function ActivityDashboard({
  clients,
  activity,
}: ActivityDashboardProps) {
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [interactionFilter, setInteractionFilter] =
    useState<InteractionFilter>("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredActivity = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return activity.filter((item) => {
      const matchesClient =
        clientFilter === "all" ? true : item.client_id === clientFilter;
      const matchesInteraction =
        interactionFilter === "all"
          ? true
          : item.interaction_type === interactionFilter;

      if (!matchesClient || !matchesInteraction) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const clientName =
        clients.find((client) => client.id === item.client_id)?.name ?? "";
      const haystack = `${clientName} ${item.notes ?? ""}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [activity, clientFilter, clients, deferredQuery, interactionFilter]);

  return (
    <div className="rounded-[30px] border border-black/8 bg-white/82 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-950">Activity Feed</h3>
          <p className="mt-1 text-sm text-slate-600">
            Filter by client, interaction type, or note text.
          </p>
        </div>
        <p className="text-sm text-slate-500">
          Showing {filteredActivity.length} of {activity.length} entries
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <select
          value={clientFilter}
          onChange={(event) => setClientFilter(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
        >
          <option value="all">All clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        <select
          value={interactionFilter}
          onChange={(event) =>
            setInteractionFilter(event.target.value as InteractionFilter)
          }
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
        >
          {interactionOptions.map((option) => (
            <option key={option} value={option}>
              {option === "all" ? "All interaction types" : option.replace("_", " ")}
            </option>
          ))}
        </select>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search activity notes"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="mt-5 space-y-4">
        {filteredActivity.map((item) => {
          const clientName =
            clients.find((client) => client.id === item.client_id)?.name ??
            "Unknown client";

          return (
            <article
              key={item.id}
              className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {item.interaction_type.replace("_", " ")}
                  </p>
                  <h4 className="mt-1 text-base font-semibold text-slate-950">
                    {clientName}
                  </h4>
                </div>
                <p className="text-sm text-slate-500">
                  {new Date(item.timestamp).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.notes ?? "No notes attached."}
              </p>
              <Link
                href={`/?editActivity=${encodeURIComponent(item.id)}#record-editor`}
                className="mt-4 inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Edit activity
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

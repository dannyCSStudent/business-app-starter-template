"use client";

import type {
  Client,
  ClientActivity,
  ClientTag,
  ClientTagAssignment,
  ClientStatus,
} from "@repo/types";
import { useState } from "react";
import { useDashboardAction } from "./use-dashboard-action";

const interactionOptions: ClientActivity["interaction_type"][] = [
  "call",
  "email",
  "meeting",
  "note",
  "follow_up",
];

const statusOptions: ClientStatus[] = ["lead", "active", "completed"];

export function QuickActions({
  apiBaseUrl,
  clients,
  tags,
  isFallback,
}: {
  apiBaseUrl: string;
  clients: Client[];
  tags: ClientTag[];
  isFallback: boolean;
}) {
  const { error, success, pendingKey, runAction } = useDashboardAction(apiBaseUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitJson(path: string, payload: object, successMessage: string) {
    setIsSubmitting(true);

    try {
      await runAction({
        path,
        method: "POST",
        body: payload,
        successMessage,
        defaultErrorMessage: "Unable to submit request.",
        pendingKey: `post:${path}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-10 rounded-[30px] border border-black/8 bg-[color:var(--color-surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-950">Quick Actions</h3>
          <p className="mt-1 text-sm text-slate-600">
            Post directly to the FastAPI endpoints and refresh the dashboard.
          </p>
        </div>
        {isFallback ? (
          <p className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900">
            API offline: submissions will fail until the backend is running.
          </p>
        ) : null}
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 xl:grid-cols-4">
        <form
          className="rounded-[24px] border border-slate-200 bg-white p-5"
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            await submitJson(
              "/clients/",
              {
                name: String(formData.get("name") ?? ""),
                email: String(formData.get("email") ?? "") || null,
                phone: String(formData.get("phone") ?? "") || null,
                status: String(formData.get("status") ?? "lead"),
                notes: String(formData.get("notes") ?? "") || null,
              },
              "Client created.",
            );

            event.currentTarget.reset();
          }}
        >
          <h4 className="text-lg font-semibold text-slate-950">Add Client</h4>
          <div className="mt-4 space-y-3">
            <input
              required
              name="name"
              placeholder="Client name"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400"
            />
            <input
              name="phone"
              placeholder="Phone"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400"
            />
            <select
              name="status"
              defaultValue="lead"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <textarea
              name="notes"
              rows={3}
              placeholder="Notes"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting || pendingKey === "post:/clients/" ? "Saving..." : "Create client"}
          </button>
        </form>

        <form
          className="rounded-[24px] border border-slate-200 bg-white p-5"
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            await submitJson(
              "/tags/",
              {
                name: String(formData.get("name") ?? ""),
                color: String(formData.get("color") ?? "#0f172a"),
              } satisfies Omit<ClientTag, "id">,
              "Tag created.",
            );

            event.currentTarget.reset();
          }}
        >
          <h4 className="text-lg font-semibold text-slate-950">Add Tag</h4>
          <div className="mt-4 space-y-3">
            <input
              required
              name="name"
              placeholder="Tag name"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400"
            />
            <input
              required
              name="color"
              type="color"
              defaultValue="#0f172a"
              className="h-12 w-full rounded-2xl border border-slate-200 px-2 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting || pendingKey === "post:/tags/" ? "Saving..." : "Create tag"}
          </button>
        </form>

        <form
          className="rounded-[24px] border border-slate-200 bg-white p-5"
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            await submitJson(
              "/activity/",
              {
                client_id: String(formData.get("client_id") ?? ""),
                interaction_type: String(formData.get("interaction_type") ?? "note"),
                notes: String(formData.get("notes") ?? "") || null,
              },
              "Activity logged.",
            );

            event.currentTarget.reset();
          }}
        >
          <h4 className="text-lg font-semibold text-slate-950">Log Activity</h4>
          <div className="mt-4 space-y-3">
            <select
              required
              name="client_id"
              defaultValue=""
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              <option value="" disabled>
                Select client
              </option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            <select
              name="interaction_type"
              defaultValue="note"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              {interactionOptions.map((option) => (
                <option key={option} value={option}>
                  {option.replace("_", " ")}
                </option>
              ))}
            </select>
            <textarea
              required
              name="notes"
              rows={4}
              placeholder="What happened?"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || clients.length === 0}
            className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting || pendingKey === "post:/activity/" ? "Saving..." : "Create activity"}
          </button>
        </form>

        <form
          className="rounded-[24px] border border-slate-200 bg-white p-5"
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            await submitJson(
              "/client-tags/",
              {
                client_id: String(formData.get("client_id") ?? ""),
                tag_id: String(formData.get("tag_id") ?? ""),
              } satisfies ClientTagAssignment,
              "Tag assigned to client.",
            );

            event.currentTarget.reset();
          }}
        >
          <h4 className="text-lg font-semibold text-slate-950">Assign Tag</h4>
          <div className="mt-4 space-y-3">
            <select
              required
              name="client_id"
              defaultValue=""
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              <option value="" disabled>
                Select client
              </option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            <select
              required
              name="tag_id"
              defaultValue=""
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              <option value="" disabled>
                Select tag
              </option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || clients.length === 0 || tags.length === 0}
            className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting || pendingKey === "post:/client-tags/" ? "Saving..." : "Assign tag"}
          </button>
        </form>
      </div>
    </section>
  );
}

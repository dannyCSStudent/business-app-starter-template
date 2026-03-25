"use client";

import type {
  Client,
  ClientActivity,
  ClientInteractionType,
  ClientStatus,
} from "@repo/types";
import { useState } from "react";
import { useDashboardAction } from "./use-dashboard-action";

const statusOptions: ClientStatus[] = ["lead", "active", "completed"];
const interactionOptions: ClientInteractionType[] = [
  "call",
  "email",
  "meeting",
  "note",
  "follow_up",
];

function toLocalDatetimeValue(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
}

export function RecordEditor({
  apiBaseUrl,
  clients,
  activity,
  isFallback,
  initialClientId,
  initialActivityId,
}: {
  apiBaseUrl: string;
  clients: Client[];
  activity: ClientActivity[];
  isFallback: boolean;
  initialClientId?: string;
  initialActivityId?: string;
}) {
  const { error, success, pendingKey, runAction } = useDashboardAction(apiBaseUrl);
  const defaultClient =
    clients.find((client) => client.id === initialClientId) ?? clients[0];
  const defaultActivity =
    activity.find((item) => item.id === initialActivityId) ?? activity[0];
  const [selectedClientId, setSelectedClientId] = useState<string>(defaultClient?.id ?? "");
  const [selectedActivityId, setSelectedActivityId] = useState<string>(defaultActivity?.id ?? "");
  const [clientStatus, setClientStatus] = useState<ClientStatus>(defaultClient?.status ?? "lead");
  const [clientEmail, setClientEmail] = useState(defaultClient?.email ?? "");
  const [clientPhone, setClientPhone] = useState(defaultClient?.phone ?? "");
  const [clientNotes, setClientNotes] = useState(defaultClient?.notes ?? "");
  const [clientLastContactedAt, setClientLastContactedAt] = useState(
    toLocalDatetimeValue(defaultClient?.last_contacted_at),
  );
  const [activityInteractionType, setActivityInteractionType] = useState<ClientInteractionType>(
    defaultActivity?.interaction_type ?? "note",
  );
  const [activityNotes, setActivityNotes] = useState(defaultActivity?.notes ?? "");
  const [activityTimestamp, setActivityTimestamp] = useState(
    toLocalDatetimeValue(defaultActivity?.timestamp),
  );

  async function patchJson(
    actionKey: string,
    path: string,
    payload: object,
    successMessage: string,
  ) {
    await runAction({
      path,
      method: "PATCH",
      body: payload,
      successMessage,
      defaultErrorMessage: "Update failed.",
      pendingKey: actionKey,
    });
  }

  return (
    <section
      id="record-editor"
      className="mt-10 rounded-[30px] border border-black/8 bg-[color:var(--color-surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-950">Edit Records</h3>
          <p className="mt-1 text-sm text-slate-600">
            Update status and notes without recreating records.
          </p>
        </div>
        {isFallback ? (
          <p className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900">
            API offline: update actions are disabled until the backend is running.
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

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <form
          className="rounded-[24px] border border-slate-200 bg-white p-5"
          onSubmit={async (event) => {
            event.preventDefault();
            await patchJson(
              `client:${selectedClientId}`,
              `/clients/${selectedClientId}`,
              {
                status: clientStatus,
                email: clientEmail || null,
                phone: clientPhone || null,
                notes: clientNotes || null,
                last_contacted_at: clientLastContactedAt
                  ? new Date(clientLastContactedAt).toISOString()
                  : null,
              },
              "Client updated.",
            );
          }}
        >
          <h4 className="text-lg font-semibold text-slate-950">Update Client</h4>
          <div className="mt-4 space-y-3">
            <select
              required
              name="client_id"
              value={selectedClientId}
              onChange={(event) => {
                const nextClient =
                  clients.find((client) => client.id === event.target.value) ?? clients[0];

                if (!nextClient) {
                  return;
                }

                setSelectedClientId(nextClient.id);
                setClientStatus(nextClient.status);
                setClientEmail(nextClient.email ?? "");
                setClientPhone(nextClient.phone ?? "");
                setClientNotes(nextClient.notes ?? "");
                setClientLastContactedAt(
                  toLocalDatetimeValue(nextClient.last_contacted_at),
                );
              }}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.status})
                </option>
              ))}
            </select>
            <select
              name="status"
              value={clientStatus}
              onChange={(event) => setClientStatus(event.target.value as ClientStatus)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <input
              name="email"
              type="email"
              value={clientEmail}
              onChange={(event) => setClientEmail(event.target.value)}
              placeholder="Email"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            <input
              name="phone"
              value={clientPhone}
              onChange={(event) => setClientPhone(event.target.value)}
              placeholder="Phone"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            <input
              name="last_contacted_at"
              type="datetime-local"
              value={clientLastContactedAt}
              onChange={(event) => setClientLastContactedAt(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
            />
            <textarea
              name="notes"
              rows={5}
              value={clientNotes}
              onChange={(event) => setClientNotes(event.target.value)}
              placeholder="Replace client notes"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={Boolean(isFallback || pendingKey) || clients.length === 0 || !selectedClientId}
            className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {pendingKey?.startsWith("client:") ? "Saving..." : "Update client"}
          </button>
        </form>

        <form
          className="rounded-[24px] border border-slate-200 bg-white p-5"
          onSubmit={async (event) => {
            event.preventDefault();
            await patchJson(
              `activity:${selectedActivityId}`,
              `/activity/${selectedActivityId}`,
              {
                interaction_type: activityInteractionType,
                notes: activityNotes || null,
                timestamp: activityTimestamp ? new Date(activityTimestamp).toISOString() : null,
              },
              "Activity updated.",
            );
          }}
        >
          <h4 className="text-lg font-semibold text-slate-950">Update Activity</h4>
          <div className="mt-4 space-y-3">
            <select
              required
              name="activity_id"
              value={selectedActivityId}
              onChange={(event) => {
                const nextActivity =
                  activity.find((item) => item.id === event.target.value) ?? activity[0];

                if (!nextActivity) {
                  return;
                }

                setSelectedActivityId(nextActivity.id);
                setActivityInteractionType(nextActivity.interaction_type);
                setActivityNotes(nextActivity.notes ?? "");
                setActivityTimestamp(toLocalDatetimeValue(nextActivity.timestamp));
              }}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              {activity.map((item) => {
                const clientName =
                  clients.find((client) => client.id === item.client_id)?.name ?? "Unknown client";

                return (
                  <option key={item.id} value={item.id}>
                    {clientName} - {item.interaction_type}
                  </option>
                );
              })}
            </select>
            <select
              name="interaction_type"
              value={activityInteractionType}
              onChange={(event) =>
                setActivityInteractionType(event.target.value as ClientInteractionType)
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
            >
              {interactionOptions.map((option) => (
                <option key={option} value={option}>
                  {option.replace("_", " ")}
                </option>
              ))}
            </select>
            <input
              name="timestamp"
              type="datetime-local"
              value={activityTimestamp}
              onChange={(event) => setActivityTimestamp(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none"
            />
            <textarea
              required
              name="notes"
              rows={5}
              value={activityNotes}
              onChange={(event) => setActivityNotes(event.target.value)}
              placeholder="Replace activity notes"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={
              Boolean(isFallback || pendingKey) || activity.length === 0 || !selectedActivityId
            }
            className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {pendingKey?.startsWith("activity:") ? "Saving..." : "Update activity"}
          </button>
        </form>
      </div>
    </section>
  );
}

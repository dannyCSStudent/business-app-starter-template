import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { BadgePill } from '@/components/crm/badge-pill';
import { ClientDetailForm } from '@/components/crm/client-detail-form';
import { ConnectionDiagnostics } from '@/components/crm/connection-diagnostics';
import { CRMHero } from '@/components/crm/crm-hero';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useCRMDataSyncRefresh } from '@/hooks/use-crm-sync-refresh';
import { useFallbackRefresh } from '@/hooks/use-fallback-refresh';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  apiBaseUrl,
  Client,
  ClientActivity,
  ClientInteractionType,
  ClientStatus,
  ClientTag,
  ClientTagAssignment,
  fallbackActivity,
  fallbackAssignments,
  fallbackClients,
  fallbackTags,
  fetchJson,
  isUuidLike,
  statusTone,
  toLocalDatetimeValue,
} from '@/lib/crm';
import { emitCRMDataChanged } from '@/lib/mobile-sync';
import { ActivityHistory } from '@/components/crm/activity-history';
import { TagManager } from '@/components/crm/tag-manager';
import { QuickActivityForm } from '@/components/crm/quick-activity-form';

function useClientDetail(clientId: string) {
  const [pendingContact, setPendingContact] = useState(false);
  const [pendingActivity, setPendingActivity] = useState(false);
  const [pendingUpdateActivityId, setPendingUpdateActivityId] = useState<string | null>(null);
  const [pendingDeleteActivityId, setPendingDeleteActivityId] = useState<string | null>(null);
  const [pendingTag, setPendingTag] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const fallbackData = useMemo(
    () => ({
      activity: fallbackActivity.filter((item) => item.client_id === clientId),
      assignments: fallbackAssignments,
      clients: fallbackClients,
      tags: fallbackTags,
    }),
    [clientId],
  );
  const loadDetail = useMemo(
    () => async () => {
      if (!isUuidLike(clientId)) {
        return fallbackData;
      }

      return {
        activity: await fetchJson<ClientActivity[]>(`/activity/client/${clientId}`),
        assignments: await fetchJson<ClientTagAssignment[]>('/client-tags/'),
        clients: await fetchJson<Client[]>('/clients/'),
        tags: await fetchJson<ClientTag[]>('/tags/'),
      };
    },
    [clientId, fallbackData],
  );
  const {
    data,
    error,
    isFallback,
    isRefreshing,
    refresh,
    setData,
    setError,
  } = useFallbackRefresh({
    autoLoad: true,
    errorMessage: 'Unable to refresh client detail. Showing fallback data.',
    fallbackData,
    load: loadDetail,
  });
  const { activity, assignments, clients, tags } = data;

  async function updateContact(payload: {
    email?: string | null;
    notes?: string | null;
    phone?: string | null;
    last_contacted_at?: string | null;
    status?: ClientStatus | null;
  }) {
    if (!clientId || isFallback) {
      return false;
    }

    setError(null);
    setSuccess(null);
    setPendingContact(true);

    const previousData = data;
    setData((current) => ({
      ...current,
      clients: current.clients.map((client) =>
        client.id === clientId
          ? {
              ...client,
              email: payload.email ?? undefined,
              notes: payload.notes ?? client.notes,
              phone: payload.phone ?? undefined,
              last_contacted_at: payload.last_contacted_at ?? undefined,
              status: payload.status ?? client.status,
            }
          : client,
      ),
    }));

    try {
      const response = await fetch(`${apiBaseUrl}/clients/${clientId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setSuccess('Client details updated.');
      return true;
    } catch {
      setData(previousData);
      setError('Unable to update client contact.');
      return false;
    } finally {
      setPendingContact(false);
    }
  }

  async function logActivity(interactionType: ClientInteractionType, notes: string) {
    if (!clientId || isFallback) {
      return false;
    }

    setError(null);
    setSuccess(null);
    setPendingActivity(true);

    const optimisticActivity: ClientActivity = {
      id: `local-${Date.now()}`,
      client_id: clientId,
      interaction_type: interactionType,
      notes,
      timestamp: new Date().toISOString(),
    };
    const previousData = data;
    setData((current) => ({
      ...current,
      activity: [optimisticActivity, ...current.activity],
    }));

    try {
      const response = await fetch(`${apiBaseUrl}/activity/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          interaction_type: interactionType,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setSuccess('Activity logged.');
      void refresh();
      return true;
    } catch {
      setData(previousData);
      setError('Unable to log activity.');
      return false;
    } finally {
      setPendingActivity(false);
    }
  }

  async function assignTag(tagId: string) {
    if (!clientId || isFallback) {
      return false;
    }

    setError(null);
    setSuccess(null);
    setPendingTag(true);

    const previousData = data;
    setData((current) => ({
      ...current,
      assignments: [...current.assignments, { client_id: clientId, tag_id: tagId }],
    }));

    try {
      const response = await fetch(`${apiBaseUrl}/client-tags/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          tag_id: tagId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setSuccess('Tag assigned.');
      emitCRMDataChanged();
      return true;
    } catch {
      setData(previousData);
      setError('Unable to assign tag.');
      return false;
    } finally {
      setPendingTag(false);
    }
  }

  async function removeTag(tagId: string) {
    if (!clientId || isFallback) {
      return false;
    }

    setError(null);
    setSuccess(null);
    setPendingTag(true);

    const previousData = data;
    setData((current) => ({
      ...current,
      assignments: current.assignments.filter(
        (assignment) => !(assignment.client_id === clientId && assignment.tag_id === tagId),
      ),
    }));

    try {
      const response = await fetch(
        `${apiBaseUrl}/client-tags/?client_id=${encodeURIComponent(clientId)}&tag_id=${encodeURIComponent(tagId)}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setSuccess('Tag removed.');
      emitCRMDataChanged();
      return true;
    } catch {
      setData(previousData);
      setError('Unable to remove tag.');
      return false;
    } finally {
      setPendingTag(false);
    }
  }

  async function deleteActivity(activityId: string) {
    if (!clientId || isFallback) {
      return false;
    }

    setError(null);
    setSuccess(null);
    setPendingDeleteActivityId(activityId);

    const previousData = data;
    setData((current) => ({
      ...current,
      activity: current.activity.filter((item) => item.id !== activityId),
    }));

    try {
      const response = await fetch(`${apiBaseUrl}/activity/${activityId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setSuccess('Activity deleted.');
      emitCRMDataChanged();
      return true;
    } catch {
      setData(previousData);
      setError('Unable to delete activity.');
      return false;
    } finally {
      setPendingDeleteActivityId(null);
    }
  }

  async function updateActivity(activityId: string, notes: string) {
    if (!clientId || isFallback) {
      return false;
    }

    setError(null);
    setSuccess(null);
    setPendingUpdateActivityId(activityId);

    const previousData = data;
    setData((current) => ({
      ...current,
      activity: current.activity.map((item) =>
        item.id === activityId ? { ...item, notes } : item,
      ),
    }));

    try {
      const response = await fetch(`${apiBaseUrl}/activity/${activityId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setSuccess('Activity updated.');
      emitCRMDataChanged();
      return true;
    } catch {
      setData(previousData);
      setError('Unable to update activity.');
      return false;
    } finally {
      setPendingUpdateActivityId(null);
    }
  }

  return {
    clients,
    tags,
    assignments,
    activity,
    isFallback,
    isRefreshing,
    pendingContact,
    pendingActivity,
    pendingUpdateActivityId,
    pendingDeleteActivityId,
    pendingTag,
    error,
    success,
    refresh,
    updateContact,
    logActivity,
    updateActivity,
    deleteActivity,
    assignTag,
    removeTag,
  };
}

export default function ClientDetailScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { id } = useLocalSearchParams<{ id: string }>();
  const clientId = Array.isArray(id) ? id[0] : id;
  const {
    clients,
    tags,
    assignments,
    activity,
    isFallback,
    isRefreshing,
    pendingContact,
    pendingActivity,
    pendingUpdateActivityId,
    pendingDeleteActivityId,
    pendingTag,
    error,
    success,
    refresh,
    updateContact,
    logActivity,
    updateActivity,
    deleteActivity,
    assignTag,
    removeTag,
  } = useClientDetail(clientId ?? '');
  useCRMDataSyncRefresh(refresh);

  const client = useMemo(
    () => clients.find((item) => item.id === clientId) ?? fallbackClients[0],
    [clientId, clients],
  );
  const clientTags = useMemo(() => {
    return assignments
      .filter((assignment) => assignment.client_id === client?.id)
      .map((assignment) => tags.find((tag) => tag.id === assignment.tag_id))
      .filter((tag): tag is ClientTag => Boolean(tag));
  }, [assignments, client?.id, tags]);
  const availableTags = useMemo(
    () => tags.filter((tag) => !clientTags.some((clientTag) => clientTag.id === tag.id)),
    [clientTags, tags],
  );
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [draftActivityNotesById, setDraftActivityNotesById] = useState<Record<string, string>>({});
  const [draftClientStatus, setDraftClientStatus] = useState<ClientStatus>(client?.status ?? 'lead');
  const [draftEmail, setDraftEmail] = useState(client?.email ?? '');
  const [draftClientNotes, setDraftClientNotes] = useState(client?.notes ?? '');
  const [draftPhone, setDraftPhone] = useState(client?.phone ?? '');
  const [draftLastContact, setDraftLastContact] = useState(
    toLocalDatetimeValue(client?.last_contacted_at),
  );

  const handleSaveClientDetails = () =>
    updateContact({
      email: draftEmail.trim() || null,
      notes: draftClientNotes.trim() || null,
      phone: draftPhone.trim() || null,
      last_contacted_at: draftLastContact
        ? new Date(draftLastContact).toISOString()
        : null,
      status: draftClientStatus,
    });

  useEffect(() => {
    setDraftClientStatus(client?.status ?? 'lead');
    setDraftEmail(client?.email ?? '');
    setDraftClientNotes(client?.notes ?? '');
    setDraftPhone(client?.phone ?? '');
    setDraftLastContact(toLocalDatetimeValue(client?.last_contacted_at));
  }, [client?.email, client?.last_contacted_at, client?.notes, client?.phone, client?.id, client?.status]);

  if (!client) {
    return null;
  }

  const tone = statusTone[client.status];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}>
      <CRMHero
        backgroundColor="#F4EFE7"
        badge={
          <View style={styles.heroMeta}>
            <View style={[styles.statusPill, { backgroundColor: tone.bg }]}>
              <ThemedText style={[styles.statusText, { color: tone.text }]}>
                {client.status}
              </ThemedText>
            </View>
            <BadgePill style={isFallback ? styles.badgeWarn : styles.badgeOk}>
              {isFallback ? 'Fallback' : 'Live'}
            </BadgePill>
          </View>
        }
        copy="Detail workflow for client follow-up, contact maintenance, and activity history."
        title={client.name}
      />

      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
      {success ? <ThemedText style={styles.successText}>{success}</ThemedText> : null}
      <ConnectionDiagnostics
        apiBaseUrl={apiBaseUrl}
        isFallback={isFallback}
        label={isUuidLike(client.id) ? 'Client Detail' : 'Client Detail Sample'}
      />

      <ClientDetailForm
        client={client}
        colorScheme={colorScheme}
        colors={colors}
        draftStatus={draftClientStatus}
        setDraftStatus={setDraftClientStatus}
        draftEmail={draftEmail}
        setDraftEmail={setDraftEmail}
        draftPhone={draftPhone}
        setDraftPhone={setDraftPhone}
        draftLastContact={draftLastContact}
        setDraftLastContact={setDraftLastContact}
        draftNotes={draftClientNotes}
        setDraftNotes={setDraftClientNotes}
        isFallback={isFallback}
        pendingContact={pendingContact}
        onSave={handleSaveClientDetails}
      />

      <TagManager
        assignedTags={clientTags}
        availableTags={availableTags}
        isFallback={isFallback}
        pending={pendingTag}
        onAssignTag={assignTag}
        onRemoveTag={removeTag}
      />

      <QuickActivityForm
        onSubmit={({ interactionType, notes }) => logActivity(interactionType, notes)}
        isFallback={isFallback}
        isPending={pendingActivity}
      />

      <ActivityHistory
        activity={activity}
        isFallback={isFallback}
        pendingDeleteActivityId={pendingDeleteActivityId}
        pendingUpdateActivityId={pendingUpdateActivityId}
        editingActivityId={editingActivityId}
        setEditingActivityId={setEditingActivityId}
        draftActivityNotesById={draftActivityNotesById}
        setDraftActivityNotesById={setDraftActivityNotesById}
        updateActivity={updateActivity}
        deleteActivity={deleteActivity}
        colors={colors}
        colorScheme={colorScheme}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 16,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  badgeWarn: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  badgeOk: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },
  errorText: {
    fontSize: 13,
    color: '#B91C1C',
  },
  successText: {
    fontSize: 13,
    color: '#166534',
  },
  section: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    backgroundColor: 'rgba(255,255,255,0.88)',
    gap: 12,
  },
  detailText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  actionChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textTransform: 'capitalize',
  },
  quickActionSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  quickActionSelectedText: {
    color: '#1D4ED8',
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  primaryButton: {
    borderRadius: 16,
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  activityInput: {
    minHeight: 92,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  activityList: {
    gap: 12,
  },
  activityEditor: {
    gap: 10,
  },
  activityEditorActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  activityCard: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: 'rgba(248,250,252,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.2)',
    gap: 8,
  },
  activityCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  activityMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  activityType: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    textTransform: 'uppercase',
  },
  activityDate: {
    fontSize: 12,
    color: '#64748B',
  },
  deleteLink: {
    alignSelf: 'flex-end',
  },
  deleteLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B91C1C',
    textTransform: 'uppercase',
  },
  editLink: {
    alignSelf: 'flex-start',
  },
  editLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'uppercase',
  },
  activityEditInput: {
    minHeight: 80,
  },
  secondaryInlineButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  secondaryInlineButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
  },
  primaryInlineButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0F172A',
  },
  primaryInlineButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
    textTransform: 'uppercase',
  },
});

import { Link, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { BadgePill } from '@/components/crm/badge-pill';
import { CRMHero } from '@/components/crm/crm-hero';
import { FilterChip } from '@/components/crm/filter-chip';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useFallbackRefresh } from '@/hooks/use-fallback-refresh';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  apiBaseUrl,
  Client,
  ClientInteractionType,
  ClientStatus,
  ClientTag,
  ClientTagAssignment,
  fallbackClients,
  fallbackAssignments,
  fallbackTags,
  fetchJson,
  interactionOptions,
} from '@/lib/crm';
import { emitCRMDataChanged } from '@/lib/mobile-sync';

function useClientOptions() {
  const loadClients = useCallback(() => fetchJson<Client[]>('/clients/'), []);
  const { data, error, isFallback, isRefreshing, refresh } = useFallbackRefresh({
    autoLoad: true,
    errorMessage: 'Unable to refresh clients. Showing fallback data.',
    fallbackData: fallbackClients,
    load: loadClients,
  });

  return {
    clients: data,
    error,
    isFallback,
    isRefreshing,
    refresh,
  };
}

function useTagOptions() {
  const fallbackData = useMemo(
    () => ({
      assignments: fallbackAssignments,
      tags: fallbackTags,
    }),
    [],
  );
  const loadTags = useCallback(
    async () => ({
      assignments: await fetchJson<ClientTagAssignment[]>('/client-tags/'),
      tags: await fetchJson<ClientTag[]>('/tags/'),
    }),
    [],
  );
  const { data, error, isFallback, refresh } = useFallbackRefresh({
    autoLoad: true,
    errorMessage: 'Unable to refresh tags. Showing fallback tag data.',
    fallbackData,
    load: loadTags,
  });

  return {
    assignments: data.assignments,
    error,
    isFallback,
    refresh,
    tags: data.tags,
  };
}

export default function ModalScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { clients, error: clientsError, isFallback, isRefreshing, refresh } = useClientOptions();
  const {
    assignments,
    error: tagsError,
    isFallback: tagsFallback,
    refresh: refreshTags,
    tags,
  } = useTagOptions();
  const [mode, setMode] = useState<'client' | 'activity' | 'tag'>('client');
  const [status, setStatus] = useState<ClientStatus>('lead');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>(fallbackClients[0]?.id ?? '');
  const [interactionType, setInteractionType] = useState<ClientInteractionType>('note');
  const [activityNotes, setActivityNotes] = useState('');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#0ea5e9');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedClientName = useMemo(
    () => clients.find((client) => client.id === selectedClientId)?.name ?? 'Select a client',
    [clients, selectedClientId],
  );
  const assignedTagIds = useMemo(
    () =>
      new Set(
        assignments
          .filter((assignment) => assignment.client_id === selectedClientId)
          .map((assignment) => assignment.tag_id),
      ),
    [assignments, selectedClientId],
  );
  const availableTags = useMemo(
    () => tags.filter((tag) => !assignedTagIds.has(tag.id)),
    [assignedTagIds, tags],
  );

  async function createClient() {
    if (!name.trim()) {
      setError('Client name is required.');
      return;
    }

    setPending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${apiBaseUrl}/clients/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          notes: notes.trim() || null,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setSuccess('Client created.');
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
      setStatus('lead');
      await refresh();
      emitCRMDataChanged();
    } catch {
      setError('Unable to create client.');
    } finally {
      setPending(false);
    }
  }

  async function createActivity() {
    if (!selectedClientId) {
      setError('Choose a client first.');
      return;
    }

    if (!activityNotes.trim()) {
      setError('Activity notes are required.');
      return;
    }

    setPending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${apiBaseUrl}/activity/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: selectedClientId,
          interaction_type: interactionType,
          notes: activityNotes.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setSuccess('Activity logged.');
      setActivityNotes('');
      setInteractionType('note');
      emitCRMDataChanged();
    } catch {
      setError('Unable to log activity.');
    } finally {
      setPending(false);
    }
  }

  async function assignTag(tagId: string) {
    if (!selectedClientId) {
      setError('Choose a client first.');
      return;
    }

    setPending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${apiBaseUrl}/client-tags/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: selectedClientId,
          tag_id: tagId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setSuccess('Tag assigned.');
      await refreshTags();
      emitCRMDataChanged();
    } catch {
      setError('Unable to assign tag.');
    } finally {
      setPending(false);
    }
  }

  async function removeTag(tagId: string) {
    if (!selectedClientId) {
      setError('Choose a client first.');
      return;
    }

    setPending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${apiBaseUrl}/client-tags/?client_id=${encodeURIComponent(selectedClientId)}&tag_id=${encodeURIComponent(tagId)}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setSuccess('Tag removed.');
      await refreshTags();
      emitCRMDataChanged();
    } catch {
      setError('Unable to remove tag.');
    } finally {
      setPending(false);
    }
  }

  async function createTag() {
    if (!tagName.trim()) {
      setError('Tag name is required.');
      return;
    }

    setPending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${apiBaseUrl}/tags/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: tagName.trim(),
          color: tagColor.trim() || '#0ea5e9',
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const created = (await response.json()) as ClientTag[];
      const createdTagId = created[0]?.id;

      if (createdTagId && selectedClientId) {
        const assignmentResponse = await fetch(`${apiBaseUrl}/client-tags/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: selectedClientId,
            tag_id: createdTagId,
          }),
        });

        if (!assignmentResponse.ok) {
          throw new Error(`API returned ${assignmentResponse.status}`);
        }
      }

      setSuccess(selectedClientId ? 'Tag created and assigned.' : 'Tag created.');
      setTagName('');
      setTagColor('#0ea5e9');
      await refreshTags();
      emitCRMDataChanged();
    } catch {
      setError('Unable to create tag.');
    } finally {
      setPending(false);
    }
  }

  async function updateTag() {
    if (!editingTagId) {
      return;
    }

    if (!tagName.trim()) {
      setError('Tag name is required.');
      return;
    }

    setPending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${apiBaseUrl}/tags/${editingTagId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          color: tagColor.trim() || '#0ea5e9',
          name: tagName.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setSuccess('Tag updated.');
      setEditingTagId(null);
      setTagName('');
      setTagColor('#0ea5e9');
      await refreshTags();
      emitCRMDataChanged();
    } catch {
      setError('Unable to update tag.');
    } finally {
      setPending(false);
    }
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}>
      <CRMHero
        backgroundColor="#F4EFE7"
        badge={
          <View style={styles.heroMeta}>
            <BadgePill style={isFallback ? styles.badgeWarn : styles.badgeOk}>
              {isFallback ? 'Fallback clients' : 'Live clients'}
            </BadgePill>
            <Link href="/" dismissTo style={styles.closeLink}>
              <ThemedText style={styles.closeLinkText}>Close</ThemedText>
            </Link>
          </View>
        }
        copy="Create a client or log follow-up work without drilling into an existing record first."
        title="Quick Actions"
      />

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Mode</ThemedText>
        <View style={styles.chipRow}>
          <FilterChip
            label="Create Client"
            onPress={() => {
              setMode('client');
              setError(null);
              setSuccess(null);
            }}
            selected={mode === 'client'}
          />
          <FilterChip
            label="Log Activity"
            onPress={() => {
              setMode('activity');
              setError(null);
              setSuccess(null);
            }}
            selected={mode === 'activity'}
          />
          <FilterChip
            label="Tags"
            onPress={() => {
              setMode('tag');
              setError(null);
              setEditingTagId(null);
              setSuccess(null);
            }}
            selected={mode === 'tag'}
          />
        </View>
      </ThemedView>

      {clientsError ? <ThemedText style={styles.errorText}>{clientsError}</ThemedText> : null}
      {tagsError ? <ThemedText style={styles.errorText}>{tagsError}</ThemedText> : null}
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
      {success ? <ThemedText style={styles.successText}>{success}</ThemedText> : null}

      {mode === 'client' ? (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">New Client</ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Client name"
            placeholderTextColor="#94A3B8"
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colorScheme === 'dark' ? '#334155' : '#CBD5E1',
                backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
              },
            ]}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#94A3B8"
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colorScheme === 'dark' ? '#334155' : '#CBD5E1',
                backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
              },
            ]}
          />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone"
            placeholderTextColor="#94A3B8"
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colorScheme === 'dark' ? '#334155' : '#CBD5E1',
                backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
              },
            ]}
          />
          <View style={styles.chipRow}>
            {(['lead', 'active', 'completed'] as ClientStatus[]).map((option) => (
              <FilterChip
                key={option}
                label={option}
                onPress={() => setStatus(option)}
                selected={status === option}
              />
            ))}
          </View>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes"
            placeholderTextColor="#94A3B8"
            multiline
            style={[
              styles.textarea,
              {
                color: colors.text,
                borderColor: colorScheme === 'dark' ? '#334155' : '#CBD5E1',
                backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
              },
            ]}
          />
          <Pressable disabled={pending} onPress={() => void createClient()} style={styles.primaryButton}>
            <ThemedText style={styles.primaryButtonText}>
              {pending ? 'Creating...' : 'Create client'}
            </ThemedText>
          </Pressable>
        </ThemedView>
      ) : mode === 'activity' ? (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Log Activity</ThemedText>
          <ThemedText style={styles.helperText}>Selected client: {selectedClientName}</ThemedText>
          <View style={styles.chipRow}>
            {clients.map((client) => (
              <FilterChip
                key={client.id}
                label={client.name}
                onPress={() => setSelectedClientId(client.id)}
                selected={selectedClientId === client.id}
                style={styles.wideChip}
              />
            ))}
          </View>
          <View style={styles.chipRow}>
            {interactionOptions.map((option) => (
              <FilterChip
                key={option}
                label={option.replace('_', ' ')}
                onPress={() => setInteractionType(option)}
                selected={interactionType === option}
              />
            ))}
          </View>
          <TextInput
            value={activityNotes}
            onChangeText={setActivityNotes}
            placeholder="What happened?"
            placeholderTextColor="#94A3B8"
            multiline
            style={[
              styles.textarea,
              {
                color: colors.text,
                borderColor: colorScheme === 'dark' ? '#334155' : '#CBD5E1',
                backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
              },
            ]}
          />
          <Pressable disabled={pending || isRefreshing} onPress={() => void createActivity()} style={styles.primaryButton}>
            <ThemedText style={styles.primaryButtonText}>
              {pending ? 'Logging...' : 'Log activity'}
            </ThemedText>
          </Pressable>
        </ThemedView>
      ) : (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Tags</ThemedText>
          <ThemedText style={styles.helperText}>
            Assigning to: {selectedClientName} {tagsFallback ? '(fallback tag data)' : ''}
          </ThemedText>
          <View style={styles.chipRow}>
            {clients.map((client) => (
              <FilterChip
                key={client.id}
                label={client.name}
                onPress={() => setSelectedClientId(client.id)}
                selected={selectedClientId === client.id}
                style={styles.wideChip}
              />
            ))}
          </View>
          <TextInput
            value={tagName}
            onChangeText={setTagName}
            placeholder="Tag name"
            placeholderTextColor="#94A3B8"
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colorScheme === 'dark' ? '#334155' : '#CBD5E1',
                backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
              },
            ]}
          />
          <TextInput
            value={tagColor}
            onChangeText={setTagColor}
            placeholder="#0ea5e9"
            placeholderTextColor="#94A3B8"
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colorScheme === 'dark' ? '#334155' : '#CBD5E1',
                backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
              },
            ]}
          />
          <Pressable
            disabled={pending}
            onPress={() => void (editingTagId ? updateTag() : createTag())}
            style={styles.primaryButton}>
            <ThemedText style={styles.primaryButtonText}>
              {pending ? (editingTagId ? 'Saving...' : 'Creating...') : editingTagId ? 'Update tag' : 'Create tag and assign'}
            </ThemedText>
          </Pressable>
          {editingTagId ? (
            <Pressable
              disabled={pending}
              onPress={() => {
                setEditingTagId(null);
                setTagName('');
                setTagColor('#0ea5e9');
              }}
              style={styles.secondaryButton}>
              <ThemedText style={styles.secondaryButtonText}>Cancel tag edit</ThemedText>
            </Pressable>
          ) : null}
          <ThemedText style={styles.helperText}>Edit existing tags</ThemedText>
          <View style={styles.chipRow}>
            {tags.length ? (
              tags.map((tag) => (
                <FilterChip
                  key={tag.id}
                  label={`Edit ${tag.name}`}
                  onPress={() => {
                    setEditingTagId(tag.id);
                    setTagName(tag.name);
                    setTagColor(tag.color);
                    setError(null);
                    setSuccess(null);
                  }}
                  selected={editingTagId === tag.id}
                  style={styles.wideChip}
                />
              ))
            ) : (
              <ThemedText style={styles.helperText}>No tags available yet.</ThemedText>
            )}
          </View>
          <ThemedText style={styles.helperText}>Assigned tags for this client</ThemedText>
          <View style={styles.chipRow}>
            {tags.filter((tag) => assignedTagIds.has(tag.id)).length ? (
              tags
                .filter((tag) => assignedTagIds.has(tag.id))
                .map((tag) => (
                  <FilterChip
                    key={tag.id}
                    label={`${tag.name} x`}
                    onPress={() => void removeTag(tag.id)}
                    selected={true}
                    style={styles.wideChip}
                  />
                ))
            ) : (
              <ThemedText style={styles.helperText}>No tags assigned yet.</ThemedText>
            )}
          </View>
          <ThemedText style={styles.helperText}>Available tags for this client</ThemedText>
          <View style={styles.chipRow}>
            {availableTags.length ? (
              availableTags.map((tag) => (
                <FilterChip
                  key={tag.id}
                  label={tag.name}
                  onPress={() => void assignTag(tag.id)}
                  selected={false}
                  style={[styles.wideChip, { borderColor: `${tag.color}66` }]}
                />
              ))
            ) : (
              <ThemedText style={styles.helperText}>All current tags are already assigned.</ThemedText>
            )}
          </View>
        </ThemedView>
      )}

      <Pressable onPress={() => router.back()} style={styles.secondaryButton}>
        <ThemedText style={styles.secondaryButtonText}>Done</ThemedText>
      </Pressable>
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
  closeLink: {
    alignSelf: 'flex-start',
  },
  closeLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
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
  section: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    backgroundColor: 'rgba(255,255,255,0.88)',
    gap: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wideChip: {
    maxWidth: '100%',
  },
  helperText: {
    fontSize: 13,
    color: '#64748B',
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  textarea: {
    minHeight: 96,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    textAlignVertical: 'top',
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
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 13,
    color: '#B91C1C',
  },
  successText: {
    fontSize: 13,
    color: '#166534',
  },
});

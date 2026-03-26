import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { BadgePill } from '@/components/crm/badge-pill';
import { CRMHero } from '@/components/crm/crm-hero';
import { FilterChip } from '@/components/crm/filter-chip';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useClientOptions, useTagOptions } from '@/hooks/use-mobile-crm-options';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiBaseUrl, ClientTag } from '@/lib/crm';
import { emitCRMDataChanged } from '@/lib/mobile-sync';

export default function ManageTagsActionScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { clients, error: clientsError } = useClientOptions();
  const { assignments, error: tagsError, isFallback, refresh, tags } = useTagOptions();
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id ?? '');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#0ea5e9');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedClientId && clients[0]?.id) {
      setSelectedClientId(clients[0].id);
    }
  }, [clients, selectedClientId]);

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
  const assignedTags = useMemo(
    () => tags.filter((tag) => assignedTagIds.has(tag.id)),
    [assignedTagIds, tags],
  );

  function resetEditor() {
    setEditingTagId(null);
    setTagName('');
    setTagColor('#0ea5e9');
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
      await refresh();
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
      await refresh();
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
          color: tagColor.trim() || '#0ea5e9',
          name: tagName.trim(),
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
      resetEditor();
      await refresh();
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
      resetEditor();
      await refresh();
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
        backgroundColor="#F2E8FF"
        badge={
          <View style={styles.heroMeta}>
            <BadgePill style={isFallback ? styles.badgeWarn : styles.badgeOk}>
              {isFallback ? 'Fallback tags' : 'Live tags'}
            </BadgePill>
            <Link href="/modal" dismissTo style={styles.closeLink}>
              <ThemedText style={styles.closeLinkText}>Back to hub</ThemedText>
            </Link>
          </View>
        }
        copy="Keep tag creation, editing, and assignment in one focused mobile workspace."
        title="Manage Tags"
      />

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Client Context</ThemedText>
        <ThemedText style={styles.helperText}>Selected client: {selectedClientName}</ThemedText>
        <View style={styles.chipRow}>
          {clients.map((client) => (
            <FilterChip
              key={client.id}
              label={client.name}
              onPress={() => setSelectedClientId(client.id)}
              selected={selectedClientId === client.id}
            />
          ))}
        </View>
      </ThemedView>

      {clientsError ? <ThemedText style={styles.errorText}>{clientsError}</ThemedText> : null}
      {tagsError ? <ThemedText style={styles.errorText}>{tagsError}</ThemedText> : null}
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
      {success ? <ThemedText style={styles.successText}>{success}</ThemedText> : null}

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">{editingTagId ? 'Edit Tag' : 'Create Tag'}</ThemedText>
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
          autoCapitalize="none"
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: colorScheme === 'dark' ? '#334155' : '#CBD5E1',
              backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
            },
          ]}
        />
        <View style={styles.buttonRow}>
          <Pressable
            disabled={pending}
            onPress={() => void (editingTagId ? updateTag() : createTag())}
            style={styles.primaryButton}>
            <ThemedText style={styles.primaryButtonText}>
              {pending ? 'Saving...' : editingTagId ? 'Update tag' : 'Create tag'}
            </ThemedText>
          </Pressable>
          {editingTagId ? (
            <Pressable disabled={pending} onPress={resetEditor} style={styles.secondaryButton}>
              <ThemedText style={styles.secondaryButtonText}>Cancel edit</ThemedText>
            </Pressable>
          ) : null}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Assign Existing Tags</ThemedText>
        <View style={styles.chipRow}>
          {availableTags.length ? (
            availableTags.map((tag) => (
              <FilterChip
                key={tag.id}
                label={tag.name}
                onPress={() => void assignTag(tag.id)}
                selected={false}
              />
            ))
          ) : (
            <ThemedText style={styles.helperText}>All tags already assigned.</ThemedText>
          )}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Assigned Tags</ThemedText>
        <View style={styles.chipRow}>
          {assignedTags.length ? (
            assignedTags.map((tag) => (
              <View key={tag.id} style={styles.tagActionRow}>
                <Pressable
                  disabled={pending}
                  onPress={() => {
                    setEditingTagId(tag.id);
                    setTagName(tag.name);
                    setTagColor(tag.color);
                  }}
                  style={[styles.tagActionButton, styles.secondaryButton]}>
                  <ThemedText style={styles.secondaryButtonText}>Edit {tag.name}</ThemedText>
                </Pressable>
                <Pressable
                  disabled={pending}
                  onPress={() => void removeTag(tag.id)}
                  style={[styles.tagActionButton, styles.dangerButton]}>
                  <ThemedText style={styles.dangerButtonText}>Remove</ThemedText>
                </Pressable>
              </View>
            ))
          ) : (
            <ThemedText style={styles.helperText}>No tags assigned yet.</ThemedText>
          )}
        </View>
      </ThemedView>
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
    gap: 8,
  },
  badgeWarn: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  badgeOk: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },
  closeLink: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  closeLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    textTransform: 'uppercase',
  },
  section: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    backgroundColor: 'rgba(255,255,255,0.88)',
    gap: 12,
  },
  helperText: {
    fontSize: 13,
    color: '#64748B',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  primaryButton: {
    borderRadius: 999,
    backgroundColor: '#0F172A',
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  primaryButtonText: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#334155',
    fontWeight: '700',
  },
  dangerButton: {
    borderRadius: 999,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  dangerButtonText: {
    color: '#B91C1C',
    fontWeight: '700',
  },
  tagActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagActionButton: {
    alignSelf: 'flex-start',
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

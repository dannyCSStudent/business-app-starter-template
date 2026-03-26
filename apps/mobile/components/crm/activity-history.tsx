import { Dispatch, SetStateAction } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { ClientActivity } from '@/lib/crm';

type ActivityHistoryProps = {
  activity: ClientActivity[];
  isFallback: boolean;
  pendingDeleteActivityId: string | null;
  pendingUpdateActivityId: string | null;
  editingActivityId: string | null;
  draftActivityNotesById: Record<string, string>;
  setDraftActivityNotesById: Dispatch<SetStateAction<Record<string, string>>>;
  setEditingActivityId: Dispatch<SetStateAction<string | null>>;
  updateActivity: (activityId: string, notes: string) => Promise<boolean>;
  deleteActivity: (activityId: string) => Promise<boolean>;
  colors: Colors;
  colorScheme: 'dark' | 'light';
};

export function ActivityHistory({
  activity,
  isFallback,
  pendingDeleteActivityId,
  pendingUpdateActivityId,
  editingActivityId,
  draftActivityNotesById,
  setDraftActivityNotesById,
  setEditingActivityId,
  updateActivity,
  deleteActivity,
  colors,
  colorScheme,
}: ActivityHistoryProps) {
  return (
    <ThemedView style={styles.section}>
      <ThemedText type="subtitle">Activity</ThemedText>
      <View style={styles.activityList}>
        {activity.length ? (
          activity.map((item) => (
            <View key={item.id} style={styles.activityCard}>
              <View style={styles.activityCardHeader}>
                <ThemedText style={styles.activityType}>
                  {item.interaction_type.replace('_', ' ')}
                </ThemedText>
                <View style={styles.activityMeta}>
                  <ThemedText style={styles.activityDate}>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </ThemedText>
                  <Pressable
                    onPress={() => void deleteActivity(item.id)}
                    disabled={
                      isFallback ||
                      pendingDeleteActivityId !== null ||
                      pendingUpdateActivityId !== null
                    }
                    style={styles.deleteLink}>
                    <ThemedText style={styles.deleteLinkText}>
                      {pendingDeleteActivityId === item.id ? 'Deleting...' : 'Delete'}
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
              {editingActivityId === item.id ? (
                <View style={styles.activityEditor}>
                  <TextInput
                    value={draftActivityNotesById[item.id] ?? item.notes ?? ''}
                    onChangeText={(text) =>
                      setDraftActivityNotesById((current) => ({
                        ...current,
                        [item.id]: text,
                      }))
                    }
                    placeholder="Update activity notes"
                    placeholderTextColor="#94A3B8"
                    editable={!isFallback && pendingUpdateActivityId === null}
                    multiline
                    style={[
                      styles.activityInput,
                      styles.activityEditInput,
                      {
                        color: colors.text,
                        borderColor: colorScheme === 'dark' ? '#334155' : '#CBD5E1',
                        backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
                      },
                    ]}
                  />
                  <View style={styles.activityEditorActions}>
                    <Pressable
                      onPress={() => {
                        setEditingActivityId(null);
                        setDraftActivityNotesById((current) => {
                          const next = { ...current };
                          delete next[item.id];
                          return next;
                        });
                      }}
                      disabled={pendingUpdateActivityId !== null}
                      style={styles.secondaryInlineButton}>
                      <ThemedText style={styles.secondaryInlineButtonText}>Cancel</ThemedText>
                    </Pressable>
                    <Pressable
                      onPress={async () => {
                        const didUpdate = await updateActivity(
                          item.id,
                          (draftActivityNotesById[item.id] ?? item.notes ?? '').trim(),
                        );

                        if (didUpdate) {
                          setEditingActivityId(null);
                        }
                      }}
                      disabled={isFallback || pendingUpdateActivityId !== null}
                      style={styles.primaryInlineButton}>
                      <ThemedText style={styles.primaryInlineButtonText}>
                        {pendingUpdateActivityId === item.id ? 'Saving...' : 'Save'}
                      </ThemedText>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <>
                  <ThemedText style={styles.detailText}>
                    {item.notes ?? 'No notes attached.'}
                  </ThemedText>
                  <Pressable
                    onPress={() => {
                      setEditingActivityId(item.id);
                      setDraftActivityNotesById((current) => ({
                        ...current,
                        [item.id]: item.notes ?? '',
                      }));
                    }}
                    disabled={isFallback || pendingDeleteActivityId !== null}
                    style={styles.editLink}>
                    <ThemedText style={styles.editLinkText}>Edit notes</ThemedText>
                  </Pressable>
                </>
              )}
            </View>
          ))
        ) : (
          <ThemedText style={styles.detailMuted}>No activity logged yet.</ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    backgroundColor: 'rgba(255,255,255,0.88)',
    gap: 12,
  },
  activityList: {
    gap: 12,
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
  detailText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
  },
  detailMuted: {
    fontSize: 13,
    color: '#64748B',
  },
  activityEditor: {
    gap: 10,
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
  activityEditInput: {
    minHeight: 80,
  },
  activityEditorActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
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
  editLink: {
    alignSelf: 'flex-start',
  },
  editLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'uppercase',
  },
});

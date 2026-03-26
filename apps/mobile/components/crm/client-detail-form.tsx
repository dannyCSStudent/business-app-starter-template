import { Dispatch, SetStateAction } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { Client, ClientStatus, statusTone } from '@/lib/crm';

type ClientDetailFormProps = {
  client: Client;
  colorScheme: 'dark' | 'light';
  colors: Colors;
  draftStatus: ClientStatus;
  setDraftStatus: Dispatch<SetStateAction<ClientStatus>>;
  draftEmail: string;
  setDraftEmail: Dispatch<SetStateAction<string>>;
  draftPhone: string;
  setDraftPhone: Dispatch<SetStateAction<string>>;
  draftLastContact: string;
  setDraftLastContact: Dispatch<SetStateAction<string>>;
  draftNotes: string;
  setDraftNotes: Dispatch<SetStateAction<string>>;
  isFallback: boolean;
  pendingContact: boolean;
  onSave: () => Promise<void>;
};

export function ClientDetailForm({
  client,
  colorScheme,
  colors,
  draftStatus,
  setDraftStatus,
  draftEmail,
  setDraftEmail,
  draftPhone,
  setDraftPhone,
  draftLastContact,
  setDraftLastContact,
  draftNotes,
  setDraftNotes,
  isFallback,
  pendingContact,
  onSave,
}: ClientDetailFormProps) {
  return (
    <ThemedView style={styles.section}>
      <ThemedText type="subtitle">Client Details</ThemedText>
      <ThemedText style={styles.detailMuted}>
        Update pipeline status, contact details, and notes in one form.
      </ThemedText>
      <View style={styles.chipRow}>
        {(['lead', 'active', 'completed'] as ClientStatus[]).map((status) => {
          const isSelected = draftStatus === status;
          const statusColors = statusTone[status];

          return (
            <Pressable
              key={status}
              onPress={() => setDraftStatus(status)}
              disabled={isFallback || pendingContact}
              style={[
                styles.actionChip,
                isSelected && {
                  backgroundColor: statusColors.bg,
                  borderColor: statusColors.text,
                },
              ]}>
              <ThemedText
                style={[styles.actionChipText, isSelected && { color: statusColors.text }]}>
                {status}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
      <TextInput
        value={draftEmail}
        onChangeText={setDraftEmail}
        placeholder="Email"
        placeholderTextColor="#94A3B8"
        editable={!isFallback && !pendingContact}
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
        value={draftPhone}
        onChangeText={setDraftPhone}
        placeholder="Phone"
        placeholderTextColor="#94A3B8"
        editable={!isFallback && !pendingContact}
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
        value={draftLastContact}
        onChangeText={setDraftLastContact}
        placeholder="YYYY-MM-DDTHH:MM"
        placeholderTextColor="#94A3B8"
        editable={!isFallback && !pendingContact}
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
        value={draftNotes}
        onChangeText={setDraftNotes}
        placeholder="Add notes about this client"
        placeholderTextColor="#94A3B8"
        editable={!isFallback && !pendingContact}
        multiline
        style={[
          styles.activityInput,
          styles.notesInput,
          {
            color: colors.text,
            borderColor: colorScheme === 'dark' ? '#334155' : '#CBD5E1',
            backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
          },
        ]}
      />
      <Pressable
        onPress={() => {
          void onSave();
        }}
        disabled={isFallback || pendingContact}
        style={styles.primaryButton}>
        <ThemedText style={styles.primaryButtonText}>
          {pendingContact ? 'Saving...' : 'Save client details'}
        </ThemedText>
      </Pressable>
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
  detailMuted: {
    fontSize: 13,
    color: '#64748B',
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
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  activityInput: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 15,
  },
  notesInput: {
    minHeight: 160,
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
});

import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { BadgePill } from '@/components/crm/badge-pill';
import { CRMHero } from '@/components/crm/crm-hero';
import { FilterChip } from '@/components/crm/filter-chip';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useClientOptions } from '@/hooks/use-mobile-crm-options';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiBaseUrl, ClientStatus } from '@/lib/crm';
import { emitCRMDataChanged } from '@/lib/mobile-sync';

export default function CreateClientActionScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { clients, error: clientsError, isFallback } = useClientOptions();
  const [status, setStatus] = useState<ClientStatus>('lead');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
          notes: notes.trim() || null,
          phone: phone.trim() || null,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setSuccess('Client created.');
      emitCRMDataChanged();
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
      setStatus('lead');
    } catch {
      setError('Unable to create client.');
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
            <Link href="/modal" dismissTo style={styles.closeLink}>
              <ThemedText style={styles.closeLinkText}>Back to hub</ThemedText>
            </Link>
          </View>
        }
        copy="Create a new client without mixing this workflow with activity and tag management."
        title="Create Client"
      />

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Pipeline</ThemedText>
        <ThemedText style={styles.helperText}>
          Existing roster: {clients.length} clients
        </ThemedText>
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
      </ThemedView>

      {clientsError ? <ThemedText style={styles.errorText}>{clientsError}</ThemedText> : null}
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
      {success ? <ThemedText style={styles.successText}>{success}</ThemedText> : null}

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Client Details</ThemedText>
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
        <View style={styles.buttonRow}>
          <Pressable disabled={pending} onPress={() => void createClient()} style={styles.primaryButton}>
            <ThemedText style={styles.primaryButtonText}>
              {pending ? 'Creating...' : 'Create client'}
            </ThemedText>
          </Pressable>
          <Pressable disabled={pending} onPress={() => router.back()} style={styles.secondaryButton}>
            <ThemedText style={styles.secondaryButtonText}>Done</ThemedText>
          </Pressable>
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
  textarea: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 120,
    textAlignVertical: 'top',
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
  errorText: {
    fontSize: 13,
    color: '#B91C1C',
  },
  successText: {
    fontSize: 13,
    color: '#166534',
  },
});

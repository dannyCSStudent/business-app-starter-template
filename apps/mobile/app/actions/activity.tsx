import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { BadgePill } from '@/components/crm/badge-pill';
import { CRMHero } from '@/components/crm/crm-hero';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useClientOptions } from '@/hooks/use-mobile-crm-options';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiBaseUrl } from '@/lib/crm';
import { emitCRMDataChanged } from '@/lib/mobile-sync';
import { QuickActivityForm } from '@/components/crm/quick-activity-form';

export default function LogActivityActionScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { clients, error: clientsError, isFallback } = useClientOptions();
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id ?? '');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedClientId && clients[0]?.id) {
      setSelectedClientId(clients[0].id);
    }
  }, [clients, selectedClientId]);

  async function createActivity(interactionType: string, notes: string) {
    if (!selectedClientId) {
      setError('Choose a client first.');
      return;
    }

    if (!notes.trim()) {
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
          notes: notes.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setSuccess('Activity logged.');
      emitCRMDataChanged();
      setSuccess('Activity logged.');
    } catch {
      setError('Unable to log activity.');
    } finally {
      setPending(false);
    }
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}>
      <CRMHero
        backgroundColor="#E7EDF7"
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
        copy="Log one interaction cleanly without carrying tag or client creation controls on the same screen."
        title="Log Activity"
      />

      {clientsError ? <ThemedText style={styles.errorText}>{clientsError}</ThemedText> : null}
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
      {success ? <ThemedText style={styles.successText}>{success}</ThemedText> : null}

      <QuickActivityForm
        clients={clients}
        selectedClientId={selectedClientId}
        onSelectClient={setSelectedClientId}
        onSubmit={({ interactionType, notes }) => createActivity(interactionType, notes)}
        isFallback={isFallback}
        isPending={pending}
      />

      <View style={styles.buttonRow}>
        <Pressable disabled={pending} onPress={() => router.back()} style={styles.secondaryButton}>
          <ThemedText style={styles.secondaryButtonText}>Done</ThemedText>
        </Pressable>
      </View>
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

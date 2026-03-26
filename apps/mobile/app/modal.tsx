import { Link } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BadgePill } from '@/components/crm/badge-pill';
import { CRMHero } from '@/components/crm/crm-hero';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useClientOptions, useTagOptions } from '@/hooks/use-mobile-crm-options';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ModalScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { clients, error: clientsError, isFallback } = useClientOptions();
  const { assignments, error: tagsError, isFallback: tagsFallback, tags } = useTagOptions();

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
        copy="Choose a focused mobile workflow instead of stacking create, log, and tag management into one screen."
        title="Quick Actions"
      />

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Workspace</ThemedText>
        <ThemedText style={styles.helperText}>
          Each route below is purpose-built for one job, which keeps mobile input faster and easier to scan.
        </ThemedText>
      </ThemedView>

      {clientsError ? <ThemedText style={styles.errorText}>{clientsError}</ThemedText> : null}
      {tagsError ? <ThemedText style={styles.errorText}>{tagsError}</ThemedText> : null}

      <View style={styles.cardGrid}>
        <Link href="/actions/client" style={styles.actionCard}>
          <ThemedView style={styles.actionCardInner}>
            <BadgePill style={styles.badgeOk}>Create</BadgePill>
            <ThemedText type="subtitle">New Client</ThemedText>
            <ThemedText style={styles.cardCopy}>
              Add a client with contact details, notes, and starting pipeline status.
            </ThemedText>
            <ThemedText style={styles.cardMeta}>{clients.length} clients in roster</ThemedText>
          </ThemedView>
        </Link>

        <Link href="/actions/activity" style={styles.actionCard}>
          <ThemedView style={styles.actionCardInner}>
            <BadgePill style={styles.badgeOk}>Log</BadgePill>
            <ThemedText type="subtitle">Activity</ThemedText>
            <ThemedText style={styles.cardCopy}>
              Capture calls, meetings, emails, follow-ups, and notes against a selected client.
            </ThemedText>
            <ThemedText style={styles.cardMeta}>Uses the current client roster</ThemedText>
          </ThemedView>
        </Link>

        <Link href="/actions/tags" style={styles.actionCard}>
          <ThemedView style={styles.actionCardInner}>
            <BadgePill style={tagsFallback ? styles.badgeWarn : styles.badgeOk}>
              {tagsFallback ? 'Fallback tags' : 'Live tags'}
            </BadgePill>
            <ThemedText type="subtitle">Tags</ThemedText>
            <ThemedText style={styles.cardCopy}>
              Create, edit, assign, and remove tags in a dedicated management workspace.
            </ThemedText>
            <ThemedText style={styles.cardMeta}>
              {tags.length} tags and {assignments.length} assignments
            </ThemedText>
          </ThemedView>
        </Link>
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
  section: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    backgroundColor: 'rgba(255,255,255,0.88)',
    gap: 12,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardGrid: {
    gap: 12,
  },
  actionCard: {
    display: 'flex',
  },
  actionCardInner: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    backgroundColor: 'rgba(255,255,255,0.88)',
    gap: 10,
  },
  cardCopy: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  cardMeta: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'uppercase',
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
  badgeWarn: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  badgeOk: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },
  helperText: {
    fontSize: 13,
    color: '#64748B',
  },
  errorText: {
    fontSize: 13,
    color: '#B91C1C',
  },
});

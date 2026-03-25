import { Link } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { BadgePill } from '@/components/crm/badge-pill';
import { ConnectionDiagnostics } from '@/components/crm/connection-diagnostics';
import { CRMHero } from '@/components/crm/crm-hero';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useCRMDataSyncRefresh } from '@/hooks/use-crm-sync-refresh';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFallbackRefresh } from '@/hooks/use-fallback-refresh';
import { apiBaseUrl, Client, fetchJson, fallbackClients, statusTone } from '@/lib/crm';

function useClients() {
  const loadClients = useCallback(() => fetchJson<Client[]>('/clients/'), []);
  const { data, error, isFallback, isRefreshing, refresh } = useFallbackRefresh({
    autoLoad: true,
    errorMessage: 'Unable to refresh clients. Showing fallback data.',
    fallbackData: fallbackClients,
    load: loadClients,
  });

  return {
    clients: data,
    isFallback,
    isRefreshing,
    error,
    refresh,
  };
}

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [query, setQuery] = useState('');
  const { clients, isFallback, isRefreshing, error, refresh } = useClients();
  useCRMDataSyncRefresh(refresh);

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return clients;
    }

    return clients.filter((client) => {
      const haystack = [
        client.name,
        client.email,
        client.phone,
        client.notes,
        ...(client.tags?.map((tag) => tag.name) ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [clients, query]);

  const activeCount = clients.filter((client) => client.status === 'active').length;
  const leadCount = clients.filter((client) => client.status === 'lead').length;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}>
      <CRMHero
        backgroundColor="#F4EFE7"
        copy="Browse the client pipeline here, then open a detail view for edits, tags, and follow-up."
        metrics={[
          { label: 'Active', tone: 'dark', value: activeCount },
          { label: 'Leads', value: leadCount },
        ]}
        title="Mobile CRM"
      />

      <ThemedView style={styles.toolbar}>
        <ThemedText type="subtitle">Clients</ThemedText>
        <View style={styles.toolbarActions}>
          <BadgePill style={isFallback ? styles.badgeWarn : styles.badgeOk}>
            {isFallback ? 'Fallback data' : 'API connected'}
          </BadgePill>
          <Link href="/modal" style={styles.quickActionLink}>
            <ThemedText style={styles.quickActionLinkText}>Quick Actions</ThemedText>
          </Link>
        </View>
      </ThemedView>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search clients, notes, or tags"
        placeholderTextColor="#94A3B8"
        style={[
          styles.searchInput,
          {
            color: colors.text,
            borderColor: colorScheme === 'dark' ? '#334155' : '#CBD5E1',
            backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
          },
        ]}
      />

      <ThemedText style={styles.resultCount}>
        Showing {filteredClients.length} of {clients.length} clients
      </ThemedText>
      <ConnectionDiagnostics
        apiBaseUrl={apiBaseUrl}
        isFallback={isFallback}
        label="Client Feed"
      />
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

      {filteredClients.map((client) => {
        const tone = statusTone[client.status];

        return (
          <ThemedView key={client.id} style={styles.clientCard}>
            <View style={styles.clientHeader}>
              <View style={styles.clientHeaderText}>
                <ThemedText type="defaultSemiBold">{client.name}</ThemedText>
                <ThemedText style={styles.clientSubtle}>
                  {client.email ?? client.phone ?? 'No contact details yet'}
                </ThemedText>
              </View>
              <View style={[styles.statusPill, { backgroundColor: tone.bg }]}>
                <ThemedText style={[styles.statusText, { color: tone.text }]}>
                  {client.status}
                </ThemedText>
              </View>
            </View>

            <ThemedText style={styles.clientMeta}>
              Last contact:{' '}
              {client.last_contacted_at
                ? new Date(client.last_contacted_at).toLocaleDateString()
                : 'Not scheduled'}
            </ThemedText>

            <ThemedText numberOfLines={2} style={styles.notesPreview}>
              {client.notes ?? 'No notes yet. Open detail to add follow-up context.'}
            </ThemedText>

            <View style={styles.tagRow}>
              {client.tags?.length ? (
                client.tags.map((tag) => (
                  <View
                    key={tag.id}
                    style={[
                      styles.tagPill,
                      { backgroundColor: `${tag.color}22`, borderColor: `${tag.color}66` },
                    ]}>
                    <ThemedText style={[styles.tagText, { color: tag.color }]}>
                      {tag.name}
                    </ThemedText>
                  </View>
                ))
              ) : (
                <ThemedText style={styles.clientSubtle}>No tags assigned</ThemedText>
              )}
            </View>

            <Link href={{ pathname: '/client/[id]', params: { id: client.id } }} style={styles.detailLink}>
              <ThemedText style={styles.detailLinkText}>Open detail workspace</ThemedText>
            </Link>
          </ThemedView>
        );
      })}
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
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  badgeWarn: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  badgeOk: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  resultCount: {
    fontSize: 13,
    color: '#64748B',
  },
  errorText: {
    fontSize: 13,
    color: '#B91C1C',
  },
  clientCard: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    backgroundColor: 'rgba(255,255,255,0.88)',
    gap: 12,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  clientHeaderText: {
    flex: 1,
    gap: 4,
  },
  clientSubtle: {
    fontSize: 13,
    color: '#64748B',
  },
  clientMeta: {
    fontSize: 13,
    color: '#475569',
  },
  notesPreview: {
    fontSize: 14,
    lineHeight: 20,
    color: '#334155',
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailLink: {
    alignSelf: 'flex-start',
  },
  detailLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'uppercase',
  },
  quickActionLink: {
    alignSelf: 'flex-start',
  },
  quickActionLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'uppercase',
  },
});

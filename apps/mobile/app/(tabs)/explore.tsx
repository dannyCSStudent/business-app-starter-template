import { Link } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { BadgePill } from '@/components/crm/badge-pill';
import { ConnectionDiagnostics } from '@/components/crm/connection-diagnostics';
import { CRMHero } from '@/components/crm/crm-hero';
import { FilterChip } from '@/components/crm/filter-chip';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useCRMDataSyncRefresh } from '@/hooks/use-crm-sync-refresh';
import { useFallbackRefresh } from '@/hooks/use-fallback-refresh';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  apiBaseUrl,
  ClientActivity,
  ClientInteractionType,
  ClientSummary,
  fallbackActivity,
  fallbackClientSummaries,
  fetchJson,
} from '@/lib/crm';

const interactionFilters: { label: string; value: ClientInteractionType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Follow Up', value: 'follow_up' },
  { label: 'Call', value: 'call' },
  { label: 'Email', value: 'email' },
  { label: 'Meeting', value: 'meeting' },
  { label: 'Note', value: 'note' },
];

function useActivityFeed() {
  const fallbackFeed = useMemo(
    () => ({
      activity: fallbackActivity,
      clients: fallbackClientSummaries,
    }),
    [],
  );
  const loadFeed = useCallback(
    async () => ({
      activity: await fetchJson<ClientActivity[]>('/activity/'),
      clients: await fetchJson<ClientSummary[]>('/clients/'),
    }),
    [],
  );
  const { data, error, isFallback, isRefreshing, refresh } = useFallbackRefresh({
    autoLoad: true,
    errorMessage: 'Unable to refresh activity. Showing fallback feed.',
    fallbackData: fallbackFeed,
    load: loadFeed,
  });

  return {
    clients: data.clients,
    activity: data.activity,
    isFallback,
    isRefreshing,
    error,
    refresh,
  };
}

export default function ActivityScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ClientInteractionType | 'all'>('all');
  const { clients, activity, isFallback, isRefreshing, error, refresh } = useActivityFeed();
  useCRMDataSyncRefresh(refresh);

  const followUpCount = activity.filter((item) => item.interaction_type === 'follow_up').length;
  const today = new Date();
  const recentCount = activity.filter((item) => {
    const timestamp = new Date(item.timestamp);
    return today.getTime() - timestamp.getTime() <= 1000 * 60 * 60 * 24 * 7;
  }).length;

  const filteredActivity = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return activity.filter((item) => {
      const clientName = clients.find((client) => client.id === item.client_id)?.name ?? '';
      const matchesQuery =
        !normalizedQuery ||
        `${clientName} ${item.notes ?? ''} ${item.interaction_type}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesType = selectedType === 'all' || item.interaction_type === selectedType;
      return matchesQuery && matchesType;
    });
  }, [activity, clients, query, selectedType]);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}>
      <CRMHero
        backgroundColor="#E7EDF7"
        badge={
          <BadgePill style={isFallback ? styles.badgeWarn : styles.badgeOk}>
          {isFallback ? 'Fallback feed' : 'Live activity'}
          </BadgePill>
        }
        copy="Recent CRM work with quick filtering for follow-up and recent interactions."
        metrics={[
          { label: 'Follow Ups', tone: 'dark', value: followUpCount },
          { label: 'Last 7 Days', value: recentCount },
        ]}
        title="Activity"
      />

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search by client, type, or note"
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

      <View style={styles.filterRow}>
        {interactionFilters.map((filter) => {
          const isSelected = selectedType === filter.value;

          return (
            <FilterChip
              key={filter.value}
              label={filter.label}
              onPress={() => setSelectedType(filter.value)}
              selected={isSelected}
            />
          );
        })}
      </View>

      <ThemedText style={styles.resultCount}>
        Showing {filteredActivity.length} of {activity.length} entries
      </ThemedText>
      <ConnectionDiagnostics
        apiBaseUrl={apiBaseUrl}
        isFallback={isFallback}
        label="Activity Feed"
      />
      <Link href="/modal" style={styles.quickActionLink}>
        <ThemedText style={styles.quickActionLinkText}>Open Quick Actions</ThemedText>
      </Link>
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

      {filteredActivity.map((item) => {
        const clientName =
          clients.find((client) => client.id === item.client_id)?.name ?? 'Unknown client';

        return (
          <ThemedView key={item.id} style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <View style={styles.activityText}>
                <ThemedText type="defaultSemiBold">{clientName}</ThemedText>
                <ThemedText style={styles.activityType}>
                  {item.interaction_type.replace('_', ' ')}
                </ThemedText>
              </View>
              <ThemedText style={styles.activityDate}>
                {new Date(item.timestamp).toLocaleDateString()}
              </ThemedText>
            </View>
            <ThemedText style={styles.activityNotes}>
              {item.notes ?? 'No notes attached.'}
            </ThemedText>
            <Link href={{ pathname: '/client/[id]', params: { id: item.client_id } }} style={styles.detailLink}>
              <ThemedText style={styles.detailLinkText}>Open client workspace</ThemedText>
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  resultCount: {
    fontSize: 13,
    color: '#64748B',
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
  errorText: {
    fontSize: 13,
    color: '#B91C1C',
  },
  activityCard: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    backgroundColor: 'rgba(255,255,255,0.88)',
    gap: 10,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  activityText: {
    flex: 1,
    gap: 4,
  },
  activityType: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'capitalize',
  },
  activityDate: {
    fontSize: 12,
    color: '#64748B',
  },
  activityNotes: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
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
});

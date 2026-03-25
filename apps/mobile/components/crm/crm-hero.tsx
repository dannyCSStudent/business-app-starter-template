import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';

type Metric = {
  label: string;
  value: string | number;
  tone?: 'default' | 'dark';
};

type CRMHeroProps = {
  backgroundColor: string;
  badge?: ReactNode;
  copy: string;
  metrics?: Metric[];
  title: string;
};

export function CRMHero({ backgroundColor, badge, copy, metrics = [], title }: CRMHeroProps) {
  return (
    <ThemedView style={[styles.hero, { backgroundColor }]}>
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText style={styles.copy}>{copy}</ThemedText>
      {metrics.length ? (
        <View style={styles.metrics}>
          {metrics.map((metric) => {
            const dark = metric.tone === 'dark';

            return (
              <View key={metric.label} style={[styles.metricCard, dark && styles.metricCardDark]}>
                <ThemedText style={dark ? styles.metricLabelLight : styles.metricLabel}>
                  {metric.label}
                </ThemedText>
                <ThemedText style={dark ? styles.metricValueLight : styles.metricValue}>
                  {metric.value}
                </ThemedText>
              </View>
            );
          })}
        </View>
      ) : null}
      {badge}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    gap: 12,
  },
  title: {
    fontFamily: Fonts.rounded,
  },
  copy: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
  },
  metrics: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    backgroundColor: '#FFFFFF',
  },
  metricCardDark: {
    backgroundColor: '#0F172A',
  },
  metricLabel: {
    color: '#64748B',
    fontSize: 13,
  },
  metricValue: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '700',
  },
  metricLabelLight: {
    color: '#CBD5E1',
    fontSize: 13,
  },
  metricValueLight: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
  },
});

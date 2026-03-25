import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type FilterChipProps = {
  label: string;
  onPress: () => void;
  selected?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export function FilterChip({ label, onPress, selected = false, style }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected, style]}>
      <ThemedText style={[styles.text, selected && styles.textSelected]}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  textSelected: {
    color: '#1D4ED8',
  },
});

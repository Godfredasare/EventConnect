// ============================================================
// EventConnect GH – Badge
// ============================================================
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColors } from '@/hooks';
import { Caption } from './ThemedText';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  style?: any;
}

export function Badge({ label, variant = 'default', size = 'sm', style }: BadgeProps) {
  const colors = useColors();

  const bgColor = (() => {
    switch (variant) {
      case 'success': return colors.accent;
      case 'warning': return colors.warning;
      case 'error': return colors.error;
      case 'info': return colors.primary;
      default: return colors.primary;
    }
  })();

  const padding = size === 'sm' ? { paddingHorizontal: 8, paddingVertical: 2 } : { paddingHorizontal: 12, paddingVertical: 4 };

  return (
    <View style={[styles.base, { backgroundColor: bgColor }, padding, style]}>
      <Caption color="white" style={{ fontSize: size === 'sm' ? 10 : 12 }}>
        {label}
      </Caption>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 9999,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
});

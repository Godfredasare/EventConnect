// ============================================================
// EventConnect GH – Divider
// ============================================================
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColors } from '@/hooks';
import { spacing } from '@/constants';

interface DividerProps {
  style?: any;
}

export function Divider({ style }: DividerProps) {
  const colors = useColors();

  return (
    <View
      style={[
        {
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.border,
          marginVertical: spacing.sm,
        },
        style,
      ]}
    />
  );
}

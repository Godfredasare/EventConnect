// ============================================================
// EventConnect GH – Card
// ============================================================
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useColors } from '@/hooks';
import { spacing, radii, shadow } from '@/constants';
import type { CardProps } from '@/types';

export function Card({
  children,
  onPress,
  elevation = 'sm',
  padding = 'md',
  radius = 'lg',
  style,
}: CardProps) {
  const colors = useColors();

  const cardStyle = StyleSheet.flatten([
    {
      backgroundColor: colors.surface,
      borderRadius: radii[radius],
      padding: spacing[padding],
      ...shadow(elevation),
      borderWidth: 0.5,
      borderColor: colors.border,
    },
    style as ViewStyle,
  ]);

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

// ============================================================
// EventConnect GH – Chip
// ============================================================
import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useColors } from '@/hooks';
import { spacing, radii, typography } from '@/constants';
import { ThemedText } from './ThemedText';
import type { ChipProps } from '@/types';

export function Chip({
  label,
  selected = false,
  onPress,
  leftIcon,
  variant = 'default',
  size = 'md',
  style,
}: ChipProps) {
  const colors = useColors();

  const chipStyle = StyleSheet.flatten([
    styles.base,
    sizeStyles[size],
    variantStyles(variant, colors, selected),
    style as ViewStyle,
  ]);

  const textColor = getChipTextColor(variant, colors, selected);

  return (
    <TouchableOpacity
      style={chipStyle}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
      <ThemedText
        variant={size === 'sm' ? 'caption' : 'bodySmall'}
        color={textColor}
        style={selected && { fontWeight: '600' }}
      >
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

function getChipTextColor(
  variant: string,
  colors: any,
  selected: boolean
): any {
  if (variant === 'outline') {
    return selected ? 'white' : 'text';
  }
  return selected ? 'white' : 'textMuted';
}

function variantStyles(
  variant: string,
  colors: any,
  selected: boolean
): ViewStyle {
  const base: ViewStyle = { borderRadius: radii.full };

  switch (variant) {
    case 'selected':
      return {
        ...base,
        backgroundColor: colors.primary,
      };
    case 'outline':
      return {
        ...base,
        backgroundColor: selected ? colors.primary : 'transparent',
        borderWidth: 1.5,
        borderColor: selected ? colors.primary : colors.border,
      };
    case 'filter':
      return {
        ...base,
        backgroundColor: selected ? colors.primary : colors.surface,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.border,
      };
    default:
      return {
        ...base,
        backgroundColor: selected ? colors.primary : colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      };
  }
}

const sizeStyles: Record<string, ViewStyle> = {
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  icon: {
    marginRight: 2,
  },
});

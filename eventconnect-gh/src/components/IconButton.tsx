// ============================================================
// EventConnect GH – IconButton
// ============================================================
import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useColors } from '@/hooks';
import { HIT_SLOP } from '@/constants';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const sizeMap = {
  sm: { container: 32, icon: 16 },
  md: { container: 44, icon: 20 },
  lg: { container: 56, icon: 24 },
};

export function IconButton({
  icon,
  onPress,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  style,
  testID,
}: IconButtonProps) {
  const colors = useColors();
  const dimensions = sizeMap[size];

  const containerStyle = StyleSheet.flatten([
    {
      width: dimensions.container,
      height: dimensions.container,
      borderRadius: dimensions.container / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    variantStyles(variant, colors),
    disabled && { opacity: 0.4 },
    style,
  ]);

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {icon}
    </TouchableOpacity>
  );
}

function variantStyles(variant: string, colors: any): ViewStyle {
  switch (variant) {
    case 'primary':
      return { backgroundColor: colors.primary };
    case 'secondary':
      return {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      };
    case 'ghost':
    default:
      return { backgroundColor: 'transparent' };
  }
}

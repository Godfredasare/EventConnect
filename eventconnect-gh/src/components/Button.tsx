// ============================================================
// EventConnect GH – Button
// ============================================================
import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useColors } from '@/hooks';
import { spacing, radii, typography, ANIMATION_CONFIG } from '@/constants';
import type { ButtonProps, ButtonVariant, ButtonSize } from '@/types';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
}: ButtonProps) {
  const colors = useColors();

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  const buttonStyle = StyleSheet.flatten([
    styles.base,
    sizeStyles[size],
    fullWidth && styles.fullWidth,
    variantStyles(colors)[variant],
    disabled && styles.disabled,
    style as ViewStyle,
  ]);

  const textColor = getTextColor(colors, variant, disabled);

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'ghost' || variant === 'secondary' ? colors.primary : '#FFFFFF'}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <React.Fragment>{icon}</React.Fragment>
          )}
          {typeof children === 'string' ? (
            <ButtonText style={{ color: textColor, ...(size === 'sm' && { fontSize: 14 }) }}>
              {children}
            </ButtonText>
          ) : (
            children
          )}
          {icon && iconPosition === 'right' && (
            <React.Fragment>{icon}</React.Fragment>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

function getTextColor(colors: any, variant: ButtonVariant, disabled: boolean): string {
  if (disabled) return colors.textMuted;
  switch (variant) {
    case 'primary':
      return '#FFFFFF';
    case 'secondary':
      return colors.primary;
    case 'ghost':
      return colors.text;
    case 'danger':
      return '#FFFFFF';
    default:
      return '#FFFFFF';
  }
}

function variantStyles(colors: any): Record<ButtonVariant, ViewStyle> {
  return {
    primary: {
      backgroundColor: colors.primary,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    danger: {
      backgroundColor: colors.error,
    },
  };
}

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
  },
  md: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  lg: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: radii.md,
  },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});

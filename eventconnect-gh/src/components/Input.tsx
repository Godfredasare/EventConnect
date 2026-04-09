// ============================================================
// EventConnect GH – Input
// ============================================================
import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { useColors } from '@/hooks';
import { spacing, radii, typography } from '@/constants';
import { ThemedText } from './ThemedText';
import type { InputProps } from '@/types';

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      value,
      onChangeText,
      placeholder,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      secureTextEntry = false,
      keyboardType = 'default',
      autoCapitalize = 'none',
      editable = true,
      multiline = false,
      numberOfLines,
      variant = 'default',
      style,
    },
    ref
  ) => {
    const colors = useColors();
    const [isFocused, setIsFocused] = useState(false);

    const containerStyle = StyleSheet.flatten([
      styles.container,
      variantStyles(variant, colors, isFocused, !!error),
      !editable && styles.disabled,
      style as ViewStyle,
    ]);

    return (
      <View style={styles.wrapper}>
        {label && (
          <ThemedText
            variant="bodySmall"
            color={error ? 'error' : 'text'}
            style={styles.label}
          >
            {label}
          </ThemedText>
        )}

        <View style={containerStyle}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            editable={editable}
            multiline={multiline}
            numberOfLines={numberOfLines}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[
              styles.input,
              {
                color: colors.text,
              },
              multiline && styles.multiline,
              leftIcon && styles.inputWithLeftIcon,
              rightIcon && styles.inputWithRightIcon,
            ]}
          />

          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>

        {error && (
          <ThemedText variant="caption" color="error" style={styles.errorText}>
            {error}
          </ThemedText>
        )}

        {hint && !error && (
          <ThemedText variant="caption" color="textMuted" style={styles.hintText}>
            {hint}
          </ThemedText>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

function variantStyles(
  variant: string,
  colors: any,
  focused: boolean,
  hasError: boolean
): ViewStyle {
  const base: ViewStyle = {
    borderWidth: 1.5,
    borderColor: hasError ? colors.error : focused ? colors.primary : colors.border,
    borderRadius: radii.md,
  };

  switch (variant) {
    case 'filled':
      return {
        ...base,
        borderWidth: 0,
        backgroundColor: colors.surface,
      };
    case 'outline':
      return {
        ...base,
        backgroundColor: 'transparent',
      };
    default:
      return {
        ...base,
        backgroundColor: colors.surface,
      };
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    marginBottom: spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  input: {
    flex: 1,
    ...typography.body,
    paddingVertical: spacing.sm,
    textAlignVertical: 'center',
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: spacing.sm,
  },
  multiline: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  errorText: {
    marginTop: spacing.xs,
  },
  hintText: {
    marginTop: spacing.xs,
  },
  disabled: {
    opacity: 0.5,
  },
});

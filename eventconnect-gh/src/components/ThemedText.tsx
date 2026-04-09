// ============================================================
// EventConnect GH – ThemedText
// ============================================================
import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useColors } from '@/hooks';
import { typography } from '@/constants';
import type { Typography } from '@/types';

type TextVariant = keyof Typography;
type TextColor = 'text' | 'textMuted' | 'primary' | 'secondary' | 'accent' | 'error' | 'white' | 'surface';

interface ThemedTextProps {
  children?: React.ReactNode;
  style?: TextStyle | TextStyle[];
  variant?: TextVariant;
  color?: TextColor;
  align?: 'left' | 'center' | 'right' | 'auto';
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  testID?: string;
  /** If true, applies the text style + variant styles */
  weight?: TextStyle['fontWeight'];
}

export function ThemedText({
  children,
  style,
  variant,
  color = 'text',
  align,
  numberOfLines,
  ellipsizeMode,
  testID,
  weight,
}: ThemedTextProps) {
  const colors = useColors();

  const colorValue = (() => {
    switch (color) {
      case 'text': return colors.text;
      case 'textMuted': return colors.textMuted;
      case 'primary': return colors.primary;
      case 'secondary': return colors.secondary;
      case 'accent': return colors.accent;
      case 'error': return colors.error;
      case 'white': return '#FFFFFF';
      case 'surface': return colors.surface;
      default: return colors.text;
    }
  })();

  const textStyle = StyleSheet.flatten([
    { color: colorValue },
    variant ? typography[variant] : undefined,
    weight ? { fontWeight: weight } : undefined,
    align ? { textAlign: align } : undefined,
    style,
  ]);

  return (
    <Text
      style={textStyle}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      testID={testID}
    >
      {children}
    </Text>
  );
}

// ---------- Convenience sub-components ----------

export function Heading1(props: Omit<ThemedTextProps, 'variant'>) {
  return <ThemedText variant="heading1" {...props} />;
}

export function Heading2(props: Omit<ThemedTextProps, 'variant'>) {
  return <ThemedText variant="heading2" {...props} />;
}

export function Heading3(props: Omit<ThemedTextProps, 'variant'>) {
  return <ThemedText variant="heading3" {...props} />;
}

export function BodyLarge(props: Omit<ThemedTextProps, 'variant'>) {
  return <ThemedText variant="bodyLarge" {...props} />;
}

export function BodyText(props: Omit<ThemedTextProps, 'variant'>) {
  return <ThemedText variant="body" {...props} />;
}

export function BodySmall(props: Omit<ThemedTextProps, 'variant'>) {
  return <ThemedText variant="bodySmall" {...props} />;
}

export function Caption(props: Omit<ThemedTextProps, 'variant'>) {
  return <ThemedText variant="caption" {...props} />;
}

export function ButtonText(props: Omit<ThemedTextProps, 'variant'>) {
  return <ThemedText variant="button" {...props} />;
}

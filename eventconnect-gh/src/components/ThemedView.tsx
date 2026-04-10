// ============================================================
// EventConnect GH – ThemedView
// ============================================================
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useColors } from '@/hooks';

interface ThemedViewProps {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
  /** Override the background color variant */
  variant?: 'background' | 'surface';
  /** Optional onPress makes it pressable */
  onPress?: () => void;
  /** Pressable feedback */
  pressableStyle?: ViewStyle;
}

export function ThemedView({
  children,
  style,
  testID,
  variant = 'background',
  onPress,
  pressableStyle,
}: ThemedViewProps) {
  const colors = useColors();
  const bgColor = variant === 'surface' ? colors.surface : colors.background;

  const containerStyle = StyleSheet.flatten([
    { backgroundColor: bgColor },
    styles.default,
    style,
  ]);

  if (onPress) {
    return (
      <View style={containerStyle} testID={testID}>
        {children}
      </View>
    );
  }

  return (
    <View style={containerStyle} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
  },
});

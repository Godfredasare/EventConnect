// ============================================================
// EventConnect GH – Avatar
// ============================================================
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useColors } from '@/hooks';
import { radii, spacing } from '@/constants';
import { ThemedText } from './ThemedText';
import { getInitials } from '@/lib';

interface AvatarProps {
  uri?: string | null;
  name?: string | null;
  size?: number;
  style?: any;
}

export function Avatar({ uri, name, size = 48, style }: AvatarProps) {
  const colors = useColors();
  const initials = getInitials(name);
  const fontSize = Math.max(size * 0.38, 12);

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <ThemedText
        color="white"
        style={{ fontSize, fontWeight: '600', lineHeight: fontSize * 1.2 }}
      >
        {initials}
      </ThemedText>
    </View>
  );
}

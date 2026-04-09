import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, Button } from '@/components';
import { spacing, radii } from '@/constants';
import { router } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <ThemedText variant="heading1" style={styles.title}>
        404
      </ThemedText>
      <ThemedText variant="heading3" color="textMuted" style={styles.subtitle}>
        Page Not Found
      </ThemedText>
      <ThemedText color="textMuted" align="center" style={styles.description}>
        The page you're looking for doesn't exist or has been moved.
      </ThemedText>
      <Button onPress={() => router.replace('/(tabs)')} variant="primary" size="md">
        Go Home
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.md,
  },
  description: {
    maxWidth: 300,
    marginBottom: spacing.xl,
  },
});

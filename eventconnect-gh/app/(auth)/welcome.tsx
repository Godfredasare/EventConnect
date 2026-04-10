import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedView, ThemedText, Heading1, BodySmall, Button } from '@/components';
import { useColors } from '@/hooks';
import { spacing } from '@/constants';

export default function WelcomeScreen() {
  const colors = useColors();

  return (
    <ThemedView>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Logo / Branding */}
          <View style={styles.brandSection}>
            <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
              <ThemedText style={{ fontSize: 40 }}>🎉</ThemedText>
            </View>
            <Heading1 style={[styles.appName, { color: colors.primary }]}>EventConnect</Heading1>
            <BodySmall color="textMuted" style={styles.tagline}>
              Ghana's premier event service marketplace. Find and book the best vendors for your events.
            </BodySmall>
          </View>

          {/* Feature Highlights */}
          <View style={styles.features}>
            {[
              { icon: '🔍', text: 'Discover trusted vendors' },
              { icon: '📅', text: 'Book services instantly' },
              { icon: '💬', text: 'Chat with vendors directly' },
              { icon: '⭐', text: 'Read verified reviews' },
            ].map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <ThemedText style={{ fontSize: 20 }}>{feature.icon}</ThemedText>
                <BodySmall color="textMuted">{feature.text}</BodySmall>
              </View>
            ))}
          </View>

          {/* CTA */}
          <View style={styles.ctaSection}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => router.push('/(auth)/phone')}
            >
              Get Started
            </Button>
            <ThemedText color="textMuted" align="center" style={styles.termsText}>
              By continuing, you agree to our{' '}
              <ThemedText color="primary" weight="600">Terms of Service</ThemedText>
              {' '}and{' '}
              <ThemedText color="primary" weight="600">Privacy Policy</ThemedText>
            </ThemedText>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: spacing['3xl'],
  },
  brandSection: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  appName: {
    marginBottom: spacing.sm,
  },
  tagline: {
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 22,
  },
  features: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ctaSection: {
    gap: spacing.md,
  },
  termsText: {
    maxWidth: 320,
    alignSelf: 'center',
    lineHeight: 20,
  },
});

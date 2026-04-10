import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ThemedView, ThemedText, Heading2, BodySmall, Card, Button } from '@/components';
import { useColors } from '@/hooks';
import { spacing } from '@/constants';

export default function UserTypeScreen() {
  const colors = useColors();
  const [selected, setSelected] = useState<'customer' | 'vendor' | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    if (selected === 'customer') {
      router.push('/(auth)/customer-onboarding');
    } else {
      router.push('/(auth)/vendor-onboarding');
    }
  };

  return (
    <ThemedView>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <ThemedText style={{ fontSize: 48, alignSelf: 'center', marginBottom: spacing.lg }}>👤</ThemedText>
          <Heading2 style={styles.title}>How would you like to use EventConnect?</Heading2>
          <BodySmall color="textMuted" style={styles.subtitle}>
            Choose your account type. You can always change this later.
          </BodySmall>

          <View style={styles.options}>
            <Card
              onPress={() => setSelected('customer')}
              padding="lg"
              radius="lg"
              style={[
                styles.optionCard,
                selected === 'customer' && { borderColor: colors.primary, borderWidth: 2 },
              ]}
            >
              <ThemedText style={{ fontSize: 36 }}>🎉</ThemedText>
              <ThemedText variant="heading3" style={{ marginTop: spacing.md }}>I'm planning an event</ThemedText>
              <BodySmall color="textMuted" style={{ marginTop: spacing.xs }}>
                Discover and book vendors for weddings, parties, corporate events, and more.
              </BodySmall>
              {selected === 'customer' && (
                <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                </View>
              )}
            </Card>

            <Card
              onPress={() => setSelected('vendor')}
              padding="lg"
              radius="lg"
              style={[
                styles.optionCard,
                selected === 'vendor' && { borderColor: colors.primary, borderWidth: 2 },
              ]}
            >
              <ThemedText style={{ fontSize: 36 }}>💼</ThemedText>
              <ThemedText variant="heading3" style={{ marginTop: spacing.md }}>I provide event services</ThemedText>
              <BodySmall color="textMuted" style={{ marginTop: spacing.xs }}>
                List your services, manage bookings, and grow your business on EventConnect.
              </BodySmall>
              {selected === 'vendor' && (
                <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                </View>
              )}
            </Card>
          </View>

          <View style={styles.ctaSection}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleContinue}
              disabled={!selected}
            >
              Continue
            </Button>
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
    paddingTop: spacing.xl,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  options: { gap: spacing.md },
  optionCard: { position: 'relative' as const },
  checkBadge: {
    position: 'absolute' as const,
    top: spacing.md,
    right: spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  ctaSection: {
    marginTop: 'auto' as const,
    paddingBottom: spacing.xl,
  },
});

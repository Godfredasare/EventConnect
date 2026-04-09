import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ThemedView, ThemedText, Heading2, BodySmall, Button, Input } from '@/components';
import { useColors } from '@/hooks';
import { spacing, radii } from '@/constants';
import { normalizeGhanaPhone, isValidGhanaPhone } from '@/lib';

export default function PhoneScreen() {
  const colors = useColors();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setError('');
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!isValidGhanaPhone(phone)) {
      setError('Please enter a valid Ghana phone number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push({ pathname: '/(auth)/otp', params: { phone: normalizeGhanaPhone(phone) } });
    }, 1000);
  };

  return (
    <ThemedView>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.container}>
          <ThemedText style={{ fontSize: 48, alignSelf: 'center', marginBottom: spacing.lg }}>📱</ThemedText>
          <Heading2 style={styles.title}>Enter Your Phone</Heading2>
          <BodySmall color="textMuted" style={styles.subtitle}>
            We'll send a verification code to confirm your number.
          </BodySmall>

          <View style={styles.form}>
            <Input
              value={phone}
              onChangeText={setPhone}
              placeholder="024 123 4567"
              label="Phone Number"
              keyboardType="phone-pad"
              error={error}
              hint="Format: 0XX XXX XXXX"
              leftIcon={
                <View style={[styles.flagBadge, { backgroundColor: colors.surface }]}>
                  <ThemedText variant="caption" weight="600">🇬🇭 +233</ThemedText>
                </View>
              }
            />
          </View>

          <View style={styles.ctaSection}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleContinue}
              loading={loading}
              disabled={phone.length < 10}
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
  backButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
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
  form: {
    marginBottom: spacing.xl,
  },
  flagBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  ctaSection: {
    marginTop: 'auto',
    paddingBottom: spacing.xl,
  },
});

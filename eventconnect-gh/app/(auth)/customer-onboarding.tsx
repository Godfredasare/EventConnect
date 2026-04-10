import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedView, ThemedText, Heading2, BodySmall, Button, Input, Chip } from '@/components';
import { useColors } from '@/hooks';
import { spacing, EVENT_CATEGORIES, GHANA_REGIONS } from '@/constants';

export default function CustomerOnboardingScreen() {
  const colors = useColors();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    region: '',
    interests: [] as string[],
  });

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleInterest = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 0: return formData.fullName.trim().length >= 2;
      case 1: return formData.region.length > 0;
      case 2: return formData.interests.length > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  const steps = [
    <View key="name" style={styles.stepContent}>
      <ThemedText style={{ fontSize: 40, alignSelf: 'center', marginBottom: spacing.md }}>👋</ThemedText>
      <Heading2 style={styles.stepTitle}>What's your name?</Heading2>
      <Input
        value={formData.fullName}
        onChangeText={(t) => updateField('fullName', t)}
        placeholder="Enter your full name"
        label="Full Name"
        autoCapitalize="words"
      />
    </View>,

    <View key="location" style={styles.stepContent}>
      <ThemedText style={{ fontSize: 40, alignSelf: 'center', marginBottom: spacing.md }}>📍</ThemedText>
      <Heading2 style={styles.stepTitle}>Where are you located?</Heading2>
      <BodySmall color="textMuted" style={styles.stepSubtitle}>We'll show vendors near you.</BodySmall>
      <View style={styles.regionGrid}>
        {GHANA_REGIONS.map((region) => (
          <Chip
            key={region}
            label={region}
            selected={formData.region === region}
            onPress={() => updateField('region', region)}
            variant="filter"
            size="sm"
          />
        ))}
      </View>
    </View>,

    <View key="interests" style={styles.stepContent}>
      <ThemedText style={{ fontSize: 40, alignSelf: 'center', marginBottom: spacing.md }}>🎯</ThemedText>
      <Heading2 style={styles.stepTitle}>What events interest you?</Heading2>
      <BodySmall color="textMuted" style={styles.stepSubtitle}>Select categories to personalize your feed.</BodySmall>
      <View style={styles.interestGrid}>
        {EVENT_CATEGORIES.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.name}
            leftIcon={<ThemedText>{cat.icon}</ThemedText>}
            selected={formData.interests.includes(cat.id)}
            onPress={() => toggleInterest(cat.id)}
            variant="filter"
            size="md"
          />
        ))}
      </View>
    </View>,
  ];

  return (
    <ThemedView>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              {steps.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.progressStep,
                    {
                      backgroundColor: i <= step ? colors.primary : colors.border,
                      flex: i === step ? 2 : 1,
                    },
                  ]}
                />
              ))}
            </View>
            <ThemedText variant="caption" color="textMuted">
              Step {step + 1} of {steps.length}
            </ThemedText>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
            {steps[step]}
          </ScrollView>

          <View style={styles.ctaSection}>
            {step > 0 && (
              <Button variant="ghost" size="lg" fullWidth onPress={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button variant="primary" size="lg" fullWidth onPress={handleNext} disabled={!canProceed()}>
              {step === steps.length - 1 ? 'Complete' : 'Continue'}
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl },
  progressContainer: { alignItems: 'center', paddingTop: spacing.md, gap: spacing.sm },
  progressBar: {
    flexDirection: 'row',
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    gap: 4,
  },
  progressStep: { height: '100%', borderRadius: 2 },
  stepContent: { paddingTop: spacing.xl },
  stepTitle: { textAlign: 'center', marginBottom: spacing.sm },
  stepSubtitle: { textAlign: 'center', marginBottom: spacing.lg },
  regionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  interestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  scrollContent: { flex: 1 },
  ctaSection: { paddingTop: spacing.md, paddingBottom: spacing.xl, gap: spacing.sm },
});

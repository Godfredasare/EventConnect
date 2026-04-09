import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedView, ThemedText, Heading2, Heading3, BodySmall, Button, Input, Card } from '@/components';
import { useColors } from '@/hooks';
import { spacing, EVENT_CATEGORIES, GHANA_REGIONS } from '@/constants';

export default function VendorOnboardingScreen() {
  const colors = useColors();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    description: '',
    location: '',
    serviceAreas: [] as string[],
    minPrice: '',
    maxPrice: '',
  });

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleServiceArea = (region: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(region)
        ? prev.serviceAreas.filter((r) => r !== region)
        : [...prev.serviceAreas, region],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 0: return formData.businessName.trim().length >= 2;
      case 1: return formData.category.length > 0 && formData.description.trim().length >= 10;
      case 2: return formData.location.length > 0 && formData.serviceAreas.length > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < 2) { setStep(step + 1); }
    else { router.replace('/(tabs)'); }
  };

  const steps = [
    <View key="business" style={styles.stepContent}>
      <ThemedText style={{ fontSize: 40, alignSelf: 'center', marginBottom: spacing.md }}>🏢</ThemedText>
      <Heading2 style={styles.stepTitle}>Business Information</Heading2>
      <BodySmall color="textMuted" style={styles.stepSubtitle}>Tell us about your event business.</BodySmall>
      <Input
        value={formData.businessName}
        onChangeText={(t) => updateField('businessName', t)}
        placeholder="e.g., Royal Events GH"
        label="Business Name"
        autoCapitalize="words"
      />
      <Input
        value={formData.minPrice}
        onChangeText={(t) => updateField('minPrice', t)}
        placeholder="e.g., 500"
        label="Minimum Price (GH₵)"
        keyboardType="numeric"
        rightIcon={<ThemedText variant="caption" color="textMuted">GH₵</ThemedText>}
      />
      <Input
        value={formData.maxPrice}
        onChangeText={(t) => updateField('maxPrice', t)}
        placeholder="e.g., 10000"
        label="Maximum Price (GH₵)"
        keyboardType="numeric"
        rightIcon={<ThemedText variant="caption" color="textMuted">GH₵</ThemedText>}
      />
    </View>,

    <View key="category" style={styles.stepContent}>
      <ThemedText style={{ fontSize: 40, alignSelf: 'center', marginBottom: spacing.md }}>🎯</ThemedText>
      <Heading2 style={styles.stepTitle}>Services & Description</Heading2>
      <BodySmall color="textMuted" style={styles.stepSubtitle}>What type of event services do you offer?</BodySmall>
      <View style={styles.categoryGrid}>
        {EVENT_CATEGORIES.map((cat) => (
          <Card
            key={cat.id}
            onPress={() => updateField('category', cat.id)}
            padding="sm"
            radius="md"
            style={[
              styles.categoryCard,
              formData.category === cat.id && { borderColor: colors.primary, borderWidth: 2 },
            ]}
          >
            <ThemedText style={{ fontSize: 24 }}>{cat.icon}</ThemedText>
            <ThemedText variant="caption" weight="600" style={{ marginTop: 4 }}>{cat.name}</ThemedText>
          </Card>
        ))}
      </View>
      <Input
        value={formData.description}
        onChangeText={(t) => updateField('description', t)}
        placeholder="Describe your services, experience, and what makes you unique..."
        label="Business Description"
        multiline
        numberOfLines={4}
      />
    </View>,

    <View key="location" style={styles.stepContent}>
      <ThemedText style={{ fontSize: 40, alignSelf: 'center', marginBottom: spacing.md }}>📍</ThemedText>
      <Heading2 style={styles.stepTitle}>Location & Service Areas</Heading2>
      <BodySmall color="textMuted" style={styles.stepSubtitle}>Where are you based and which regions do you serve?</BodySmall>
      <Input
        value={formData.location}
        onChangeText={(t) => updateField('location', t)}
        placeholder="e.g., Osu, Accra"
        label="Business Location"
        autoCapitalize="sentences"
      />
      <Heading3 style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
        Service Areas ({formData.serviceAreas.length} selected)
      </Heading3>
      <View style={styles.regionGrid}>
        {GHANA_REGIONS.map((region) => (
          <Card
            key={region}
            onPress={() => toggleServiceArea(region)}
            padding="sm"
            radius="md"
            style={[
              styles.regionCard,
              formData.serviceAreas.includes(region) && {
                backgroundColor: colors.primary + '15',
                borderColor: colors.primary,
                borderWidth: 1.5,
              },
            ]}
          >
            <ThemedText
              variant="caption"
              color={formData.serviceAreas.includes(region) ? 'primary' : 'text'}
              weight={formData.serviceAreas.includes(region) ? '600' : '400'}
            >
              {region}
            </ThemedText>
          </Card>
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
                    { backgroundColor: i <= step ? colors.primary : colors.border, flex: i === step ? 2 : 1 },
                  ]}
                />
              ))}
            </View>
            <ThemedText variant="caption" color="textMuted">Step {step + 1} of {steps.length}</ThemedText>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
            {steps[step]}
          </ScrollView>
          <View style={styles.ctaSection}>
            {step > 0 && (
              <Button variant="ghost" size="lg" fullWidth onPress={() => setStep(step - 1)}>Back</Button>
            )}
            <Button variant="primary" size="lg" fullWidth onPress={handleNext} disabled={!canProceed()}>
              {step === steps.length - 1 ? 'Complete Setup' : 'Continue'}
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
  progressBar: { flexDirection: 'row', width: '100%', height: 4, borderRadius: 2, overflow: 'hidden', gap: 4 },
  progressStep: { height: '100%', borderRadius: 2 },
  stepContent: { paddingTop: spacing.xl },
  stepTitle: { textAlign: 'center', marginBottom: spacing.sm },
  stepSubtitle: { textAlign: 'center', marginBottom: spacing.lg },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  categoryCard: { width: '31%', alignItems: 'center', paddingVertical: spacing.md },
  regionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  regionCard: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  scrollContent: { flex: 1 },
  ctaSection: { paddingTop: spacing.md, paddingBottom: spacing.xl, gap: spacing.sm },
});

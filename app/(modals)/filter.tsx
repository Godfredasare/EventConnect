import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ThemedView, ThemedText, Heading3, Chip, Button, Divider } from '@/components';
import { useColors } from '@/hooks';
import { spacing, EVENT_CATEGORIES, GHANA_REGIONS } from '@/constants';

export default function FilterModal() {
  const colors = useColors();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(0);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const handleApply = () => { router.back(); };
  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedRegions([]);
    setRating(0);
  };

  const hasFilters = selectedCategories.length > 0 || selectedRegions.length > 0 || rating > 0;

  return (
    <ThemedView>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <ThemedText variant="heading3" style={{ flex: 1 }}>Filters</ThemedText>
          {hasFilters && <Button variant="ghost" size="sm" onPress={handleReset}>Reset</Button>}
          <TouchableOpacity style={{ padding: spacing.sm }} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          <View style={styles.section}>
            <ThemedText variant="bodySmall" weight="600" style={styles.sectionTitle}>Category</ThemedText>
            <View style={styles.chipGrid}>
              {EVENT_CATEGORIES.map((cat) => (
                <Chip key={cat.id} label={cat.name} leftIcon={<ThemedText>{cat.icon}</ThemedText>}
                  selected={selectedCategories.includes(cat.id)} onPress={() => toggleCategory(cat.id)}
                  variant="filter" size="sm" />
              ))}
            </View>
          </View>
          <Divider />
          <View style={styles.section}>
            <ThemedText variant="bodySmall" weight="600" style={styles.sectionTitle}>Location</ThemedText>
            <View style={styles.chipGrid}>
              {GHANA_REGIONS.slice(0, 8).map((region) => (
                <Chip key={region} label={region} selected={selectedRegions.includes(region)}
                  onPress={() => toggleRegion(region)} variant="filter" size="sm" />
              ))}
            </View>
          </View>
          <Divider />
          <View style={styles.section}>
            <ThemedText variant="bodySmall" weight="600" style={styles.sectionTitle}>Minimum Rating</ThemedText>
            <View style={styles.ratingRow}>
              {[0, 3, 3.5, 4, 4.5].map((r) => (
                <Chip key={r} label={r === 0 ? 'All' : `${r}+ ⭐`}
                  selected={rating === r} onPress={() => setRating(r)} variant="filter" size="sm" />
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button variant="primary" size="lg" fullWidth onPress={handleApply}>
            Apply Filters {hasFilters && `(${selectedCategories.length + selectedRegions.length + (rating > 0 ? 1 : 0)})`}
          </Button>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  content: { flex: 1, paddingHorizontal: spacing.lg },
  section: { paddingVertical: spacing.md },
  sectionTitle: { marginBottom: spacing.sm },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  ratingRow: { flexDirection: 'row', gap: spacing.sm },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
});

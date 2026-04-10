import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  ThemedView,
  ThemedText,
  Heading2,
  Caption,
  Card,
  Avatar,
  StarRating,
  EmptySaved,
} from '@/components';
import { useColors } from '@/hooks';
import { spacing } from '@/constants';

const MOCK_SAVED = [
  { id: '1', vendorName: 'Royal Events GH', category: 'Decoration', rating: 4.8, location: 'Accra', savedAt: '2026-04-05' },
  { id: '2', vendorName: 'DJ Firestone', category: 'Music & DJ', rating: 4.9, location: 'Accra', savedAt: '2026-04-02' },
  { id: '3', vendorName: 'Sweet Treats Bakery', category: 'Catering', rating: 4.6, location: 'Kumasi', savedAt: '2026-03-28' },
];

export default function SavedScreen() {
  const colors = useColors();

  return (
    <ThemedView>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Heading2>Saved Vendors</Heading2>
        </View>

        {MOCK_SAVED.length === 0 ? (
          <EmptySaved />
        ) : (
          <FlatList
            data={MOCK_SAVED}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Card
                onPress={() => {}}
                padding="md"
                radius="lg"
                style={styles.vendorCard}
              >
                <View style={styles.vendorRow}>
                  <Avatar name={item.vendorName} size={52} />
                  <View style={styles.vendorInfo}>
                    <ThemedText variant="bodySmall" weight="600">{item.vendorName}</ThemedText>
                    <Caption color="textMuted">{item.category} • {item.location}</Caption>
                    <StarRating rating={item.rating} size={12} showLabel />
                  </View>
                  <TouchableOpacity style={styles.heartButton}>
                    <Ionicons name="heart" size={22} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </Card>
            )}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  vendorCard: {},
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  vendorInfo: {
    flex: 1,
  },
  heartButton: {
    padding: spacing.xs,
  },
});

import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  ThemedView,
  ThemedText,
  Heading2,
  BodySmall,
  Caption,
  Card,
  Badge,
  EmptyBookings,
  SkeletonList,
} from '@/components';
import { useColors } from '@/hooks';
import { spacing, radii } from '@/constants';

type FilterTab = 'all' | 'upcoming' | 'active' | 'completed' | 'cancelled';

const MOCK_BOOKINGS = [
  {
    id: '1',
    vendorName: 'Royal Events GH',
    service: 'Decoration',
    date: '2026-05-15',
    status: 'confirmed' as const,
    amount: 'GH₵ 5,000',
  },
  {
    id: '2',
    vendorName: 'DJ Firestone',
    service: 'DJ & Sound System',
    date: '2026-04-20',
    status: 'completed' as const,
    amount: 'GH₵ 3,000',
  },
  {
    id: '3',
    vendorName: 'Sweet Treats Bakery',
    service: 'Wedding Cake',
    date: '2026-06-10',
    status: 'pending' as const,
    amount: 'GH₵ 1,500',
  },
];

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

function getBadgeVariant(status: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  switch (status) {
    case 'confirmed': return 'info';
    case 'completed': return 'success';
    case 'pending': return 'warning';
    case 'cancelled': return 'error';
    default: return 'default';
  }
}

export default function BookingsScreen() {
  const colors = useColors();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const filteredBookings = activeFilter === 'all'
    ? MOCK_BOOKINGS
    : MOCK_BOOKINGS.filter((b) => b.status === activeFilter || (activeFilter === 'upcoming' && b.status === 'confirmed'));

  return (
    <ThemedView>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Heading2>My Bookings</Heading2>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <FlatList
            data={FILTER_TABS}
            keyExtractor={(item) => item.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterTab,
                  {
                    backgroundColor: activeFilter === item.key ? colors.primary : colors.surface,
                    borderColor: activeFilter === item.key ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setActiveFilter(item.key)}
              >
                <ThemedText
                  variant="bodySmall"
                  color={activeFilter === item.key ? 'white' : 'textMuted'}
                  weight="600"
                >
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            )}
          />
        </View>

        {filteredBookings.length === 0 ? (
          <EmptyBookings onRefresh={() => {}} />
        ) : (
          <FlatList
            data={filteredBookings}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Card
                onPress={() => router.push(`/booking/${item.id}` as any)}
                padding="md"
                radius="lg"
                style={styles.bookingCard}
              >
                <View style={styles.bookingHeader}>
                  <ThemedText variant="bodySmall" weight="600">
                    {item.vendorName}
                  </ThemedText>
                  <Badge label={item.status} variant={getBadgeVariant(item.status)} />
                </View>
                <Caption color="textMuted">{item.service}</Caption>
                <View style={styles.bookingFooter}>
                  <View style={styles.bookingMeta}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                    <Caption color="textMuted">{item.date}</Caption>
                  </View>
                  <ThemedText variant="bodySmall" color="primary" weight="600">
                    {item.amount}
                  </ThemedText>
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
  filterContainer: {
    marginBottom: spacing.md,
  },
  filterList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  bookingCard: {},
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  bookingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});

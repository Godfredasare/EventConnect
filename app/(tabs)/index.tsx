import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ThemedView,
  ThemedText,
  Heading2,
  Heading3,
  BodySmall,
  Caption,
  Card,
  Button,
  Chip,
  Avatar,
  StarRating,
  Badge,
  SkeletonCard,
} from '@/components';
import { useColors } from '@/hooks';
import { spacing, radii, EVENT_CATEGORIES } from '@/constants';
import { useAuthStore } from '@/store';

// --- Mock Data ---
const FEATURED_VENDORS = [
  { id: '1', name: 'Royal Events GH', category: 'Decoration', rating: 4.8, reviewCount: 124, slug: 'royal-events-gh', location: 'Accra', priceRange: 'GH₵ 2,000 - 15,000', image: null },
  { id: '2', name: 'Sweet Treats Bakery', category: 'Catering', rating: 4.6, reviewCount: 89, slug: 'sweet-treats-bakery', location: 'Kumasi', priceRange: 'GH₵ 500 - 5,000', image: null },
  { id: '3', name: 'DJ Firestone', category: 'Music & DJ', rating: 4.9, reviewCount: 203, slug: 'dj-firestone', location: 'Accra', priceRange: 'GH₵ 1,500 - 8,000', image: null },
  { id: '4', name: 'Lens Perfect Studios', category: 'Photography', rating: 4.7, reviewCount: 167, slug: 'lens-perfect-studios', location: 'Tamale', priceRange: 'GH₵ 1,000 - 10,000', image: null },
];

const POPULAR_SERVICES = [
  { id: '1', name: 'Wedding Planning', vendorCount: 45, icon: '💍' },
  { id: '2', name: 'Event Photography', vendorCount: 38, icon: '📷' },
  { id: '3', name: 'Catering Services', vendorCount: 52, icon: '🍽️' },
  { id: '4', name: 'DJ & Sound', vendorCount: 31, icon: '🎧' },
];

export default function HomeScreen() {
  const colors = useColors();
  const user = useAuthStore((s) => s.user);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ThemedView>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Caption color="textMuted">Welcome back 👋</Caption>
            <Heading2>
              {user?.full_name || 'Discover'}
            </Heading2>
          </View>
          <TouchableOpacity
            style={[styles.avatarButton, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Avatar name={user?.full_name} size={40} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search vendors, services..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          {/* Categories */}
          <View style={styles.section}>
            <Heading3 style={styles.sectionTitle}>Categories</Heading3>
            <FlatList
              data={EVENT_CATEGORIES.slice(0, 8)}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipList}
              renderItem={({ item }) => (
                <Chip
                  label={item.name}
                  leftIcon={<ThemedText>{item.icon}</ThemedText>}
                  selected={selectedCategory === item.id}
                  onPress={() =>
                    setSelectedCategory(selectedCategory === item.id ? null : item.id)
                  }
                  variant="filter"
                  size="sm"
                />
              )}
            />
          </View>

          {/* Popular Services */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Heading3>Popular Services</Heading3>
              <TouchableOpacity>
                <BodySmall color="primary">See All</BodySmall>
              </TouchableOpacity>
            </View>
            <View style={styles.servicesGrid}>
              {POPULAR_SERVICES.map((service) => (
                <Card
                  key={service.id}
                  onPress={() => {}}
                  padding="sm"
                  radius="md"
                  style={styles.serviceCard}
                >
                  <ThemedText style={{ fontSize: 28 }}>{service.icon}</ThemedText>
                  <ThemedText variant="bodySmall" weight="600" style={{ marginTop: 6 }}>
                    {service.name}
                  </ThemedText>
                  <Caption color="textMuted">{service.vendorCount} vendors</Caption>
                </Card>
              ))}
            </View>
          </View>

          {/* Featured Vendors */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Heading3>Featured Vendors</Heading3>
              <TouchableOpacity>
                <BodySmall color="primary">See All</BodySmall>
              </TouchableOpacity>
            </View>
            <FlatList
              data={FEATURED_VENDORS}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.vendorList}
              renderItem={({ item }) => (
                <Card
                  onPress={() => router.push(`/vendor/${item.slug}` as any)}
                  padding="none"
                  radius="lg"
                  style={styles.vendorCard}
                >
                  <View style={[styles.vendorImage, { backgroundColor: colors.border }]}>
                    <ThemedText style={{ fontSize: 32 }}>📸</ThemedText>
                  </View>
                  <View style={styles.vendorInfo}>
                    <ThemedText variant="bodySmall" weight="600" numberOfLines={1}>
                      {item.name}
                    </ThemedText>
                    <Caption color="textMuted">{item.location}</Caption>
                    <StarRating rating={item.rating} size={12} showLabel reviewCount={item.reviewCount} />
                    <Caption color="textMuted" style={{ marginTop: 4 }}>
                      {item.priceRange}
                    </Caption>
                  </View>
                </Card>
              )}
            />
          </View>

          {/* CTA Banner */}
          <Card
            style={[styles.ctaBanner, { backgroundColor: colors.primary }]}
            padding="lg"
            radius="lg"
          >
            <Heading3 color="white">Are you a vendor?</Heading3>
            <ThemedText variant="bodySmall" color="white" style={{ opacity: 0.9, marginTop: 4 }}>
              List your services and reach thousands of event planners across Ghana.
            </ThemedText>
            <Button
              variant="secondary"
              size="sm"
              style={{ marginTop: spacing.md, alignSelf: 'flex-start' }}
              onPress={() => {}}
            >
              Get Started
            </Button>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  avatarButton: {
    borderRadius: radii.full,
    overflow: 'hidden',
    borderWidth: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  chipList: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  serviceCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  vendorList: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  vendorCard: {
    width: 220,
    overflow: 'hidden',
  },
  vendorImage: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendorInfo: {
    padding: spacing.md,
  },
  ctaBanner: {
    marginBottom: spacing.xl,
  },
});

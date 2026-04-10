import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ThemedView, ThemedText, Heading1, Heading2, Heading3, BodySmall, Caption,
  Card, Button, Chip, Avatar, StarRating, Badge, Divider, Skeleton, EmptyState,
} from '@/components';
import { useColors } from '@/hooks';
import { spacing, radii } from '@/constants';
import { formatCurrency } from '@/lib';

const MOCK_VENDOR = {
  id: '1',
  business_name: 'Royal Events GH',
  slug: 'royal-events-gh',
  description: 'Royal Events GH is a premier event decoration and planning company based in Accra. With over 10 years of experience, we specialize in creating breathtaking weddings, corporate events, birthday celebrations, and cultural ceremonies across Ghana.',
  category: 'Decoration',
  location: 'Osu, Accra',
  rating: 4.8,
  review_count: 124,
  is_verified: true,
  min_price: 2000,
  max_price: 15000,
  service_areas: ['Greater Accra', 'Ashanti', 'Central', 'Eastern'],
  avatar_url: null,
};

const MOCK_SERVICES = [
  { id: '1', name: 'Full Wedding Decoration', price: 8000, duration: 'Full Day' },
  { id: '2', name: 'Birthday Party Setup', price: 2000, duration: '4 Hours' },
  { id: '3', name: 'Corporate Event Styling', price: 5000, duration: 'Full Day' },
  { id: '4', name: 'Floral Arrangements', price: 1500, duration: '3 Hours' },
];

const MOCK_REVIEWS = [
  { id: '1', reviewer_name: 'Ama Mensah', rating: 5, comment: 'Absolutely stunning decoration! Royal Events transformed our wedding venue into a fairy tale. Highly recommended!', date: '2026-03-15' },
  { id: '2', reviewer_name: 'Kwame Asante', rating: 4, comment: 'Great service and professional team. The setup was beautiful and timely.', date: '2026-02-28' },
];

export default function VendorDetailScreen() {
  const colors = useColors();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'about'>('services');
  const [isSaved, setIsSaved] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${MOCK_VENDOR.business_name} on EventConnect! ${MOCK_VENDOR.description.slice(0, 100)}...`,
      });
    } catch {}
  };

  return (
    <ThemedView>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Image Placeholder */}
        <View style={[styles.cover, { backgroundColor: colors.surface }]}>
          <SafeAreaView edges={['top']}>
            <View style={styles.coverActions}>
              <TouchableOpacity style={styles.coverButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <TouchableOpacity style={styles.coverButton} onPress={handleShare}>
                  <Ionicons name="share-outline" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.coverButton} onPress={() => setIsSaved(!isSaved)}>
                  <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={20} color={isSaved ? colors.error : '#FFFFFF'} />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
          <ThemedText style={{ fontSize: 64 }}>💐</ThemedText>
        </View>

        {/* Vendor Info */}
        <View style={styles.vendorInfo}>
          <View style={styles.vendorHeader}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Heading2>{MOCK_VENDOR.business_name}</Heading2>
                {MOCK_VENDOR.is_verified && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
                )}
              </View>
              <Caption color="textMuted">{MOCK_VENDOR.category} • {MOCK_VENDOR.location}</Caption>
              <StarRating rating={MOCK_VENDOR.rating} size={14} showLabel reviewCount={MOCK_VENDOR.review_count} />
            </View>
            <Avatar name={MOCK_VENDOR.business_name} size={56} />
          </View>

          <View style={styles.priceRange}>
            <BodySmall color="textMuted">Price Range</BodySmall>
            <ThemedText variant="bodySmall" color="primary" weight="600">
              {formatCurrency(MOCK_VENDOR.min_price)} – {formatCurrency(MOCK_VENDOR.max_price)}
            </ThemedText>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ThemedText variant="heading3" color="primary">{MOCK_VENDOR.review_count}</ThemedText>
              <Caption color="textMuted">Reviews</Caption>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <ThemedText variant="heading3" color="primary">{MOCK_VENDOR.rating}</ThemedText>
              <Caption color="textMuted">Rating</Caption>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <ThemedText variant="heading3" color="primary">{MOCK_VENDOR.service_areas.length}</ThemedText>
              <Caption color="textMuted">Regions</Caption>
            </View>
          </View>

          <Divider />

          {/* Tabs */}
          <View style={styles.tabs}>
            {(['services', 'reviews', 'about'] as const).map((tab) => (
              <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
                <ThemedText
                  variant="bodySmall"
                  color={activeTab === tab ? 'primary' : 'textMuted'}
                  weight={activeTab === tab ? '600' : '400'}
                  style={{ paddingBottom: spacing.sm, borderBottomWidth: activeTab === tab ? 2 : 0, borderBottomColor: colors.primary }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'services' && (
            <View style={styles.tabContent}>
              {MOCK_SERVICES.map((service) => (
                <Card key={service.id} padding="md" radius="md" style={styles.serviceCard}>
                  <View style={{ flex: 1 }}>
                    <ThemedText variant="bodySmall" weight="600">{service.name}</ThemedText>
                    <Caption color="textMuted">{service.duration}</Caption>
                  </View>
                  <ThemedText variant="bodySmall" color="primary" weight="700">{formatCurrency(service.price)}</ThemedText>
                </Card>
              ))}
            </View>
          )}

          {activeTab === 'reviews' && (
            <View style={styles.tabContent}>
              {MOCK_REVIEWS.map((review) => (
                <Card key={review.id} padding="md" radius="md" style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Avatar name={review.reviewer_name} size={36} />
                    <View style={{ flex: 1, marginLeft: spacing.sm }}>
                      <ThemedText variant="bodySmall" weight="600">{review.reviewer_name}</ThemedText>
                      <Caption color="textMuted">{review.date}</Caption>
                    </View>
                  </View>
                  <StarRating rating={review.rating} size={12} />
                  <BodySmall color="textMuted" style={{ marginTop: spacing.xs }}>{review.comment}</BodySmall>
                </Card>
              ))}
            </View>
          )}

          {activeTab === 'about' && (
            <View style={styles.tabContent}>
              <ThemedText variant="body" style={{ lineHeight: 26 }}>{MOCK_VENDOR.description}</ThemedText>
              <ThemedText variant="bodySmall" weight="600" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>Service Areas</ThemedText>
              <View style={styles.chipGrid}>
                {MOCK_VENDOR.service_areas.map((area) => (
                  <Chip key={area} label={area} size="sm" />
                ))}
              </View>
            </View>
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <BodySmall color="textMuted">Starting from</BodySmall>
          <ThemedText variant="heading3" color="primary">{formatCurrency(MOCK_VENDOR.min_price)}</ThemedText>
        </View>
        <Button variant="primary" size="lg" onPress={() => {}} style={{ flex: 1 }}>
          Book Now
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  cover: { height: 200, alignItems: 'center', justifyContent: 'center' },
  coverActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  coverButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vendorInfo: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  vendorHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  priceRange: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md, padding: spacing.md, backgroundColor: 'rgba(124, 58, 237, 0.08)', borderRadius: radii.md },
  statsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 40 },
  tabs: { flexDirection: 'row', gap: spacing.xl, paddingTop: spacing.md },
  tab: {},
  tabContent: { paddingTop: spacing.md, gap: spacing.sm },
  serviceCard: { flexDirection: 'row', alignItems: 'center' },
  reviewCard: {},
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
  },
});

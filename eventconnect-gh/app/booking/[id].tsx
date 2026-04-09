import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ThemedView, ThemedText, Heading2, Heading3, BodySmall, Caption,
  Card, Button, Badge, Avatar, Divider, StarRating,
} from '@/components';
import { useColors } from '@/hooks';
import { spacing, radii } from '@/constants';
import { formatCurrency, formatDate } from '@/lib';

const MOCK_BOOKING = {
  id: '1',
  vendorName: 'Royal Events GH',
  service: 'Full Wedding Decoration',
  event_date: '2026-05-15',
  event_time: '08:00',
  event_location: 'The Grand Arena, Accra',
  status: 'confirmed' as const,
  total_amount: 8000,
  currency: 'GHS',
  notes: 'Please include floral centerpieces for 20 tables. Theme: Royal Purple & Gold.',
  created_at: '2026-04-01T10:00:00Z',
  vendorAvatar: null,
  vendorRating: 4.8,
  vendorReviewCount: 124,
};

function getStatusColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  switch (status) {
    case 'confirmed': return 'info';
    case 'completed': return 'success';
    case 'pending': return 'warning';
    case 'cancelled': return 'error';
    case 'in_progress': return 'info';
    default: return 'default';
  }
}

export default function BookingDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ThemedView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top']}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Heading2 style={{ flex: 1, textAlign: 'center' }}>Booking Details</Heading2>
            <View style={{ width: 32 }} />
          </View>
        </SafeAreaView>

        <View style={styles.content}>
          {/* Status Badge */}
          <View style={styles.statusRow}>
            <Badge label={MOCK_BOOKING.status.replace('_', ' ').toUpperCase()} variant={getStatusColor(MOCK_BOOKING.status)} size="md" />
            <Caption color="textMuted">Booked on {formatDate(MOCK_BOOKING.created_at)}</Caption>
          </View>

          {/* Vendor Info */}
          <Card padding="md" radius="lg" onPress={() => router.push('/vendor/royal-events-gh' as any)} style={{ marginBottom: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <Avatar name={MOCK_BOOKING.vendorName} size={48} />
              <View style={{ flex: 1 }}>
                <ThemedText variant="bodySmall" weight="600">{MOCK_BOOKING.vendorName}</ThemedText>
                <StarRating rating={MOCK_BOOKING.vendorRating} size={12} showLabel reviewCount={MOCK_BOOKING.vendorReviewCount} />
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </View>
          </Card>

          {/* Event Details */}
          <Card padding="lg" radius="lg" style={{ marginBottom: spacing.md }}>
            <ThemedText variant="bodySmall" weight="600" style={{ marginBottom: spacing.md }}>Event Details</ThemedText>

            {[
              { icon: 'gift-outline', label: 'Service', value: MOCK_BOOKING.service },
              { icon: 'calendar-outline', label: 'Date', value: formatDate(MOCK_BOOKING.event_date) },
              { icon: 'time-outline', label: 'Time', value: '8:00 AM' },
              { icon: 'location-outline', label: 'Venue', value: MOCK_BOOKING.event_location },
            ].map((item, index) => (
              <View key={index} style={styles.detailRow}>
                <Ionicons name={item.icon as any} size={18} color={colors.textMuted} style={{ width: 24 }} />
                <BodySmall color="textMuted" style={{ width: 70 }}>{item.label}</BodySmall>
                <ThemedText variant="bodySmall" style={{ flex: 1 }}>{item.value}</ThemedText>
              </View>
            ))}

            {MOCK_BOOKING.notes && (
              <View style={styles.notesSection}>
                <ThemedText variant="caption" color="textMuted">Notes</ThemedText>
                <BodySmall>{MOCK_BOOKING.notes}</BodySmall>
              </View>
            )}
          </Card>

          {/* Payment Summary */}
          <Card padding="lg" radius="lg" style={{ marginBottom: spacing.md }}>
            <ThemedText variant="bodySmall" weight="600" style={{ marginBottom: spacing.md }}>Payment Summary</ThemedText>
            <View style={styles.detailRow}>
              <BodySmall color="textMuted">Subtotal</BodySmall>
              <ThemedText variant="bodySmall">{formatCurrency(MOCK_BOOKING.total_amount)}</ThemedText>
            </View>
            <View style={styles.detailRow}>
              <BodySmall color="textMuted">Service Fee</BodySmall>
              <ThemedText variant="bodySmall">{formatCurrency(MOCK_BOOKING.total_amount * 0.05)}</ThemedText>
            </View>
            <Divider />
            <View style={styles.detailRow}>
              <ThemedText variant="bodySmall" weight="700">Total</ThemedText>
              <ThemedText variant="heading3" color="primary">{formatCurrency(MOCK_BOOKING.total_amount * 1.05)}</ThemedText>
            </View>
          </Card>

          {/* Actions */}
          <View style={styles.actions}>
            <Button variant="primary" size="lg" fullWidth onPress={() => router.push('/(modals)/payment' as any)} style={{ marginBottom: spacing.sm }}>
              Make Payment
            </Button>
            <Button variant="ghost" size="md" fullWidth leftIcon={<Ionicons name="chatbubble-outline" size={18} color={colors.primary} />} onPress={() => router.push('/chat/1' as any)}>
              Message Vendor
            </Button>
            <Button variant="danger" size="md" fullWidth onPress={() => {}} style={{ marginTop: spacing.sm }}>
              Cancel Booking
            </Button>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  backButton: { padding: spacing.xs },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs, gap: spacing.sm },
  notesSection: { marginTop: spacing.md, padding: spacing.md, backgroundColor: 'rgba(124, 58, 237, 0.05)', borderRadius: radii.sm },
  actions: { marginTop: spacing.md, gap: spacing.xs },
});

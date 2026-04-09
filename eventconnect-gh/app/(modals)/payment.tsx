import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ThemedView, ThemedText, Heading3, BodySmall, Card, Button, Divider, Badge } from '@/components';
import { useColors } from '@/hooks';
import { spacing, radii } from '@/constants';
import { formatCurrency } from '@/lib';

export default function PaymentModal() {
  const colors = useColors();
  const [method, setMethod] = useState<'mobile_money' | 'card'>('mobile_money');
  const [processing, setProcessing] = useState(false);

  const MOCK_BOOKING = {
    vendorName: 'Royal Events GH',
    service: 'Wedding Decoration',
    date: 'May 15, 2026',
    amount: 5000,
  };

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      Alert.alert('Payment Successful', `You have paid ${formatCurrency(MOCK_BOOKING.amount)} to ${MOCK_BOOKING.vendorName}.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 2000);
  };

  return (
    <ThemedView>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={{ padding: spacing.sm }} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText variant="heading3">Payment</ThemedText>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.content}>
          {/* Order Summary */}
          <Card padding="lg" radius="lg" style={{ marginBottom: spacing.lg }}>
            <ThemedText variant="bodySmall" weight="600">Order Summary</ThemedText>
            <Divider />
            <View style={styles.summaryRow}>
              <BodySmall color="textMuted">Vendor</BodySmall>
              <BodySmall weight="600">{MOCK_BOOKING.vendorName}</BodySmall>
            </View>
            <View style={styles.summaryRow}>
              <BodySmall color="textMuted">Service</BodySmall>
              <BodySmall>{MOCK_BOOKING.service}</BodySmall>
            </View>
            <View style={styles.summaryRow}>
              <BodySmall color="textMuted">Date</BodySmall>
              <BodySmall>{MOCK_BOOKING.date}</BodySmall>
            </View>
            <Divider />
            <View style={styles.summaryRow}>
              <ThemedText variant="bodySmall" weight="700">Total</ThemedText>
              <ThemedText variant="heading3" color="primary">
                {formatCurrency(MOCK_BOOKING.amount)}
              </ThemedText>
            </View>
          </Card>

          {/* Payment Methods */}
          <ThemedText variant="bodySmall" weight="600" style={{ marginBottom: spacing.sm }}>Payment Method</ThemedText>
          <Card padding="md" radius="md" onPress={() => setMethod('mobile_money')}
            style={[styles.methodCard, method === 'mobile_money' && { borderColor: colors.primary, borderWidth: 2 }]}>
            <Ionicons name="phone-portrait" size={24} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <ThemedText variant="bodySmall" weight="600">Mobile Money</ThemedText>
              <ThemedText variant="caption" color="textMuted">MTN MoMo, Vodafone Cash, AirtelTigo</ThemedText>
            </View>
            {method === 'mobile_money' && (
              <View style={[styles.radioDot, { backgroundColor: colors.primary }]}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF' }} />
              </View>
            )}
          </Card>
          <Card padding="md" radius="md" onPress={() => setMethod('card')}
            style={[styles.methodCard, method === 'card' && { borderColor: colors.primary, borderWidth: 2 }]}>
            <Ionicons name="card" size={24} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <ThemedText variant="bodySmall" weight="600">Debit/Credit Card</ThemedText>
              <ThemedText variant="caption" color="textMuted">Visa, Mastercard</ThemedText>
            </View>
            {method === 'card' && (
              <View style={[styles.radioDot, { backgroundColor: colors.primary }]}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF' }} />
              </View>
            )}
          </Card>

          {/* Secure Note */}
          <View style={styles.secureNote}>
            <Ionicons name="lock-closed" size={14} color={colors.accent} />
            <ThemedText variant="caption" color="textMuted">
              Payments are secured by Paystack. Your card details are encrypted.
            </ThemedText>
          </View>
        </View>

        <View style={styles.footer}>
          <Button variant="primary" size="lg" fullWidth onPress={handlePay} loading={processing}>
            Pay {formatCurrency(MOCK_BOOKING.amount)}
          </Button>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  content: { flex: 1, paddingHorizontal: spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  methodCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  radioDot: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  secureNote: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md, paddingVertical: spacing.sm },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
});

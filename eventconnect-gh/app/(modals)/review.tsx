import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  ThemedView, ThemedText, Heading3, BodySmall, Button, Input, StarRating, Card, Divider,
} from '@/components';
import { useColors, useHaptics } from '@/hooks';
import { spacing, radii } from '@/constants';

export default function ReviewModal() {
  const colors = useColors();
  const { trigger } = useHaptics();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRatingChange = (value: number) => {
    setRating(value);
    trigger('selection');
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      trigger('success');
      router.back();
    }, 1000);
  };

  return (
    <ThemedView>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={{ padding: spacing.sm }} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <ThemedText variant="heading3">Write a Review</ThemedText>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.content}>
          <Card padding="lg" radius="lg" style={{ marginBottom: spacing.lg }}>
            <View style={styles.vendorRow}>
              <ThemedText style={{ fontSize: 32 }}>💐</ThemedText>
              <View>
                <ThemedText variant="bodySmall" weight="600">Royal Events GH</ThemedText>
                <BodySmall color="textMuted">Wedding Decoration</BodySmall>
              </View>
            </View>
          </Card>

          {/* Star Rating */}
          <View style={styles.ratingSection}>
            <ThemedText variant="bodySmall" weight="600" style={{ marginBottom: spacing.md }}>
              How was your experience?
            </ThemedText>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => handleRatingChange(star)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={40}
                    color={star <= rating ? colors.warning : colors.border}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <ThemedText variant="caption" color="textMuted" align="center" style={{ marginTop: spacing.sm }}>
              {rating === 0 ? 'Tap to rate' : rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
            </ThemedText>
          </View>

          <Divider />

          <Input
            value={comment}
            onChangeText={setComment}
            placeholder="Share details about your experience..."
            label="Your Review (Optional)"
            multiline
            numberOfLines={4}
          />

          {/* Quick Tags */}
          <View style={styles.tagsContainer}>
            {['Professional', 'Punctual', 'Creative', 'Good Value', 'Friendly', 'High Quality'].map((tag) => (
              <ThemedText
                key={tag}
                variant="caption"
                style={[styles.tag, { backgroundColor: colors.surface, color: colors.textMuted, borderColor: colors.border }]}
              >
                {tag}
              </ThemedText>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button variant="primary" size="lg" fullWidth onPress={handleSubmit} loading={submitting} disabled={rating === 0}>
            Submit Review
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
  vendorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  ratingSection: { alignItems: 'center', marginBottom: spacing.md },
  starsContainer: { flexDirection: 'row', gap: spacing.sm },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.full, borderWidth: 1 },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
});

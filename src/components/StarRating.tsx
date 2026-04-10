// ============================================================
// EventConnect GH – StarRating
// ============================================================
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks';
import { spacing } from '@/constants';
import { Caption } from './ThemedText';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showLabel?: boolean;
  reviewCount?: number;
  style?: any;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  showLabel = false,
  reviewCount,
  style,
}: StarRatingProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, style]}>
      <View style={{ flexDirection: 'row', gap: 2 }}>
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Ionicons
              key={i}
              name={filled ? 'star' : half ? 'star-half' : 'star-outline'}
              size={size}
              color={filled || half ? colors.warning : colors.border}
            />
          );
        })}
      </View>
      {showLabel && (
        <Caption color="textMuted">
          {rating.toFixed(1)}{reviewCount !== undefined ? ` (${reviewCount})` : ''}
        </Caption>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});

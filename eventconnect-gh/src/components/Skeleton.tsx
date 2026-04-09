// ============================================================
// EventConnect GH – Skeleton (Loading Placeholder)
// ============================================================
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, ViewStyle } from 'react-native';
import { useColors } from '@/hooks';
import { radii } from '@/constants';
import type { SkeletonProps } from '@/types';

export function Skeleton({
  variant = 'rect',
  width = '100%',
  height = 20,
  style,
}: SkeletonProps) {
  const colors = useColors();
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerValue]);

  const interpolated = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const baseStyle: ViewStyle = {
    width,
    height,
    borderRadius: variant === 'circle' ? 9999 : radii.sm,
    backgroundColor: colors.border,
    overflow: 'hidden',
  };

  const shimmerStyle = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.textMuted,
    opacity: interpolated,
  };

  return (
    <View style={[baseStyle, style]}>
      <Animated.View style={shimmerStyle} />
    </View>
  );
}

// ---------- Preset Skeleton Components ----------

export function SkeletonCard() {
  return (
    <View style={styles.cardContainer}>
      <Skeleton variant="rect" width="100%" height={140} />
      <View style={styles.cardContent}>
        <Skeleton variant="rect" width="60%" height={18} style={{ marginTop: 12 }} />
        <Skeleton variant="rect" width="80%" height={14} style={{ marginTop: 8 }} />
        <Skeleton variant="rect" width="40%" height={14} style={{ marginTop: 4 }} />
      </View>
    </View>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View style={{ gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.listItem}>
          <Skeleton variant="circle" width={48} height={48} />
          <View style={styles.listItemContent}>
            <Skeleton variant="rect" width="60%" height={16} />
            <Skeleton variant="rect" width="80%" height={12} style={{ marginTop: 6 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  cardContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  listItemContent: {
    flex: 1,
  },
});

// ============================================================
// EventConnect GH – EmptyState
// ============================================================
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColors } from '@/hooks';
import { spacing, radii } from '@/constants';
import { ThemedText, Heading3, BodyText, ButtonText } from './ThemedText';
import { Button } from './Button';

interface EmptyStateProps {
  /** An emoji or icon component for the illustration */
  icon?: React.ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Button label */
  actionLabel?: string;
  /** Button callback */
  onAction?: () => void;
  /** Custom button variant */
  actionVariant?: 'primary' | 'secondary';
  style?: any;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = 'primary',
  style,
}: EmptyStateProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}

      <Heading3 style={styles.title}>{title}</Heading3>

      {description && (
        <BodyText color="textMuted" align="center" style={styles.description}>
          {description}
        </BodyText>
      )}

      {actionLabel && onAction && (
        <Button
          variant={actionVariant}
          onPress={onAction}
          size="md"
          style={styles.action}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

// ---------- Common preset empty states ----------

export function EmptyBookings({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      icon={<ThemedText style={{ fontSize: 48 }}>📋</ThemedText>}
      title="No Bookings Yet"
      description="When you book a vendor, your bookings will appear here. Start exploring to find the perfect service for your event."
      actionLabel="Browse Vendors"
      onAction={onRefresh}
    />
  );
}

export function EmptyMessages({ onNewChat }: { onNewChat?: () => void }) {
  return (
    <EmptyState
      icon={<ThemedText style={{ fontSize: 48 }}>💬</ThemedText>}
      title="No Messages"
      description="Your conversations with vendors will appear here. Start chatting when you make a booking."
      actionLabel="Start Exploring"
      onAction={onNewChat}
    />
  );
}

export function EmptySaved({ onBrowse }: { onBrowse?: () => void }) {
  return (
    <EmptyState
      icon={<ThemedText style={{ fontSize: 48 }}>❤️</ThemedText>}
      title="No Saved Vendors"
      description="Tap the heart icon on a vendor's profile to save them here for easy access later."
      actionLabel="Discover Vendors"
      onAction={onBrowse}
    />
  );
}

export function EmptySearchResults({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      icon={<ThemedText style={{ fontSize: 48 }}>🔍</ThemedText>}
      title="No Results Found"
      description="Try adjusting your search or filters to find what you're looking for."
      actionLabel="Clear Filters"
      onAction={onClear}
      actionVariant="secondary"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['3xl'],
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: spacing.lg,
  },
  action: {
    marginTop: spacing.sm,
  },
});

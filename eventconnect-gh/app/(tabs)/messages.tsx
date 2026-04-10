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
  EmptyMessages,
  Badge,
} from '@/components';
import { useColors } from '@/hooks';
import { spacing } from '@/constants';
import { formatRelativeTime } from '@/lib';

const MOCK_CONVERSATIONS = [
  {
    id: '1',
    otherUser: { id: 'v1', full_name: 'Royal Events GH', avatar_url: null },
    lastMessage: 'Thank you for choosing us! We will send you a detailed proposal shortly.',
    unreadCount: 2,
    updatedAt: '2026-04-09T10:30:00Z',
  },
  {
    id: '2',
    otherUser: { id: 'v2', full_name: 'DJ Firestone', avatar_url: null },
    lastMessage: 'Can you confirm the event date and venue?',
    unreadCount: 0,
    updatedAt: '2026-04-08T14:20:00Z',
  },
  {
    id: '3',
    otherUser: { id: 'v3', full_name: 'Lens Perfect Studios', avatar_url: null },
    lastMessage: 'The photos from your event are ready for review!',
    unreadCount: 1,
    updatedAt: '2026-04-07T09:15:00Z',
  },
];

export default function MessagesScreen() {
  const colors = useColors();

  return (
    <ThemedView>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Heading2>Messages</Heading2>
          <TouchableOpacity>
            <Ionicons name="create-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {MOCK_CONVERSATIONS.length === 0 ? (
          <EmptyMessages />
        ) : (
          <FlatList
            data={MOCK_CONVERSATIONS}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Card
                onPress={() => router.push(`/chat/${item.id}` as any)}
                padding="md"
                radius="lg"
                style={styles.conversationCard}
              >
                <Avatar name={item.otherUser.full_name} size={52} />
                <View style={styles.conversationContent}>
                  <View style={styles.conversationHeader}>
                    <ThemedText variant="bodySmall" weight="600" numberOfLines={1} style={{ flex: 1 }}>
                      {item.otherUser.full_name}
                    </ThemedText>
                    <Caption color="textMuted" style={styles.timeText}>
                      {formatRelativeTime(item.updatedAt)}
                    </Caption>
                  </View>
                  <View style={styles.messageRow}>
                    <Caption color="textMuted" numberOfLines={1} style={{ flex: 1 }}>
                      {item.lastMessage}
                    </Caption>
                    {item.unreadCount > 0 && (
                      <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                        <ThemedText variant="caption" color="white">
                          {item.unreadCount}
                        </ThemedText>
                      </View>
                    )}
                  </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  conversationContent: {
    flex: 1,
    overflow: 'hidden',
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 11,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
});

import React, { useState, useRef, useEffect } from 'react';
import {
  View, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedView, ThemedText, Avatar, Card, Caption } from '@/components';
import { useColors } from '@/hooks';
import { spacing, radii } from '@/constants';
import { formatRelativeTime } from '@/lib';

const MOCK_MESSAGES = [
  { id: '1', sender_id: 'v1', content: 'Hello! Thank you for choosing Royal Events GH. We received your booking request.', created_at: '2026-04-09T10:00:00Z' },
  { id: '2', sender_id: 'me', content: 'Hi! Yes, I need decoration for a wedding on May 15th. The venue is The Grand Arena.', created_at: '2026-04-09T10:05:00Z' },
  { id: '3', sender_id: 'v1', content: 'Great choice! We have experience with that venue. Our Royal Purple & Gold package would be perfect for you. Should I send you a detailed proposal?', created_at: '2026-04-09T10:10:00Z' },
  { id: '4', sender_id: 'me', content: 'Yes please! Also, can you include floral centerpieces for 20 tables?', created_at: '2026-04-09T10:15:00Z' },
  { id: '5', sender_id: 'v1', content: "Absolutely! We'll include 20 premium floral centerpieces. I'll send the proposal with pricing by end of day.", created_at: '2026-04-09T10:20:00Z' },
];

const CURRENT_USER_ID = 'me';
const OTHER_USER = { id: 'v1', full_name: 'Royal Events GH', avatar_url: null };

export default function ChatScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessage('');
  };

  const renderMessage = ({ item }: { item: typeof MOCK_MESSAGES[0] }) => {
    const isMine = item.sender_id === CURRENT_USER_ID;
    return (
      <View style={[styles.messageRow, isMine ? styles.myMessageRow : styles.theirMessageRow]}>
        {!isMine && <Avatar name={OTHER_USER.full_name} size={32} />}
        <View
          style={[
            styles.messageBubble,
            isMine
              ? { backgroundColor: colors.primary }
              : { backgroundColor: colors.surface },
          ]}
        >
          <ThemedText
            variant="bodySmall"
            color={isMine ? 'white' : 'text'}
            style={{ lineHeight: 22 }}
          >
            {item.content}
          </ThemedText>
          <Caption
            color={isMine ? 'white' : 'textMuted'}
            style={{ opacity: 0.7, marginTop: 4, alignSelf: 'flex-end' }}
          >
            {formatRelativeTime(item.created_at)}
          </Caption>
        </View>
      </View>
    );
  };

  return (
    <ThemedView>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView edges={['top']} style={styles.container}>
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Avatar name={OTHER_USER.full_name} size={36} />
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <ThemedText variant="bodySmall" weight="600">{OTHER_USER.full_name}</ThemedText>
              <Caption color="accent">Online</Caption>
            </View>
            <TouchableOpacity style={{ padding: spacing.sm }}>
              <Ionicons name="ellipsis-vertical" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={MOCK_MESSAGES}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />

          {/* Input Bar */}
          <SafeAreaView edges={['bottom']}>
            <View style={[styles.inputBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
              <TouchableOpacity style={{ padding: spacing.sm }}>
                <Ionicons name="add-circle-outline" size={24} color={colors.textMuted} />
              </TouchableOpacity>
              <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <TextInput
                  style={[styles.messageInput, { color: colors.text }]}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Type a message..."
                  placeholderTextColor={colors.textMuted}
                  multiline
                  maxLength={500}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { backgroundColor: message.trim() ? colors.primary : colors.border },
                ]}
                onPress={sendMessage}
              >
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  messagesList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  myMessageRow: { justifyContent: 'flex-end' },
  theirMessageRow: { justifyContent: 'flex-start' },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  messageInput: {
    fontSize: 15,
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
});

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  ThemedView,
  ThemedText,
  Heading2,
  Heading3,
  BodySmall,
  Caption,
  Card,
  Avatar,
  Divider,
  Badge,
  Button,
  IconButton,
} from '@/components';
import { useColors, useTheme, useAuth } from '@/hooks';
import { spacing, radii } from '@/constants';
import { useAuthStore } from '@/store';

const MENU_ITEMS = [
  { icon: 'person-outline', label: 'Edit Profile', action: 'edit_profile' },
  { icon: 'notifications-outline', label: 'Notifications', action: 'notifications' },
  { icon: 'shield-checkmark-outline', label: 'Privacy & Security', action: 'privacy' },
  { icon: 'help-circle-outline', label: 'Help & Support', action: 'help' },
  { icon: 'information-circle-outline', label: 'About EventConnect', action: 'about' },
];

export default function ProfileScreen() {
  const colors = useColors();
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  const { signOut, user } = useAuth();

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ThemedView>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Avatar name={user?.full_name} uri={user?.avatar_url} size={80} />
            <Heading2 style={{ marginTop: spacing.md }}>{user?.full_name || 'Guest User'}</Heading2>
            <Caption color="textMuted">{user?.phone || '+233 XX XXX XXXX'}</Caption>
            {user?.role && (
              <Badge
                label={user.role === 'vendor' ? 'Vendor' : 'Customer'}
                variant="info"
                size="md"
                style={{ marginTop: spacing.sm }}
              />
            )}
          </View>

          {/* Theme Toggle */}
          <Card padding="md" radius="lg" style={styles.section}>
            <View style={styles.themeRow}>
              <View style={styles.themeInfo}>
                <Ionicons name="moon" size={22} color={colors.primary} />
                <View style={{ marginLeft: spacing.md }}>
                  <ThemedText variant="bodySmall" weight="600">Dark Mode</ThemedText>
                  <Caption color="textMuted">
                    Currently: {theme === 'system' ? `System (${isDark ? 'Dark' : 'Light'})` : isDark ? 'Dark' : 'Light'}
                  </Caption>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={handleThemeToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <Divider />

            {/* Theme Options */}
            <View style={styles.themeOptions}>
              <ThemedText variant="caption" color="textMuted" style={{ marginBottom: spacing.sm }}>
                THEME PREFERENCE
              </ThemedText>
              <View style={styles.themeButtons}>
                {(['light', 'dark', 'system'] as const).map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[
                      styles.themeButton,
                      {
                        backgroundColor: theme === mode ? colors.primary : colors.surface,
                        borderColor: theme === mode ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setTheme(mode)}
                  >
                    <Ionicons
                      name={
                        mode === 'light'
                          ? 'sunny'
                          : mode === 'dark'
                          ? 'moon'
                          : 'phone-portrait-outline'
                      }
                      size={18}
                      color={theme === mode ? '#FFFFFF' : colors.text}
                    />
                    <ThemedText
                      variant="caption"
                      color={theme === mode ? 'white' : 'text'}
                      weight="600"
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Card>

          {/* Menu Items */}
          <Card padding="none" radius="lg" style={styles.section}>
            {MENU_ITEMS.map((item, index) => (
              <React.Fragment key={item.action}>
                <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
                  <View style={styles.menuItemLeft}>
                    <Ionicons name={item.icon as any} size={22} color={colors.textMuted} />
                    <ThemedText variant="bodySmall">{item.label}</ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </TouchableOpacity>
                {index < MENU_ITEMS.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card>

          {/* Sign Out */}
          <Button
            variant="danger"
            size="lg"
            fullWidth
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            Sign Out
          </Button>

          <ThemedText color="textMuted" align="center" style={styles.version}>
            EventConnect GH v1.0.0
          </ThemedText>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeOptions: {
    paddingTop: spacing.sm,
  },
  themeButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  signOutButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  version: {
    marginVertical: spacing.lg,
  },
});

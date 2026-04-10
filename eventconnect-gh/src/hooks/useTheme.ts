// ============================================================
// EventConnect GH – useTheme Hook
// ============================================================
import { useCallback, useEffect } from 'react';
import { Appearance } from 'react-native';
import { useThemeStore } from '@/store';
import type { ThemeMode } from '@/types';

export function useTheme() {
  const {
    theme,
    isDark,
    colors,
    isLoaded,
    setTheme,
    toggleTheme,
    setSystemIsDark,
  } = useThemeStore();

  // Listen to system appearance changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemIsDark(colorScheme === 'dark');
    });
    return () => subscription.remove();
  }, [setSystemIsDark]);

  const handleSetTheme = useCallback(
    (mode: ThemeMode) => {
      setTheme(mode);
    },
    [setTheme]
  );

  const handleToggleTheme = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  return {
    theme,
    isDark,
    colors,
    isLoaded,
    setTheme: handleSetTheme,
    toggleTheme: handleToggleTheme,
  };
}

/**
 * Shortcut hook that returns just the resolved color tokens
 */
export function useColors() {
  const { colors } = useThemeStore();
  return colors;
}

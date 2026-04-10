// ============================================================
// EventConnect GH – Theme Store (Zustand)
// ============================================================
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Appearance } from 'react-native';
import { lightColors, darkColors } from '@/constants';
import type { ThemeMode, ThemeColors } from '@/types';

const STORAGE_KEY = 'eventconnect-theme-preference';

interface ThemeState {
  theme: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  systemIsDark: boolean;
  isLoaded: boolean;

  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  initTheme: () => Promise<void>;
  setSystemIsDark: (dark: boolean) => void;
}

function resolveIsDark(mode: ThemeMode, systemIsDark: boolean): boolean {
  if (mode === 'system') return systemIsDark;
  return mode === 'dark';
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'system',
  isDark: false,
  colors: lightColors,
  systemIsDark: false,
  isLoaded: false,

  setTheme: (mode: ThemeMode) => {
    const { systemIsDark } = get();
    const isDark = resolveIsDark(mode, systemIsDark);
    set({
      theme: mode,
      isDark,
      colors: isDark ? darkColors : lightColors,
    });
    SecureStore.setItemAsync(STORAGE_KEY, mode).catch(() => {});
  },

  toggleTheme: () => {
    const { isDark, systemIsDark } = get();
    const newMode: ThemeMode = isDark ? 'light' : 'dark';
    get().setTheme(newMode);
  },

  initTheme: async () => {
    try {
      const saved = await SecureStore.getItemAsync(STORAGE_KEY);
      const systemIsDark = Appearance.getColorScheme() === 'dark';
      const mode: ThemeMode = (saved as ThemeMode) || 'system';
      const isDark = resolveIsDark(mode, systemIsDark);
      set({
        theme: mode,
        isDark,
        colors: isDark ? darkColors : lightColors,
        systemIsDark,
        isLoaded: true,
      });
    } catch {
      const systemIsDark = Appearance.getColorScheme() === 'dark';
      set({
        systemIsDark,
        isDark: systemIsDark,
        colors: systemIsDark ? darkColors : lightColors,
        isLoaded: true,
      });
    }
  },

  setSystemIsDark: (dark: boolean) => {
    const { theme } = get();
    const isDark = resolveIsDark(theme, dark);
    set({
      systemIsDark: dark,
      isDark,
      colors: isDark ? darkColors : lightColors,
    });
  },
}));

// ============================================================
// EventConnect GH – Theme Colors & Tokens
// ============================================================
import type { ThemeColors, Typography, Spacing, BorderRadii, ShadowLevel } from '@/types';

// ---------- Color Palettes ----------

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F8FAFC',
  primary: '#7C3AED',
  primaryDark: '#6D28D9',
  secondary: '#F59E0B',
  accent: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  shadow: 'rgba(0,0,0,0.1)',
};

export const darkColors: ThemeColors = {
  background: '#0F172A',
  surface: '#1E293B',
  primary: '#A78BFA',
  primaryDark: '#8B5CF6',
  secondary: '#FBBF24',
  accent: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  border: '#334155',
  shadow: 'rgba(0,0,0,0.3)',
};

export const colors = { light: lightColors, dark: darkColors };

// ---------- Typography ----------

export const typography: Typography = {
  heading1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  heading2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  heading3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
};

// ---------- Spacing ----------

export const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// ---------- Border Radius ----------

export const radii: BorderRadii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// ---------- Shadows ----------

function createShadow(level: ShadowLevel): object {
  switch (level) {
    case 'none':
      return {};
    case 'sm':
      return {
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      };
    case 'md':
      return {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      };
    case 'lg':
      return {
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
      };
    default:
      return {};
  }
}

export const shadow = createShadow;

// ---------- Shared Constants ----------

export const SCREEN_WIDTH = 375; // reference width for responsive calc
export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
export const ANIMATION_CONFIG = {
  fast: { duration: 150 },
  normal: { duration: 250 },
  slow: { duration: 400 },
  spring: { damping: 15, stiffness: 150, mass: 1 },
};

export const GHS = 'GHS'; // Ghana Cedi

export const EVENT_CATEGORIES = [
  { id: 'weddings', name: 'Weddings', icon: '💎' },
  { id: 'birthdays', name: 'Birthdays', icon: '🎂' },
  { id: 'corporate', name: 'Corporate', icon: '💼' },
  { id: 'concerts', name: 'Concerts', icon: '🎵' },
  { id: 'funerals', name: 'Funerals', icon: '🕊️' },
  { id: 'parties', name: 'Parties', icon: '🎉' },
  { id: 'religious', name: 'Religious', icon: '🙏' },
  { id: 'cultural', name: 'Cultural', icon: '🌍' },
  { id: 'photography', name: 'Photography', icon: '📷' },
  { id: 'catering', name: 'Catering', icon: '🍽️' },
  { id: 'decoration', name: 'Decoration', icon: '🎨' },
  { id: 'music_dj', name: 'Music & DJ', icon: '🎧' },
] as const;

export const GHANA_REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Eastern',
  'Central',
  'Northern',
  'Volta',
  'Upper East',
  'Upper West',
  'Bono',
  'Bono East',
  'Ahafo',
  'Savannah',
  'North East',
  'Oti',
  'Western North',
] as const;

import { Platform } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import type { WeatherCondition } from '@/features/weather/types';

// ─── Typography ────────────────────────────────────────────────────────────────
// Mirrors the iOS Human Interface Guidelines type scale exactly.

export const Typography = {
  display: {
    fontSize: 96,
    lineHeight: 96,
    fontWeight: '200' as TextStyle['fontWeight'],
    letterSpacing: -4,
    fontFamily: Platform.select({ ios: 'ui-rounded', default: undefined }),
  },
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0.4,
  },
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0.3,
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0.3,
  },
  title3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.3,
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: -0.4,
  },
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: -0.4,
  },
  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: -0.3,
  },
  subheadline: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: -0.2,
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: -0.1,
  },
  caption1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  caption2: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0.07,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof Typography;

// ─── Spacing ───────────────────────────────────────────────────────────────────

export const Spacing = {
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

// ─── Border radius ─────────────────────────────────────────────────────────────

export const Radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  full: 9999,
} as const;

// ─── Shadows ───────────────────────────────────────────────────────────────────
// iOS shadow props. Pair with `elevation` for Android via `Shadows.android`.

export const Shadows = {
  none: {} as ViewStyle,
  xs: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  } as ViewStyle,
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  } as ViewStyle,
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  } as ViewStyle,
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
  } as ViewStyle,
  xl: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 40,
    elevation: 18,
  } as ViewStyle,
  // Coloured glow shadows for weather cards
  blue: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  } as ViewStyle,
  purple: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  } as ViewStyle,
  amber: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  } as ViewStyle,
} as const;

export type ShadowVariant = keyof typeof Shadows;

// ─── Glass surface colours ─────────────────────────────────────────────────────

export const GlassColors = {
  lightBg: 'rgba(255, 255, 255, 0.55)',
  lightBorder: 'rgba(255, 255, 255, 0.35)',
  lightSubtle: 'rgba(255, 255, 255, 0.20)',
  darkBg: 'rgba(4, 8, 28, 0.52)',
  darkBorder: 'rgba(255, 255, 255, 0.14)',
  darkSubtle: 'rgba(255, 255, 255, 0.06)',
  white5: 'rgba(255, 255, 255, 0.05)',
  white8: 'rgba(255, 255, 255, 0.08)',
  white10: 'rgba(255, 255, 255, 0.10)',
  white15: 'rgba(255, 255, 255, 0.15)',
  white20: 'rgba(255, 255, 255, 0.20)',
  white30: 'rgba(255, 255, 255, 0.30)',
  white50: 'rgba(255, 255, 255, 0.50)',
  black10: 'rgba(0, 0, 0, 0.10)',
  black20: 'rgba(0, 0, 0, 0.20)',
  black30: 'rgba(0, 0, 0, 0.30)',
  black50: 'rgba(0, 0, 0, 0.50)',
} as const;

// ─── Semantic colour values ────────────────────────────────────────────────────
// Use these for imperative `style` prop coloring where NativeWind dark: isn't enough.

export const SemanticColors = {
  light: {
    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',
    backgroundTertiary: '#F1F5F9',
    text: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#94A3B8',
    border: '#E2E8F0',
    borderSubtle: '#F1F5F9',
  },
  dark: {
    background: '#0F172A',
    backgroundSecondary: '#1E293B',
    backgroundTertiary: '#334155',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#64748B',
    border: '#1E293B',
    borderSubtle: '#334155',
  },
} as const;

// ─── Animation durations ───────────────────────────────────────────────────────

export const Duration = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 400,
  slower: 600,
} as const;

// ─── Haptic feedback levels ───────────────────────────────────────────────────

export const HapticWeight = {
  light: 'light',
  medium: 'medium',
  heavy: 'heavy',
} as const;

// ─── Condition glow colours ────────────────────────────────────────────────────
// Ambient glow colour behind the hero weather icon, keyed by condition + time.

export const ConditionGlow: Record<WeatherCondition | 'default', { day: string; night: string }> = {
  clear:        { day: '#FDE68A', night: '#818CF8' },
  clouds:       { day: '#94A3B8', night: '#64748B' },
  rain:         { day: '#60A5FA', night: '#3B82F6' },
  drizzle:      { day: '#7DD3FC', night: '#38BDF8' },
  thunderstorm: { day: '#A78BFA', night: '#7C3AED' },
  snow:         { day: '#E0F2FE', night: '#BAE6FD' },
  mist:         { day: '#CBD5E1', night: '#94A3B8' },
  fog:          { day: '#CBD5E1', night: '#94A3B8' },
  default:      { day: '#60A5FA', night: '#818CF8' },
};

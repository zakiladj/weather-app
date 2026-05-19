import React from 'react';
import { Platform, View, type ViewProps } from 'react-native';
import {
  GlassView,
  isGlassEffectAPIAvailable,
  type GlassColorScheme,
} from 'expo-glass-effect';

import { GlassColors, Radius, Shadows } from '@/design/tokens';
import { useAppTheme } from '@/hooks/use-app-theme';

export interface GlassCardProps extends ViewProps {
  /**
   * Tint colour applied on top of the blur layer (iOS 26+ only).
   * On other platforms this is used as the semi-transparent background.
   */
  tintColor?: string;
  colorScheme?: GlassColorScheme;
  /** 'regular' — standard blur; 'clear' — thinner/lighter glass. Default: 'regular'. */
  glassStyle?: 'regular' | 'clear';
  padding?: number | false;
  radius?: number;
  /** Glow shadow colour for premium feel */
  glowColor?: string;
}

export function GlassCard({
  tintColor,
  colorScheme = 'auto',
  glassStyle = 'regular',
  padding = 16,
  radius = Radius['2xl'],
  glowColor,
  style,
  children,
  ...props
}: GlassCardProps) {
  const { isDark } = useAppTheme();
  const useNativeGlass = Platform.OS === 'ios' && isGlassEffectAPIAvailable();

  const fallbackBg = tintColor
    ? tintColor
    : isDark
    ? GlassColors.darkBg
    : GlassColors.lightBg;

  const borderColor = isDark ? GlassColors.darkBorder : GlassColors.lightBorder;

  const glow = glowColor
    ? {
        shadowColor: glowColor,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.30,
        shadowRadius: 24,
        elevation: 10,
      }
    : Shadows.md;

  const containerStyle = [
    {
      borderRadius: radius,
      borderWidth: 1,
      borderColor,
      overflow: 'hidden' as const,
      ...(padding !== false ? { padding } : {}),
    },
    glow,
    style,
  ];

  if (useNativeGlass) {
    return (
      <GlassView
        glassEffectStyle={glassStyle}
        tintColor={tintColor}
        colorScheme={colorScheme}
        style={containerStyle}
        {...props}
      >
        {children}
      </GlassView>
    );
  }

  // Fallback: manual semi-transparent surface (Android + older iOS)
  return (
    <View
      style={[{ backgroundColor: fallbackBg }, containerStyle]}
      {...props}
    >
      {children}
    </View>
  );
}

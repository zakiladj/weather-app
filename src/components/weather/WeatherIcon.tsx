import React from 'react';
import { Text, View, type ViewStyle } from 'react-native';

import type { WeatherCondition } from '@/features/weather/types';

// ─── Emoji map ─────────────────────────────────────────────────────────────────

const DAY_ICONS: Record<WeatherCondition, string> = {
  clear: '☀️',
  clouds: '☁️',
  rain: '🌧️',
  drizzle: '🌦️',
  thunderstorm: '⛈️',
  snow: '❄️',
  mist: '🌫️',
  fog: '🌫️',
};

const NIGHT_ICONS: Record<WeatherCondition, string> = {
  clear: '🌙',
  clouds: '☁️',
  rain: '🌧️',
  drizzle: '🌦️',
  thunderstorm: '⛈️',
  snow: '❄️',
  mist: '🌫️',
  fog: '🌫️',
};

// ─── Size scale ────────────────────────────────────────────────────────────────

const SIZE_MAP = {
  xs: 16,
  sm: 24,
  md: 36,
  lg: 52,
  xl: 72,
  '2xl': 96,
} as const;

export type WeatherIconSize = keyof typeof SIZE_MAP;

export interface WeatherIconProps {
  condition: WeatherCondition;
  isNight?: boolean;
  size?: WeatherIconSize;
  style?: ViewStyle;
}

export function WeatherIcon({
  condition,
  isNight = false,
  size = 'md',
  style,
}: WeatherIconProps) {
  const emoji = isNight ? NIGHT_ICONS[condition] : DAY_ICONS[condition];
  const fontSize = SIZE_MAP[size];

  return (
    <View style={style}>
      <Text
        style={{ fontSize, lineHeight: fontSize * 1.2 }}
        accessibilityLabel={condition}
      >
        {emoji}
      </Text>
    </View>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function getWeatherEmoji(condition: WeatherCondition, isNight = false): string {
  return isNight ? NIGHT_ICONS[condition] : DAY_ICONS[condition];
}

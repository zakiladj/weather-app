import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { GlassColors, Radius } from '@/design/tokens';
import { formatTime } from '@/utils/format';
import { convertTemperature } from '@/utils/weather';
import type { HourlyForecast } from '@/features/weather/types';
import type { TemperatureUnit } from '@/types';

export interface HourlyItemProps {
  item: HourlyForecast;
  isNight?: boolean;
  isCurrentHour?: boolean;
  unit?: TemperatureUnit;
  style?: ViewStyle;
}

export function HourlyItem({
  item,
  isNight = false,
  isCurrentHour = false,
  unit = 'celsius',
  style,
}: HourlyItemProps) {
  const temp = convertTemperature(item.temperature, unit);
  const time = isCurrentHour ? 'Now' : formatTime(item.timestamp, '12h');
  const showRain = item.precipitationChance > 20;

  const a11yLabel = [
    time,
    item.condition,
    `${temp}°`,
    showRain ? `${item.precipitationChance}% chance of rain` : null,
  ].filter(Boolean).join(', ');

  return (
    <View
      accessible
      accessibilityLabel={a11yLabel}
      style={[styles.wrapper, isCurrentHour && styles.wrapperActive, style]}
    >
      {isCurrentHour && (
        <LinearGradient
          colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.08)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Time */}
      <Text
        variant="caption1"
        weight={isCurrentHour ? '700' : '500'}
        color={isCurrentHour ? '#FFFFFF' : GlassColors.white50}
      >
        {time}
      </Text>

      {/* Rain chance */}
      {showRain ? (
        <Text variant="caption2" weight="600" color="#93C5FD" style={styles.rain}>
          {item.precipitationChance}%
        </Text>
      ) : (
        <View style={styles.rainSpacer} />
      )}

      {/* Icon */}
      <WeatherIcon condition={item.condition} isNight={isNight} size="sm" />

      {/* Temperature */}
      <Text
        variant="callout"
        weight="700"
        color={isCurrentHour ? '#FFFFFF' : 'rgba(255,255,255,0.85)'}
      >
        {temp}°
      </Text>

      {/* Active indicator dot */}
      {isCurrentHour && <View style={styles.activeDot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: Radius['2xl'],
    minWidth: 64,
    overflow: 'hidden',
    borderWidth: 0,
  },
  wrapperActive: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.30)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  rain: {
    marginTop: -2,
  },
  rainSpacer: {
    height: 14,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.60)',
    marginTop: 2,
  },
});

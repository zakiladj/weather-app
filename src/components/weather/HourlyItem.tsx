import React from 'react';
import { View, type ViewStyle } from 'react-native';

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

  return (
    <View
      style={[
        {
          alignItems: 'center',
          gap: 6,
          paddingVertical: 14,
          paddingHorizontal: 12,
          borderRadius: Radius['2xl'],
          minWidth: 64,
          backgroundColor: isCurrentHour
            ? GlassColors.white20
            : 'transparent',
          borderWidth: isCurrentHour ? 1 : 0,
          borderColor: GlassColors.white30,
        },
        style,
      ]}
    >
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
        <Text variant="caption2" weight="600" color="#93C5FD">
          {item.precipitationChance}%
        </Text>
      ) : (
        <View style={{ height: 14 }} />
      )}

      {/* Icon */}
      <WeatherIcon condition={item.condition} isNight={isNight} size="sm" />

      {/* Temperature */}
      <Text variant="callout" weight="700" color="#FFFFFF">
        {temp}°
      </Text>
    </View>
  );
}

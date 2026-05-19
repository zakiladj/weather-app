import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
import { Divider } from '@/components/ui/Divider';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { GlassColors } from '@/design/tokens';
import { formatWeekday } from '@/utils/format';
import { convertTemperature } from '@/utils/weather';
import type { DailyForecast } from '@/features/weather/types';
import type { TemperatureUnit } from '@/types';

export interface DailyItemProps {
  item: DailyForecast;
  isToday?: boolean;
  unit?: TemperatureUnit;
  /** Global min across the 7-day range — used to draw the temperature bar */
  globalMin: number;
  /** Global max across the 7-day range */
  globalMax: number;
  showDivider?: boolean;
  style?: ViewStyle;
}

export function DailyItem({
  item,
  isToday = false,
  unit = 'celsius',
  globalMin,
  globalMax,
  showDivider = true,
  style,
}: DailyItemProps) {
  const low = convertTemperature(item.tempMin, unit);
  const high = convertTemperature(item.tempMax, unit);
  const gMin = convertTemperature(globalMin, unit);
  const gMax = convertTemperature(globalMax, unit);
  const range = Math.max(gMax - gMin, 1);

  const barStart = (low - gMin) / range;
  const barWidth = (high - low) / range;
  const dayLabel = isToday ? 'Today' : formatWeekday(item.date);
  const showRain = item.precipitationChance > 20;

  return (
    <View style={style}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 12,
          gap: 12,
        }}
      >
        {/* Day name */}
        <Text
          variant="callout"
          weight={isToday ? '700' : '500'}
          color={isToday ? '#FFFFFF' : GlassColors.white50}
          style={{ width: 52 }}
        >
          {dayLabel}
        </Text>

        {/* Rain chance (fixed slot so columns align) */}
        <View style={{ width: 36, alignItems: 'center' }}>
          {showRain && (
            <Text variant="caption1" weight="600" color="#93C5FD">
              {item.precipitationChance}%
            </Text>
          )}
        </View>

        {/* Icon */}
        <WeatherIcon condition={item.condition} size="sm" style={{ width: 28 }} />

        {/* Temperature range bar */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text variant="footnote" weight="500" color={GlassColors.white50} style={{ width: 28, textAlign: 'right' }}>
            {low}°
          </Text>

          <View
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: GlassColors.white20,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                position: 'absolute',
                left: `${barStart * 100}%`,
                width: `${barWidth * 100}%`,
                height: '100%',
                borderRadius: 2,
                backgroundColor: '#FCD34D',
              }}
            />
          </View>

          <Text variant="footnote" weight="700" color="#FFFFFF" style={{ width: 28 }}>
            {high}°
          </Text>
        </View>
      </View>

      {showDivider && <Divider color={GlassColors.white10} />}
    </View>
  );
}

import { LinearGradient } from 'expo-linear-gradient';
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
  globalMin: number;
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
  const low  = convertTemperature(item.tempMin, unit);
  const high = convertTemperature(item.tempMax, unit);
  const gMin = convertTemperature(globalMin, unit);
  const gMax = convertTemperature(globalMax, unit);
  const range = Math.max(gMax - gMin, 1);

  const barStart = (low - gMin) / range;
  const barWidth = Math.max((high - low) / range, 0.06);

  const dayLabel = isToday ? 'Today' : formatWeekday(item.date);
  const showRain = item.precipitationChance > 20;

  const a11yLabel = [
    dayLabel,
    item.condition,
    `low ${low}°`,
    `high ${high}°`,
    showRain ? `${item.precipitationChance}% chance of rain` : null,
  ].filter(Boolean).join(', ');

  return (
    <View style={style}>
      <View
        accessible
        accessibilityLabel={a11yLabel}
        style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 12 }}
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

        {/* Rain chance slot */}
        <View style={{ width: 36, alignItems: 'center' }}>
          {showRain && (
            <Text variant="caption1" weight="600" color="#93C5FD">
              {item.precipitationChance}%
            </Text>
          )}
        </View>

        {/* Condition icon */}
        <WeatherIcon condition={item.condition} size="sm" style={{ width: 28 }} />

        {/* Gradient temperature bar */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text
            variant="footnote"
            weight="500"
            color={GlassColors.white50}
            style={{ width: 28, textAlign: 'right' }}
          >
            {low}°
          </Text>

          {/* Bar track */}
          <View
            style={{
              flex: 1,
              height: 5,
              borderRadius: 3,
              backgroundColor: GlassColors.white10,
              overflow: 'hidden',
            }}
          >
            {/* Gradient bar fill — positioned by percentage */}
            <LinearGradient
              colors={['#38BDF8', '#60A5FA', '#FBBF24', '#F97316']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                position: 'absolute',
                left: `${barStart * 100}%` as unknown as number,
                width: `${barWidth * 100}%` as unknown as number,
                height: '100%',
                borderRadius: 3,
              }}
            />
          </View>

          <Text
            variant="footnote"
            weight="700"
            color="#FFFFFF"
            style={{ width: 28 }}
          >
            {high}°
          </Text>
        </View>
      </View>

      {showDivider && <Divider color={GlassColors.white8} />}
    </View>
  );
}

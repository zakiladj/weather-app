import React from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
import { Divider } from '@/components/ui/Divider';
import { GlassCard } from '@/components/ui/GlassCard';
import { HourlyItem } from '@/components/weather/HourlyItem';
import { GlassColors } from '@/design/tokens';
import type { HourlyForecast } from '@/features/weather/types';
import type { TemperatureUnit } from '@/types';

export interface HourlyForecastCardProps {
  items: HourlyForecast[];
  isNight?: boolean;
  unit?: TemperatureUnit;
  style?: ViewStyle;
}

export function HourlyForecastCard({
  items,
  isNight = false,
  unit = 'celsius',
  style,
}: HourlyForecastCardProps) {
  return (
    <GlassCard padding={false} radius={24} style={style}>
      {/* Section header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 12,
        }}
      >
        <Text variant="caption2" style={{ fontSize: 11 }}>🕐</Text>
        <Text variant="caption2" weight="600" color={GlassColors.white50}
          style={{ letterSpacing: 0.8 }}>
          HOURLY FORECAST
        </Text>
      </View>

      <Divider color={GlassColors.white10} />

      {/* Horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingVertical: 10,
          gap: 2,
        }}
      >
        {items.map((item, index) => (
          <HourlyItem
            key={item.timestamp}
            item={item}
            isNight={isNight}
            isCurrentHour={index === 0}
            unit={unit}
          />
        ))}
      </ScrollView>
    </GlassCard>
  );
}

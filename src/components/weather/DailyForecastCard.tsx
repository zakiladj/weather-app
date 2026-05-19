import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
import { Divider } from '@/components/ui/Divider';
import { GlassCard } from '@/components/ui/GlassCard';
import { DailyItem } from '@/components/weather/DailyItem';
import { GlassColors } from '@/design/tokens';
import type { DailyForecast } from '@/features/weather/types';
import type { TemperatureUnit } from '@/types';

export interface DailyForecastCardProps {
  items: DailyForecast[];
  unit?: TemperatureUnit;
  style?: ViewStyle;
}

export function DailyForecastCard({
  items,
  unit = 'celsius',
  style,
}: DailyForecastCardProps) {
  const globalMin = Math.min(...items.map((d) => d.tempMin));
  const globalMax = Math.max(...items.map((d) => d.tempMax));

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
        <Text variant="caption2" style={{ fontSize: 11 }}>📅</Text>
        <Text variant="caption2" weight="600" color={GlassColors.white50}
          style={{ letterSpacing: 0.8 }}>
          7-DAY FORECAST
        </Text>
      </View>

      <Divider color={GlassColors.white10} />

      <View style={{ paddingHorizontal: 16, paddingBottom: 4 }}>
        {items.map((item, index) => (
          <DailyItem
            key={item.date}
            item={item}
            isToday={index === 0}
            unit={unit}
            globalMin={globalMin}
            globalMax={globalMax}
            showDivider={index < items.length - 1}
          />
        ))}
      </View>
    </GlassCard>
  );
}

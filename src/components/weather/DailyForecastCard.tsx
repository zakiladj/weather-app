import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
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
    <GlassCard padding={false} radius={26} style={style}>
      {/* Premium section header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📅</Text>
        <Text variant="caption1" weight="700" color={GlassColors.white50} style={styles.headerLabel}>
          7-DAY FORECAST
        </Text>
        <View style={styles.headerRule} />
      </View>

      <View style={styles.list}>
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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  headerIcon: {
    fontSize: 12,
    lineHeight: 16,
  },
  headerLabel: {
    letterSpacing: 1.2,
  },
  headerRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: GlassColors.white15,
    marginLeft: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
});

import React from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
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
    <GlassCard padding={false} radius={26} style={style}>
      {/* Premium section header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🕐</Text>
        <Text variant="caption1" weight="700" color={GlassColors.white50} style={styles.headerLabel}>
          HOURLY FORECAST
        </Text>
        <View style={styles.headerRule} />
      </View>

      {/* Horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
  scrollContent: {
    paddingHorizontal: 8,
    paddingBottom: 12,
    gap: 2,
  },
});

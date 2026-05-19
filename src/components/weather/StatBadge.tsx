import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassColors } from '@/design/tokens';

export type StatKey = 'humidity' | 'wind' | 'uv' | 'pressure' | 'visibility' | 'feelsLike' | 'rain';

const STAT_META: Record<StatKey, { label: string; emoji: string }> = {
  humidity: { label: 'Humidity', emoji: '💧' },
  wind: { label: 'Wind', emoji: '💨' },
  uv: { label: 'UV Index', emoji: '🔆' },
  pressure: { label: 'Pressure', emoji: '⬇️' },
  visibility: { label: 'Visibility', emoji: '👁️' },
  feelsLike: { label: 'Feels like', emoji: '🌡️' },
  rain: { label: 'Rain', emoji: '🌧️' },
};

export interface StatBadgeProps {
  stat: StatKey;
  value: string;
  /** Optional detail line below the value (e.g. "NW" for wind direction) */
  detail?: string;
  style?: ViewStyle;
}

export function StatBadge({ stat, value, detail, style }: StatBadgeProps) {
  const { label, emoji } = STAT_META[stat];

  return (
    <GlassCard
      padding={14}
      radius={20}
      style={[{ minWidth: 100 }, style]}
    >
      <View style={{ gap: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Text variant="caption1" style={{ fontSize: 13 }}>
            {emoji}
          </Text>
          <Text
            variant="caption1"
            weight="500"
            color={GlassColors.white50}
          >
            {label.toUpperCase()}
          </Text>
        </View>

        <Text variant="title3" weight="700" color="#FFFFFF">
          {value}
        </Text>

        {detail && (
          <Text variant="caption1" color={GlassColors.white50}>
            {detail}
          </Text>
        )}
      </View>
    </GlassCard>
  );
}

// ─── Grid wrapper for a 2×N layout ────────────────────────────────────────────

export interface StatGridProps {
  stats: StatBadgeProps[];
  style?: ViewStyle;
}

export function StatGrid({ stats, style }: StatGridProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
        },
        style,
      ]}
    >
      {stats.map((s) => (
        <StatBadge
          key={s.stat}
          {...s}
          style={{ flex: 1, minWidth: '45%' }}
        />
      ))}
    </View>
  );
}

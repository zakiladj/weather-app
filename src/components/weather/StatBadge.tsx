import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassColors } from '@/design/tokens';

export type StatKey = 'humidity' | 'wind' | 'uv' | 'pressure' | 'visibility' | 'feelsLike' | 'rain';

const STAT_META: Record<StatKey, { label: string; emoji: string; iconBg: string }> = {
  humidity:   { label: 'Humidity',    emoji: '💧', iconBg: 'rgba(56,  189, 248, 0.22)' },
  wind:       { label: 'Wind',        emoji: '💨', iconBg: 'rgba(148, 163, 184, 0.22)' },
  uv:         { label: 'UV Index',    emoji: '🔆', iconBg: 'rgba(251, 191,  36, 0.22)' },
  pressure:   { label: 'Pressure',    emoji: '⬇️', iconBg: 'rgba(167, 139, 250, 0.22)' },
  visibility: { label: 'Visibility',  emoji: '👁️', iconBg: 'rgba( 52, 211, 153, 0.22)' },
  feelsLike:  { label: 'Feels Like',  emoji: '🌡️', iconBg: 'rgba(251, 113,  94, 0.22)' },
  rain:       { label: 'Rain',        emoji: '🌧️', iconBg: 'rgba( 99, 179, 237, 0.22)' },
};

export interface StatBadgeProps {
  stat: StatKey;
  value: string;
  detail?: string;
  style?: ViewStyle;
}

export function StatBadge({ stat, value, detail, style }: StatBadgeProps) {
  const { label, emoji, iconBg } = STAT_META[stat];
  const a11yLabel = `${label}: ${value}${detail ? ` ${detail}` : ''}`;

  return (
    <GlassCard
      accessible
      accessibilityLabel={a11yLabel}
      padding={16}
      radius={22}
      style={[styles.card, style]}
    >
      {/* Icon tile */}
      <View style={[styles.iconTile, { backgroundColor: iconBg }]}>
        <Text variant="body" style={styles.iconEmoji}>{emoji}</Text>
      </View>

      {/* Label */}
      <Text variant="caption2" weight="600" color={GlassColors.white50} style={styles.label}>
        {label.toUpperCase()}
      </Text>

      {/* Value */}
      <Text variant="title3" weight="700" color="#FFFFFF" style={styles.value}>
        {value}
      </Text>

      {/* Optional detail */}
      {detail && (
        <Text variant="caption1" weight="500" color={GlassColors.white50}>
          {detail}
        </Text>
      )}
    </GlassCard>
  );
}

// ─── 2-column grid wrapper ─────────────────────────────────────────────────────

export interface StatGridProps {
  stats: StatBadgeProps[];
  style?: ViewStyle;
}

export function StatGrid({ stats, style }: StatGridProps) {
  return (
    <View style={[styles.grid, style]}>
      {stats.map((s) => (
        <StatBadge key={s.stat} {...s} style={styles.gridItem} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 100,
  },
  iconTile: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconEmoji: {
    fontSize: 18,
    lineHeight: 22,
  },
  label: {
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  value: {
    letterSpacing: -0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    flex: 1,
    minWidth: '45%',
  },
});

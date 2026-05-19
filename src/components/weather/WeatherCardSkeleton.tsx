import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import { Skeleton, SkeletonCircle } from '@/components/ui/Skeleton';
import { GlassColors, Radius } from '@/design/tokens';

// ─── Main weather card skeleton ────────────────────────────────────────────────

export function WeatherCardSkeleton({ style }: { style?: ViewStyle }) {
  return (
    <GlassCard padding={false} radius={32} style={[{ overflow: 'hidden' }, style]}>
      <View style={{ padding: 24, gap: 16 }}>
        {/* Location row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Skeleton width={12} height={12} borderRadius={Radius.full} />
          <Skeleton width={120} height={17} borderRadius={Radius.sm} />
        </View>

        {/* Temperature + icon */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View style={{ gap: 8 }}>
            <Skeleton width={120} height={80} borderRadius={Radius.md} />
            <Skeleton width={80} height={20} borderRadius={Radius.sm} />
          </View>
          <SkeletonCircle size={80} />
        </View>

        {/* Badges */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Skeleton width={90} height={26} borderRadius={Radius.full} />
          <Skeleton width={80} height={26} borderRadius={Radius.full} />
          <Skeleton width={70} height={26} borderRadius={Radius.full} />
        </View>
      </View>

      {/* Bottom strip */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: GlassColors.white10,
          paddingHorizontal: 24,
          paddingVertical: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Skeleton width={80} height={12} borderRadius={Radius.xs} />
        <Skeleton width={100} height={12} borderRadius={Radius.xs} />
      </View>
    </GlassCard>
  );
}

// ─── Hourly scroll skeleton ────────────────────────────────────────────────────

export function HourlyScrollSkeleton({ count = 6, style }: { count?: number; style?: ViewStyle }) {
  return (
    <View style={[{ flexDirection: 'row', gap: 8 }, style]}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            alignItems: 'center',
            gap: 6,
            paddingVertical: 14,
            paddingHorizontal: 12,
            borderRadius: Radius['2xl'],
            backgroundColor: GlassColors.white10,
            minWidth: 64,
          }}
        >
          <Skeleton width={28} height={12} borderRadius={Radius.xs} />
          <Skeleton width={20} height={10} borderRadius={Radius.xs} />
          <SkeletonCircle size={28} />
          <Skeleton width={28} height={16} borderRadius={Radius.xs} />
        </View>
      ))}
    </View>
  );
}

// ─── Daily list skeleton ───────────────────────────────────────────────────────

export function DailyListSkeleton({ count = 7, style }: { count?: number; style?: ViewStyle }) {
  return (
    <GlassCard padding={16} radius={24} style={style}>
      <View style={{ gap: 2 }}>
        {Array.from({ length: count }).map((_, i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              gap: 12,
            }}
          >
            <Skeleton width={52} height={16} borderRadius={Radius.xs} />
            <Skeleton width={36} height={12} borderRadius={Radius.xs} />
            <Skeleton width={28} height={28} borderRadius={Radius.full} />
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Skeleton width={28} height={12} borderRadius={Radius.xs} />
              <Skeleton width="60%" height={4} borderRadius={2} style={{ flex: 1 }} />
              <Skeleton width={28} height={12} borderRadius={Radius.xs} />
            </View>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

// ─── Stat grid skeleton ────────────────────────────────────────────────────────

export function StatGridSkeleton({ style }: { style?: ViewStyle }) {
  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, style]}>
      {Array.from({ length: 4 }).map((_, i) => (
        <GlassCard
          key={i}
          padding={14}
          radius={20}
          style={{ flex: 1, minWidth: '45%' }}
        >
          <View style={{ gap: 8 }}>
            <Skeleton width={70} height={12} borderRadius={Radius.xs} />
            <Skeleton width={50} height={22} borderRadius={Radius.sm} />
            <Skeleton width={40} height={10} borderRadius={Radius.xs} />
          </View>
        </GlassCard>
      ))}
    </View>
  );
}

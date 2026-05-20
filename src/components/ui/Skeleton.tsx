import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef } from 'react';
import { LayoutChangeEvent, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { GlassColors, Radius } from '@/design/tokens';

const SHIMMER_W = 180;
const SHIMMER_DURATION = 1400;

// ─── Base skeleton block ───────────────────────────────────────────────────────

export interface SkeletonProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width, height, borderRadius = Radius.md, style }: SkeletonProps) {
  const shimmerX = useSharedValue(-SHIMMER_W);
  const containerW = useRef(300);

  const startShimmer = useCallback(() => {
    shimmerX.value = -SHIMMER_W;
    shimmerX.value = withRepeat(
      withTiming(containerW.current + SHIMMER_W, {
        duration: SHIMMER_DURATION,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [shimmerX]);

  useEffect(() => {
    startShimmer();
  }, [startShimmer]);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      if (w !== containerW.current) {
        containerW.current = w;
        startShimmer();
      }
    },
    [startShimmer],
  );

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  return (
    <View
      onLayout={handleLayout}
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: GlassColors.white20,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          { position: 'absolute', top: 0, bottom: 0, width: SHIMMER_W },
          shimmerStyle,
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.22)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

// ─── Convenience shapes ────────────────────────────────────────────────────────

export function SkeletonCircle({ size, style }: { size: number; style?: ViewStyle }) {
  return <Skeleton width={size} height={size} borderRadius={Radius.full} style={style} />;
}

export function SkeletonText({
  lines = 1,
  lastLineFraction = 0.6,
  style,
}: {
  lines?: number;
  lastLineFraction?: number;
  style?: ViewStyle;
}) {
  return (
    <View style={[{ gap: 6 }, style]}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 && lines > 1 ? `${lastLineFraction * 100}%` : '100%'}
          height={14}
          borderRadius={Radius.xs}
        />
      ))}
    </View>
  );
}

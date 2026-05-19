import React, { useEffect } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { GlassColors, Radius, Duration } from '@/design/tokens';

// ─── Base skeleton block ───────────────────────────────────────────────────────

export interface SkeletonProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width, height, borderRadius = Radius.md, style }: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: Duration.slower, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: GlassColors.white30,
        },
        animatedStyle,
        style,
      ]}
    />
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

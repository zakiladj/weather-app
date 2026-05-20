import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export interface SpringPressConfig {
  scale?: number;
  opacity?: number;
  damping?: number;
  stiffness?: number;
}

export function useSpringPress({
  scale = 0.94,
  opacity = 1,
  damping = 15,
  stiffness = 300,
}: SpringPressConfig = {}) {
  const progress = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - progress.value * (1 - scale) }],
    opacity: 1 - progress.value * (1 - opacity),
  }));

  const onPressIn = useCallback(() => {
    progress.value = withSpring(1, { damping, stiffness });
  }, [progress, damping, stiffness]);

  const onPressOut = useCallback(() => {
    progress.value = withSpring(0, { damping: 12, stiffness: 200 });
  }, [progress]);

  return { animStyle, onPressIn, onPressOut };
}

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { formatRelativeTime } from '@/utils/format';

interface OfflineBannerProps {
  dataUpdatedAt: number | null;
}

export function OfflineBanner({ dataUpdatedAt }: OfflineBannerProps) {
  const timeStr = dataUpdatedAt ? `· data from ${formatRelativeTime(dataUpdatedAt)}` : '';

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutUp.duration(200)}
      style={styles.container}
    >
      <View style={styles.dot} />
      <Text variant="caption1" weight="500" color="rgba(255, 200, 80, 0.95)">
        Offline {timeStr}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(180, 120, 0, 0.28)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 80, 0.20)',
    alignSelf: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 200, 80, 0.90)',
  },
});

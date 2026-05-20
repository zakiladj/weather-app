import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from '@/components/ui/Text';
import { GlassColors, Radius, Shadows, Duration } from '@/design/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const sizeConfig = {
  sm: { height: 36, px: 14, radius: Radius.lg, textVariant: 'subheadline' as const },
  md: { height: 48, px: 20, radius: Radius.xl, textVariant: 'callout' as const },
  lg: { height: 56, px: 28, radius: Radius['2xl'], textVariant: 'headline' as const },
};

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  children?: React.ReactNode;
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Leading element (icon, emoji). */
  leading?: React.ReactNode;
  /** Trailing element (icon, arrow). */
  trailing?: React.ReactNode;
  /** Primary gradient start colour override. */
  gradientFrom?: string;
  /** Primary gradient end colour override. */
  gradientTo?: string;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  leading,
  trailing,
  gradientFrom = '#60A5FA',
  gradientTo = '#3B82F6',
  fullWidth = false,
  disabled,
  onPress,
  children,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1);
  const { height, px, radius, textVariant } = sizeConfig[size];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled || loading ? 0.5 : 1,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: Duration.fast });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: Duration.fast });
  };

  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height,
        paddingHorizontal: variant === 'icon' ? 0 : px,
      }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : '#60A5FA'}
        />
      ) : (
        <>
          {leading}
          {label && (
            <Text
              variant={textVariant}
              weight="600"
              color={variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : '#60A5FA'}
            >
              {label}
            </Text>
          )}
          {children}
          {trailing}
        </>
      )}
    </View>
  );

  const iconSize = height;

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={disabled || loading ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      accessibilityLabel={label}
      style={[
        animatedStyle,
        fullWidth && { alignSelf: 'stretch' },
        variant === 'icon' && { width: iconSize, height: iconSize, borderRadius: Radius.full },
      ]}
      {...props}
    >
      {variant === 'primary' && (
        <LinearGradient
          colors={[gradientFrom, gradientTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[{ borderRadius: radius }, Shadows.blue]}
        >
          {content}
        </LinearGradient>
      )}

      {variant === 'secondary' && (
        <View
          style={{
            borderRadius: radius,
            backgroundColor: GlassColors.white20,
            borderWidth: 1,
            borderColor: GlassColors.white30,
            ...Shadows.sm,
          }}
        >
          {content}
        </View>
      )}

      {variant === 'ghost' && (
        <View style={{ borderRadius: radius }}>
          {content}
        </View>
      )}

      {variant === 'icon' && (
        <View
          style={{
            borderRadius: Radius.full,
            backgroundColor: GlassColors.white20,
            borderWidth: 1,
            borderColor: GlassColors.white30,
            width: iconSize,
            height: iconSize,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loading
            ? <ActivityIndicator size="small" color="#FFFFFF" />
            : leading ?? children}
        </View>
      )}
    </AnimatedPressable>
  );
}

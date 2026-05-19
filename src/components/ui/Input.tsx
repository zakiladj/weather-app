import React, { useState, useRef } from 'react';
import {
  TextInput,
  View,
  Pressable,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { GlassColors, Radius, Shadows, SemanticColors, Duration } from '@/design/tokens';
import { useAppTheme } from '@/hooks/use-app-theme';

export type InputVariant = 'default' | 'glass';

export interface InputProps extends TextInputProps {
  variant?: InputVariant;
  label?: string;
  hint?: string;
  error?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onClear?: () => void;
  containerStyle?: ViewStyle;
}

export function Input({
  variant = 'glass',
  label,
  hint,
  error,
  leading,
  trailing,
  onClear,
  value,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const { isDark } = useAppTheme();
  const [focused, setFocused] = useState(false);
  const borderOpacity = useSharedValue(0.3);

  const colors = isDark ? SemanticColors.dark : SemanticColors.light;
  const glassText = '#FFFFFF';
  const defaultText = colors.text;

  const animatedBorder = useAnimatedStyle(() => ({
    borderColor: `rgba(255,255,255,${borderOpacity.value})`,
  }));

  const handleFocus = (e: any) => {
    setFocused(true);
    borderOpacity.value = withTiming(0.6, { duration: Duration.fast });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setFocused(false);
    borderOpacity.value = withTiming(0.3, { duration: Duration.fast });
    onBlur?.(e);
  };

  const bgColor =
    variant === 'glass'
      ? isDark ? GlassColors.darkBg : GlassColors.lightBg
      : isDark ? colors.backgroundSecondary : colors.backgroundSecondary;

  const showClear = onClear && value && value.length > 0;

  return (
    <View style={[{ gap: 6 }, containerStyle]}>
      {label && (
        <Text
          variant="subheadline"
          weight="500"
          color={variant === 'glass' ? GlassColors.white50 : colors.textSecondary}
        >
          {label}
        </Text>
      )}

      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: bgColor,
            borderRadius: Radius.xl,
            borderWidth: 1,
            height: 48,
            paddingHorizontal: 14,
            gap: 8,
          },
          variant === 'glass' ? animatedBorder : {
            borderColor: error
              ? '#F43F5E'
              : focused
              ? '#60A5FA'
              : isDark ? GlassColors.darkBorder : 'rgba(0,0,0,0.10)',
          },
          variant === 'default' && Shadows.xs,
        ]}
      >
        {leading && <View style={{ opacity: 0.6 }}>{leading}</View>}

        <TextInput
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={
            variant === 'glass' ? GlassColors.white30 : colors.textTertiary
          }
          style={[
            {
              flex: 1,
              color: variant === 'glass' ? glassText : defaultText,
              fontSize: 16,
              lineHeight: 21,
              paddingVertical: 0,
            },
            style,
          ]}
          {...props}
        />

        {showClear && (
          <Pressable
            onPress={onClear}
            hitSlop={8}
            style={{
              backgroundColor: GlassColors.white20,
              borderRadius: Radius.full,
              width: 18,
              height: 18,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text variant="caption2" weight="700" color="rgba(255,255,255,0.8)">
              ✕
            </Text>
          </Pressable>
        )}

        {!showClear && trailing}
      </Animated.View>

      {(hint || error) && (
        <Text
          variant="caption1"
          color={error ? '#F43F5E' : colors.textTertiary}
        >
          {error ?? hint}
        </Text>
      )}
    </View>
  );
}

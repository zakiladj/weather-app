import React from 'react';
import { View, type ViewProps } from 'react-native';

import { Radius, Shadows, type ShadowVariant } from '@/design/tokens';
import { useAppTheme } from '@/hooks/use-app-theme';

export type CardVariant = 'default' | 'elevated' | 'flat';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  shadow?: ShadowVariant;
  padding?: number | false;
  radius?: number;
}

export function Card({
  variant = 'default',
  shadow,
  padding = 16,
  radius = Radius.xl,
  style,
  children,
  ...props
}: CardProps) {
  const { isDark } = useAppTheme();

  const resolvedShadow =
    shadow ?? (variant === 'elevated' ? 'lg' : variant === 'default' ? 'sm' : 'none');

  const bgColor =
    isDark
      ? variant === 'flat' ? 'transparent' : '#1E293B'
      : variant === 'flat' ? 'transparent' : '#FFFFFF';

  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';

  return (
    <View
      style={[
        {
          backgroundColor: bgColor,
          borderRadius: radius,
          borderWidth: variant !== 'flat' ? 1 : 0,
          borderColor,
          overflow: 'hidden',
          ...(padding !== false ? { padding } : {}),
        },
        Shadows[resolvedShadow],
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

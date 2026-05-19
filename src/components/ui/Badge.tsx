import React from 'react';
import { View, type ViewProps } from 'react-native';

import { Text } from '@/components/ui/Text';
import { GlassColors } from '@/design/tokens';

export type BadgeVariant = 'solid' | 'glass' | 'outline' | 'tinted';
export type BadgeSize = 'sm' | 'md';
export type BadgeColor = 'blue' | 'amber' | 'violet' | 'emerald' | 'rose' | 'slate' | 'white';

const colorMap: Record<BadgeColor, { bg: string; text: string; border: string }> = {
  blue: { bg: 'rgba(59,130,246,0.20)', text: '#93C5FD', border: 'rgba(59,130,246,0.30)' },
  amber: { bg: 'rgba(245,158,11,0.20)', text: '#FCD34D', border: 'rgba(245,158,11,0.30)' },
  violet: { bg: 'rgba(139,92,246,0.20)', text: '#C4B5FD', border: 'rgba(139,92,246,0.30)' },
  emerald: { bg: 'rgba(16,185,129,0.20)', text: '#6EE7B7', border: 'rgba(16,185,129,0.30)' },
  rose: { bg: 'rgba(244,63,94,0.20)', text: '#FDA4AF', border: 'rgba(244,63,94,0.30)' },
  slate: { bg: 'rgba(100,116,139,0.20)', text: '#CBD5E1', border: 'rgba(100,116,139,0.30)' },
  white: { bg: GlassColors.white20, text: '#FFFFFF', border: GlassColors.white30 },
};

export interface BadgeProps extends ViewProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  /** Optional prefix element (icon, emoji) */
  leading?: React.ReactNode;
}

export function Badge({
  label,
  variant = 'tinted',
  size = 'sm',
  color = 'white',
  leading,
  style,
  ...props
}: BadgeProps) {
  const palette = colorMap[color];
  const isSmall = size === 'sm';

  const bgColor =
    variant === 'glass' ? GlassColors.white20
    : variant === 'solid' ? palette.text
    : variant === 'tinted' ? palette.bg
    : 'transparent';

  const borderColor =
    variant === 'outline' || variant === 'glass' ? palette.border : 'transparent';

  const textColor =
    variant === 'solid' ? '#0F172A' : palette.text;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: bgColor,
          borderWidth: 1,
          borderColor,
          borderRadius: 999,
          paddingHorizontal: isSmall ? 8 : 12,
          paddingVertical: isSmall ? 3 : 5,
          gap: 4,
        },
        style,
      ]}
      {...props}
    >
      {leading}
      <Text
        variant={isSmall ? 'caption1' : 'footnote'}
        weight="600"
        color={textColor}
      >
        {label}
      </Text>
    </View>
  );
}

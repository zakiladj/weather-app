import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { GlassColors } from '@/design/tokens';

export interface DividerProps {
  /** 'horizontal' (default) or 'vertical' */
  orientation?: 'horizontal' | 'vertical';
  /** Explicit color; defaults to a subtle glass white */
  color?: string;
  /** Thickness in pixels; default 1 */
  thickness?: number;
  /** Outer margin applied along the perpendicular axis */
  inset?: number;
  style?: ViewStyle;
}

export function Divider({
  orientation = 'horizontal',
  color = GlassColors.white20,
  thickness = 1,
  inset = 0,
  style,
}: DividerProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <View
      style={[
        {
          backgroundColor: color,
          ...(isHorizontal
            ? {
                height: thickness,
                marginHorizontal: inset,
                alignSelf: 'stretch',
              }
            : {
                width: thickness,
                marginVertical: inset,
                alignSelf: 'stretch',
              }),
        },
        style,
      ]}
    />
  );
}

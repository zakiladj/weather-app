import React from 'react';
import { Text as RNText, type TextProps, Platform } from 'react-native';

import { Typography, type TypographyVariant } from '@/design/tokens';

export interface UITextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  /** Override font weight without changing variant */
  weight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  /** Shorthand opacity on the text color */
  dim?: boolean;
}

/**
 * Design-system Text. Defaults to `body` variant with system foreground colour.
 * Pair with NativeWind `className` for colour utilities (`text-white`, `text-content-secondary`, …).
 */
export function Text({
  variant = 'body',
  color,
  weight,
  dim,
  style,
  ...props
}: UITextProps) {
  const base = Typography[variant];
  const fontFamily = Platform.select({
    ios: variant === 'display' ? 'ui-rounded' : 'ui-sans-serif',
    default: undefined,
  });

  return (
    <RNText
      style={[
        base,
        fontFamily ? { fontFamily } : null,
        weight ? { fontWeight: weight } : null,
        color ? { color } : null,
        dim ? { opacity: 0.6 } : null,
        style,
      ]}
      {...props}
    />
  );
}

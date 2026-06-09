import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Image as SvgImage } from 'react-native-svg';

/** Proporção do arquivo mestre (738×348). */
export const ORBITA_WORDMARK_ASPECT = 738 / 348;

const WORDMARK = require('../../../assets/images/orbita-logo-wordmark.png');

interface OrbitaWordmarkProps {
  /** Largura em px; altura derivada da proporção se `height` omitido. */
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

/**
 * Logotipo horizontal “orbita” (wordmark) para uso na interface.
 * Raster em PNG dentro de `Svg` — escala sem perder nitidez em telas @2x/@3x.
 */
export function OrbitaWordmark({
  width = 200,
  height,
  style,
  accessibilityLabel = 'Orbita',
}: OrbitaWordmarkProps) {
  const resolvedHeight = height ?? width / ORBITA_WORDMARK_ASPECT;

  return (
    <Svg
      width={width}
      height={resolvedHeight}
      viewBox="0 0 738 348"
      style={style}
      accessibilityLabel={accessibilityLabel}
    >
      <SvgImage
        href={WORDMARK}
        width={738}
        height={348}
        preserveAspectRatio="xMidYMid meet"
      />
    </Svg>
  );
}

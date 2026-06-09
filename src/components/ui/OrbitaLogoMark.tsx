import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Image as SvgImage } from 'react-native-svg';

/** Proporção do arquivo mestre (viewBox 507×347). */
export const ORBITA_LOGO_MARK_ASPECT = 507 / 347;

const LOGO_MARK = require('../../../assets/images/orbita-logo-mark.png');

interface OrbitaLogoMarkProps {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

/** Símbolo orbital (planeta + anéis) — `orbita-logo-mark`. */
export function OrbitaLogoMark({
  width = 200,
  height,
  style,
  accessibilityLabel = 'Orbita',
}: OrbitaLogoMarkProps) {
  const resolvedHeight = height ?? width / ORBITA_LOGO_MARK_ASPECT;

  return (
    <Svg
      width={width}
      height={resolvedHeight}
      viewBox="0 0 507 347"
      style={style}
      accessibilityLabel={accessibilityLabel}
    >
      <SvgImage
        href={LOGO_MARK}
        width={507}
        height={347}
        preserveAspectRatio="xMidYMid meet"
      />
    </Svg>
  );
}

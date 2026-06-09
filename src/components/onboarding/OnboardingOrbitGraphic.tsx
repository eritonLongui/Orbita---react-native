import { MotiView } from 'moti';
import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { View } from 'react-native';
import { themeColors } from '../../constants/theme';

interface OnboardingOrbitGraphicProps {
  size?: number;
}

export function OnboardingOrbitGraphic({ size = 200 }: OnboardingOrbitGraphicProps) {
  const center = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={size * 0.42}
          stroke={themeColors.radarGrid}
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={size * 0.28}
          stroke={themeColors.radarGrid}
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={size * 0.14}
          stroke={themeColors.radarGrid}
          strokeWidth={1}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={size * 0.34}
          fill={themeColors.radarFill}
          stroke={themeColors.radarStroke}
          strokeWidth={1.5}
        />
      </Svg>
      <MotiView
        from={{ opacity: 0.6, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 1800, loop: true }}
        style={{
          position: 'absolute',
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: themeColors.primary,
          top: center - size * 0.34 - 6,
          left: center - 6,
        }}
      />
    </View>
  );
}

import React, { useId, useMemo } from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { themeColors } from '../../constants/theme';

interface GradientTextProps {
  children: string;
  fontSize?: number;
  fontWeight?: TextStyle['fontWeight'];
  lineHeight?: number;
  letterSpacing?: number;
}

function estimateTextWidth(text: string, fontSize: number, letterSpacing = 0): number {
  const narrow = text.length <= 2 ? 0.58 : 0.64;
  const spacing = Math.max(0, text.length - 1) * letterSpacing;
  return Math.ceil(text.length * fontSize * narrow + fontSize * 0.2 + spacing);
}

export function GradientText({
  children,
  fontSize = 28,
  fontWeight = '800',
  lineHeight,
  letterSpacing = 0,
}: GradientTextProps) {
  const gradientId = useId().replace(/:/g, '');
  const resolvedLineHeight = lineHeight ?? Math.round(fontSize * 1.15);
  const width = useMemo(
    () => estimateTextWidth(children, fontSize, letterSpacing),
    [children, fontSize, letterSpacing],
  );
  const svgWeight = fontWeight === '800' || fontWeight === '700' ? 'bold' : '600';

  return (
    <View style={styles.wrap}>
      <Svg width={width} height={resolvedLineHeight}>
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={themeColors.gradient[0]} />
            <Stop offset="55%" stopColor={themeColors.gradient[1]} />
            <Stop offset="100%" stopColor={themeColors.gradient[2]} />
          </LinearGradient>
        </Defs>
        <SvgText
          x={width / 2}
          y={fontSize}
          fill={`url(#${gradientId})`}
          fontSize={fontSize}
          fontWeight={svgWeight}
          letterSpacing={letterSpacing}
          textAnchor="middle"
        >
          {children}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
});

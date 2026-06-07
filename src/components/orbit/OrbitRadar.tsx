import React, { useId } from 'react';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Polygon,
  RadialGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';
import { OrbitAreaSummary } from '../../types';

interface OrbitRadarProps {
  areas: OrbitAreaSummary[];
  size?: number;
  hideCenterScore?: boolean;
}

const LABELS_OFFSET = 22;

export function OrbitRadar({ areas, size = 260, hideCenterScore = false }: OrbitRadarProps) {
  const gradientId = useId().replace(/:/g, '');
  const fillId = `orbitRadarFill-${gradientId}`;
  const strokeId = `orbitRadarStroke-${gradientId}`;
  const glowId = `orbitRadarGlow-${gradientId}`;

  const center = size / 2;
  const radius = size / 2 - 42;
  const count = areas.length;
  const angleStep = (2 * Math.PI) / count;
  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = areas.map((area, i) => getPoint(i, area.score));
  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <YStack items="center">
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={glowId} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={themeColors.primaryGlow} stopOpacity="0.2" />
            <Stop offset="100%" stopColor={themeColors.primary} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id={fillId} cx="50%" cy="45%" rx="55%" ry="55%">
            <Stop offset="0%" stopColor={themeColors.primaryGlow} stopOpacity="0.55" />
            <Stop offset="55%" stopColor={themeColors.primary} stopOpacity="0.32" />
            <Stop offset="100%" stopColor="#2F5FD4" stopOpacity="0.12" />
          </RadialGradient>
          <LinearGradient id={strokeId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={themeColors.primarySoft} />
            <Stop offset="100%" stopColor={themeColors.primaryGlow} />
          </LinearGradient>
        </Defs>

        <Circle cx={center} cy={center} r={radius * 1.05} fill={`url(#${glowId})`} />

        {gridLevels.map((level) => {
          const points = Array.from({ length: count }, (_, i) => {
            const angle = angleStep * i - Math.PI / 2;
            const r = radius * level;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ');
          return (
            <Polygon
              key={level}
              points={points}
              fill="none"
              stroke={themeColors.radarGrid}
              strokeWidth={level === 1 ? 1.2 : 0.8}
              opacity={level === 1 ? 0.9 : 0.55}
            />
          );
        })}

        {areas.map((_, i) => {
          const end = getPoint(i, 100);
          return (
            <Line
              key={i}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke={themeColors.radarGrid}
              strokeWidth={1}
              opacity={0.7}
            />
          );
        })}

        <Polygon
          points={polygonPoints}
          fill={`url(#${fillId})`}
          stroke={`url(#${strokeId})`}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {dataPoints.map((p, i) => (
          <Circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={5}
            fill={themeColors.primarySoft}
            stroke="#FFFFFF"
            strokeWidth={1.5}
          />
        ))}

        {!hideCenterScore ? (
          <>
            <Circle cx={center} cy={center} r={26} fill="rgba(8, 9, 13, 0.72)" />
            <SvgText
              x={center}
              y={center - 4}
              fill={themeColors.text}
              fontSize={18}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {Math.round(areas.reduce((sum, area) => sum + area.score, 0) / count)}
            </SvgText>
            <SvgText
              x={center}
              y={center + 12}
              fill={themeColors.textMuted}
              fontSize={9}
              fontWeight="600"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              média
            </SvgText>
          </>
        ) : null}

        {areas.map((area, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const labelR = radius + LABELS_OFFSET;
          const x = center + labelR * Math.cos(angle);
          const y = center + labelR * Math.sin(angle);
          return (
            <SvgText
              key={area.type}
              x={x}
              y={y}
              fill={themeColors.textMuted}
              fontSize={11}
              fontWeight="700"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {area.label}
            </SvgText>
          );
        })}
      </Svg>
    </YStack>
  );
}

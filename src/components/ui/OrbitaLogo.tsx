import Svg, { Circle, Ellipse, G } from 'react-native-svg';

interface OrbitaLogoProps {
  size?: number;
  color?: string;
}

const ORBITS = [
  { rx: 0.32, ry: 0.12 },
  { rx: 0.38, ry: 0.15 },
  { rx: 0.44, ry: 0.18 },
  { rx: 0.5, ry: 0.21 },
  { rx: 0.56, ry: 0.24 },
] as const;

export function OrbitaLogo({ size = 120, color = '#FFFFFF' }: OrbitaLogoProps) {
  const center = size / 2;
  const strokeWidth = Math.max(1.2, size * 0.012);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G transform={`rotate(-32 ${center} ${center})`}>
        {ORBITS.map((orbit, index) => (
          <Ellipse
            key={index}
            cx={center}
            cy={center}
            rx={size * orbit.rx}
            ry={size * orbit.ry}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.95 - index * 0.04}
          />
        ))}
      </G>
      <Circle
        cx={center - size * 0.06}
        cy={center - size * 0.08}
        r={size * 0.11}
        fill={color}
      />
    </Svg>
  );
}

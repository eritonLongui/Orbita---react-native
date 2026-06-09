import Svg, { Ellipse, G, Path } from 'react-native-svg';

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

export function OrbitaLogo({ size = 120, color = '#dfeef7' }: OrbitaLogoProps) {
  const center = size / 2;
  const strokeWidth = Math.max(1.2, size * 0.012);

  return (
    <Svg width={size * 1.1} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G transform={`rotate(-26 ${center} ${center})`}>
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
      <G
        transform={`
          translate(${center - size * 0.13} ${center - size * 0.18})
          scale(${size / 600})
        `}
      >
        <Path
          d="M88 0C136.359 0 175.606 39.0079 175.995 87.2754C162.259 105.126 139.943 123.018 112.09 136.612C83.8707 150.385 55.6693 156.966 32.9922 156.631C32.9661 156.63 32.9401 156.629 32.9141 156.629C12.8455 140.5 7.53476e-05 115.75 0 88C0 39.3989 39.3989 0 88 0Z"
          fill={color}
        />
      </G>
      {/* <Circle
        cx={center - size * 0.06}
        cy={center - size * 0.08}
        r={size * 0.11}
        fill={color}
      /> */}
    </Svg>
  );
}

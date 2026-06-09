import React, { memo, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const COLORS = [
  '#FFFFFF',
  '#E8F0FF',
  '#4B8BFF',
  '#6BA3FF',
  '#7EC8FF',
  '#A5CFFF',
  '#FFFFFF',
];

type Shape = 'rect' | 'dot' | 'strip';

interface ParticleConfig {
  x: number;
  y: number;
  endX: number;
  endY: number;
  color: string;
  w: number;
  h: number;
  delay: number;
  dur: number;
  rot: number;
  borderRadius: number;
}

function generateBurst(): ParticleConfig[] {
  const { width, height } = Dimensions.get('window');
  const cx = width / 2;
  const cy = height * 0.35;
  const count = 45;
  const shapes: Shape[] = ['rect', 'dot', 'strip'];

  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const radius = 180 + Math.random() * 280;
    const shape = shapes[i % 3];
    const size = shape === 'strip' ? 4 + Math.random() * 3 : 7 + Math.random() * 7;

    const w = shape === 'strip' ? size : size;
    const h = shape === 'strip' ? size * 3.5 : shape === 'dot' ? size : size * 0.5;
    const br = shape === 'dot' ? size / 2 : shape === 'strip' ? size / 2 : 2;

    return {
      x: cx - w / 2,
      y: cy - h / 2,
      endX: Math.cos(angle) * radius,
      endY: Math.sin(angle) * radius * 0.8 + 120,
      color: COLORS[i % COLORS.length],
      w,
      h,
      delay: Math.floor((i / count) * 100 + Math.random() * 80),
      dur: 1500 + Math.floor(Math.random() * 500),
      rot: (Math.random() - 0.5) * 900,
      borderRadius: br,
    };
  });
}

const Particle = memo(function Particle({ config }: { config: ParticleConfig }) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const rot = useSharedValue(0);
  const scl = useSharedValue(0);
  const op = useSharedValue(1);

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);
    tx.value = withDelay(config.delay, withTiming(config.endX, { duration: config.dur, easing: ease }));
    ty.value = withDelay(config.delay, withTiming(config.endY, { duration: config.dur, easing: ease }));
    rot.value = withDelay(config.delay, withTiming(config.rot, { duration: config.dur, easing: ease }));
    scl.value = withDelay(config.delay, withTiming(1, { duration: 250, easing: Easing.out(Easing.back(3)) }));
    op.value = withDelay(
      config.delay + config.dur * 0.6,
      withTiming(0, { duration: config.dur * 0.4, easing: Easing.in(Easing.quad) }),
    );
  }, [config, op, rot, scl, tx, ty]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${rot.value}deg` },
      { scale: scl.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: config.x,
          top: config.y,
          width: config.w,
          height: config.h,
          borderRadius: config.borderRadius,
          backgroundColor: config.color,
        },
        animStyle,
      ]}
    />
  );
});

interface ConfettiCelebrationProps {
  active: boolean;
}

export function ConfettiCelebration({ active }: ConfettiCelebrationProps) {
  const burstRef = useRef<ParticleConfig[]>([]);
  const keyRef = useRef(0);

  if (active && burstRef.current.length === 0) {
    burstRef.current = generateBurst();
    keyRef.current += 1;
  } else if (!active) {
    burstRef.current = [];
  }

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {burstRef.current.map((config, i) => (
        <Particle key={`${keyRef.current}-${i}`} config={config} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  particle: {
    position: 'absolute',
  },
});

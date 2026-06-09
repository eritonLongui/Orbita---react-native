import { MotiView } from 'moti';
import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';

const PARTICLE_COUNT = 56;

interface ParticleConfig {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  driftX: number;
  driftY: number;
}

/** PRNG simples e determinístico — partículas estáveis entre renders. */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createParticles(width: number, height: number): ParticleConfig[] {
  if (width <= 0 || height <= 0) return [];

  const rand = mulberry32(42);
  return Array.from({ length: PARTICLE_COUNT }, (_, id) => {
    const size = 2 + rand() * 3;
    const opacity = 0.35 + rand() * 0.5;
    return {
      id,
      x: rand() * Math.max(0, width - size),
      y: rand() * Math.max(0, height - size),
      size,
      opacity,
      duration: 9000 + rand() * 11000,
      driftX: 8 + rand() * 22,
      driftY: 8 + rand() * 22,
    };
  });
}

function StarParticle({ config }: { config: ParticleConfig }) {
  return (
    <MotiView
      from={{
        translateX: 0,
        translateY: 0,
        opacity: config.opacity,
      }}
      animate={{
        translateX: config.driftX,
        translateY: -config.driftY,
        opacity: Math.min(config.opacity * 1.25, 0.95),
      }}
      transition={{
        type: 'timing',
        duration: config.duration,
        easing: Easing.inOut(Easing.sin),
        loop: true,
        repeatReverse: true,
      }}
      style={[
        styles.particle,
        {
          left: config.x,
          top: config.y,
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
        },
      ]}
    />
  );
}

interface StarfieldBackgroundProps {
  particleCount?: number;
}

export function StarfieldBackground({ particleCount = PARTICLE_COUNT }: StarfieldBackgroundProps) {
  const { width, height } = useWindowDimensions();
  const particles = useMemo(
    () => createParticles(width, height).slice(0, particleCount),
    [width, height, particleCount],
  );

  if (width <= 0 || height <= 0) return null;

  return (
    <View style={styles.root} pointerEvents="none">
      {particles.map((particle) => (
        <StarParticle key={particle.id} config={particle} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
});

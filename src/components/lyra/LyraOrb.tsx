import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { themeColors } from '../../constants/theme';
import type { LyraSessionState } from '../../hooks/useLyraAssistant';

export type LyraOrbSize = 'full' | 'compact';

type OrbMetrics = {
  orb: number;
  inner: number;
  eyeW: number;
  eyeH: number;
  eyeGap: number;
  eyeRadius: number;
  showRings: boolean;
  showHighlight: boolean;
  showNebula: boolean;
};

const METRICS: Record<LyraOrbSize, OrbMetrics> = {
  full: {
    orb: 220,
    inner: 196,
    eyeW: 24,
    eyeH: 48,
    eyeGap: 30,
    eyeRadius: 10,
    showRings: true,
    showHighlight: true,
    showNebula: true,
  },
  compact: {
    orb: 34,
    inner: 30,
    eyeW: 3,
    eyeH: 7,
    eyeGap: 4,
    eyeRadius: 1.5,
    showRings: false,
    showHighlight: false,
    showNebula: false,
  },
};

type OrbVisualState = 'idle' | 'listening' | 'thinking';

function mapState(state: LyraSessionState): OrbVisualState {
  if (state === 'recording') return 'listening';
  if (state === 'processing' || state === 'responding') return 'thinking';
  return 'idle';
}

interface LyraOrbProps {
  state: LyraSessionState;
  size?: LyraOrbSize;
  onPress?: () => void;
  pressable?: boolean;
  style?: ViewStyle;
}

function RobotEyes({
  visual,
  metrics,
}: {
  visual: OrbVisualState;
  metrics: OrbMetrics;
}) {
  const motion = useMemo(() => {
    if (visual === 'listening') {
      return {
        grow: [1, 1.22, 1.08, 1.22, 1] as number[],
        growDuration: 700,
        blink: [1, 1, 1, 0.08, 1, 1] as number[],
        blinkDuration: 3200,
      };
    }
    if (visual === 'thinking') {
      return {
        grow: [1, 1.1, 1, 1.1, 1] as number[],
        growDuration: 1100,
        blink: [1, 0.08, 1, 1, 0.08, 1, 1] as number[],
        blinkDuration: 2000,
      };
    }
    return {
      grow: 1,
      growDuration: 0,
      blink: [1, 1, 1, 1, 1, 0.08, 1, 1] as number[],
      blinkDuration: 5200,
    };
  }, [visual]);

  return (
    <MotiView
      animate={{ scale: motion.grow }}
      transition={{
        type: 'timing',
        duration: motion.growDuration || 1,
        loop: visual !== 'idle',
      }}
    >
      <MotiView
        animate={{ scaleY: motion.blink }}
        transition={{
          type: 'timing',
          duration: motion.blinkDuration,
          loop: true,
        }}
      >
        <View style={[styles.eyesRow, { gap: metrics.eyeGap }]}>
          <View
            style={{
              width: metrics.eyeW,
              height: metrics.eyeH,
              borderRadius: metrics.eyeRadius,
              backgroundColor: '#FFFFFF',
            }}
          />
          <View
            style={{
              width: metrics.eyeW,
              height: metrics.eyeH,
              borderRadius: metrics.eyeRadius,
              backgroundColor: '#FFFFFF',
            }}
          />
        </View>
      </MotiView>
    </MotiView>
  );
}

export function LyraOrb({
  state,
  size = 'full',
  onPress,
  pressable = false,
  style,
}: LyraOrbProps) {
  const visual = mapState(state);
  const metrics = METRICS[size];

  const motion = useMemo(() => {
    if (visual === 'listening') {
      return {
        orbScale: [1, 1.12, 1] as number[],
        coreScale: [1, 1.12, 1] as number[],
        coreDuration: 750,
        ringDuration: 1400,
        ringScale: [0.68, 1.28] as number[],
        ringOpacity: [0.7, 0] as number[],
        glowOpacity: [0.5, 0.85, 0.5] as number[],
        ringColor: themeColors.primaryGlow,
        ringWidth: 2,
        innerColors: [...themeColors.gradientVivid] as string[],
      };
    }
    if (visual === 'thinking') {
      return {
        orbScale: [1, 1.03, 1] as number[],
        coreScale: [1, 1.05, 1] as number[],
        coreDuration: 1100,
        ringDuration: 1600,
        ringScale: [0.75, 1.2] as number[],
        ringOpacity: [0.55, 0] as number[],
        glowOpacity: [0.45, 0.8, 0.45] as number[],
        ringColor: themeColors.info,
        ringWidth: 1.5,
        innerColors: [themeColors.primary, themeColors.info, themeColors.primarySoft],
      };
    }
    return {
      orbScale: 1,
      coreScale: [1, 1.02, 1] as number[],
      coreDuration: 3200,
      ringDuration: 4000,
      ringScale: [0.82, 1.08] as number[],
      ringOpacity: [0.18, 0] as number[],
      glowOpacity: [0.15, 0.28, 0.15] as number[],
      ringColor: themeColors.primary,
      ringWidth: 1,
      innerColors: [...themeColors.gradient] as string[],
    };
  }, [visual]);

  const orbRadius = metrics.orb / 2;
  const innerRadius = metrics.inner / 2;

  const content = (
    <MotiView
      animate={{ scale: motion.orbScale }}
      transition={{
        type: 'timing',
        duration: motion.coreDuration,
        loop: visual === 'listening',
      }}
      style={[
        {
          width: metrics.orb,
          height: metrics.orb,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <MotiView
        animate={{ opacity: motion.glowOpacity, scale: motion.coreScale }}
        transition={{ type: 'timing', duration: motion.coreDuration, loop: true }}
        style={{
          position: 'absolute',
          width: metrics.orb,
          height: metrics.orb,
          borderRadius: orbRadius,
          backgroundColor: themeColors.primary,
          shadowColor: themeColors.primaryGlow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: size === 'compact' ? 0.35 : 0.95,
          shadowRadius: size === 'compact' ? 4 : 48,
          elevation: size === 'compact' ? 2 : 18,
        }}
      />

      {metrics.showRings
        ? [0, 1, 2].map((i) => (
            <MotiView
              key={i}
              animate={{
                scale: motion.ringScale,
                opacity: motion.ringOpacity,
              }}
              transition={{
                type: 'timing',
                duration: motion.ringDuration,
                delay: i * (motion.ringDuration / 3),
                loop: true,
              }}
              style={{
                position: 'absolute',
                width: metrics.orb,
                height: metrics.orb,
                borderRadius: orbRadius,
                borderColor: motion.ringColor,
                borderWidth: motion.ringWidth,
              }}
            />
          ))
        : null}

      {size === 'full' ? (
        <View
          style={{
            position: 'absolute',
            width: metrics.orb,
            height: metrics.orb,
            borderRadius: orbRadius,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.14)',
          }}
        >
          <BlurView intensity={visual === 'listening' ? 24 : 18} tint="dark" style={StyleSheet.absoluteFill} />
          <View
            style={{
              ...StyleSheet.absoluteFill,
              borderRadius: orbRadius,
              borderWidth: 1.5,
              borderColor:
                visual === 'listening' ? 'rgba(126,200,255,0.45)' : 'rgba(255,255,255,0.08)',
            }}
          />
        </View>
      ) : null}

      <MotiView
        animate={{ scale: motion.coreScale }}
        transition={{ type: 'timing', duration: motion.coreDuration, loop: true }}
        style={{
          width: metrics.inner,
          height: metrics.inner,
          borderRadius: innerRadius,
          overflow: 'hidden',
          shadowColor: themeColors.primary,
          shadowOffset: { width: 0, height: size === 'compact' ? 0 : 10 },
          shadowOpacity: size === 'compact' ? 0 : 0.45,
          shadowRadius: size === 'compact' ? 0 : 24,
          elevation: size === 'compact' ? 0 : 12,
          borderWidth: size === 'compact' ? 1 : 0,
          borderColor: 'rgba(255,255,255,0.2)',
        }}
      >
        <LinearGradient
          colors={motion.innerColors as [string, string, ...string[]]}
          start={{ x: 0.15, y: 0.05 }}
          end={{ x: 0.85, y: 1 }}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: innerRadius,
          }}
        >
          {size === 'full' ? (
            <LinearGradient
              colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0)', 'rgba(0,0,0,0.2)']}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          {metrics.showNebula ? (
            <>
              <View
                style={[
                  styles.nebulaA,
                  visual === 'thinking' && styles.nebulaThinking,
                ]}
              />
              <View style={styles.nebulaB} />
            </>
          ) : null}
          <RobotEyes visual={visual} metrics={metrics} />
        </LinearGradient>
      </MotiView>

      {metrics.showHighlight ? <View style={styles.shellHighlight} /> : null}
    </MotiView>
  );

  if (!pressable || !onPress) {
    return content;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  eyesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  shellHighlight: {
    position: 'absolute',
    top: 22,
    left: 38,
    width: 56,
    height: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.22)',
    transform: [{ rotate: '-20deg' }],
  },
  nebulaA: {
    position: 'absolute',
    top: '18%',
    left: '12%',
    width: '55%',
    height: '40%',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
    transform: [{ rotate: '-24deg' }],
  },
  nebulaThinking: {
    backgroundColor: 'rgba(96,165,250,0.25)',
  },
  nebulaB: {
    position: 'absolute',
    bottom: '14%',
    right: '10%',
    width: '48%',
    height: '36%',
    borderRadius: 999,
    backgroundColor: 'rgba(26,82,232,0.35)',
    transform: [{ rotate: '18deg' }],
  },
  pressed: {
    opacity: 0.92,
  },
});

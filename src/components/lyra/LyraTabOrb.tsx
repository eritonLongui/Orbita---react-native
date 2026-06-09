import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { themeColors } from '../../constants/theme';

type LyraTabOrbSize = 'tab' | 'sm' | 'hero';

const SIZE_PRESETS: Record<
  LyraTabOrbSize,
  { halo: number; orb: number; eyeW: number; eyeH: number; eyeGap: number }
> = {
  tab: { halo: 58, orb: 44, eyeW: 4, eyeH: 11, eyeGap: 6 },
  sm: { halo: 32, orb: 24, eyeW: 2.5, eyeH: 7, eyeGap: 3 },
  hero: { halo: 200, orb: 154, eyeW: 14, eyeH: 34, eyeGap: 18 },
};

export const LYRA_TAB_ORB_SIZE = SIZE_PRESETS.tab.halo;

interface LyraTabOrbProps {
  size?: LyraTabOrbSize;
}

export function LyraTabOrb({ size = 'tab' }: LyraTabOrbProps) {
  const metrics = SIZE_PRESETS[size];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: metrics.halo,
          height: metrics.halo,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
        },
        haloOuter: {
          position: 'absolute',
          width: metrics.halo,
          height: metrics.halo,
          borderRadius: metrics.halo / 2,
          overflow: 'hidden',
        },
        haloTint: {
          ...StyleSheet.absoluteFill,
          backgroundColor: 'rgba(75, 139, 255, 0.22)',
          borderRadius: metrics.halo / 2,
        },
        haloInner: {
          position: 'absolute',
          width: metrics.orb + 10,
          height: metrics.orb + 10,
          borderRadius: (metrics.orb + 10) / 2,
          backgroundColor: themeColors.primary,
          shadowColor: themeColors.primaryGlow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.85,
          shadowRadius: size === 'hero' ? 40 : size === 'tab' ? 14 : 10,
          elevation: size === 'hero' ? 14 : size === 'tab' ? 8 : 6,
        },
        pulseRing: {
          position: 'absolute',
          width: metrics.orb + 6,
          height: metrics.orb + 6,
          borderRadius: (metrics.orb + 6) / 2,
          borderWidth: 1.5,
          borderColor: themeColors.primarySoft,
        },
        pulseRingDelayed: {
          position: 'absolute',
          width: metrics.orb + 6,
          height: metrics.orb + 6,
          borderRadius: (metrics.orb + 6) / 2,
          borderWidth: 1,
          borderColor: themeColors.primaryGlow,
        },
        orb: {
          width: metrics.orb,
          height: metrics.orb,
          borderRadius: metrics.orb / 2,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.22)',
          overflow: 'hidden',
          zIndex: 2,
        },
        eyesRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: metrics.eyeGap,
        },
        eye: {
          width: metrics.eyeW,
          height: metrics.eyeH,
          borderRadius: 2,
          backgroundColor: '#FFFFFF',
        },
      }),
    [metrics, size],
  );

  return (
    <View style={styles.container}>
      <MotiView
        style={styles.haloOuter}
        animate={{
          opacity: [0.22, 0.48, 0.22],
          scale: [0.92, 1.14, 0.92],
        }}
        transition={{
          type: 'timing',
          duration: 2400,
          loop: true,
        }}
      >
        {Platform.OS !== 'android' ? (
          <BlurView intensity={36} tint="dark" style={StyleSheet.absoluteFill} />
        ) : null}
        <View style={styles.haloTint} />
      </MotiView>

      <MotiView
        style={styles.haloInner}
        animate={{
          opacity: [0.3, 0.62, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          type: 'timing',
          duration: 1900,
          loop: true,
          delay: 280,
        }}
      />

      <MotiView
        style={styles.pulseRing}
        animate={{
          scale: [0.88, 1.38],
          opacity: [0.42, 0],
        }}
        transition={{
          type: 'timing',
          duration: 2100,
          loop: true,
        }}
      />

      <MotiView
        style={styles.pulseRingDelayed}
        animate={{
          scale: [0.9, 1.32],
          opacity: [0.28, 0],
        }}
        transition={{
          type: 'timing',
          duration: 2100,
          loop: true,
          delay: 1050,
        }}
      />

      <LinearGradient
        colors={[...themeColors.gradient] as [string, string, ...string[]]}
        start={{ x: 0.2, y: 0.1 }}
        end={{ x: 0.85, y: 0.95 }}
        style={styles.orb}
      >
        <MotiView
          animate={{ scaleY: [1, 1, 0.06, 1, 1, 0.06, 1] }}
          transition={{
            type: 'timing',
            duration: 1800,
            loop: true,
          }}
        >
          <View style={styles.eyesRow}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
        </MotiView>
      </LinearGradient>
    </View>
  );
}

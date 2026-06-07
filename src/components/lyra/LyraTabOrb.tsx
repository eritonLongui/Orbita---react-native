import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { themeColors } from '../../constants/theme';

const SIZE = 44;
const HALO_SIZE = 58;
const EYE_W = 4;
const EYE_H = 11;
const EYE_GAP = 6;

export const LYRA_TAB_ORB_SIZE = HALO_SIZE;

export function LyraTabOrb() {
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

const styles = StyleSheet.create({
  container: {
    width: HALO_SIZE,
    height: HALO_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  haloOuter: {
    position: 'absolute',
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: HALO_SIZE / 2,
    overflow: 'hidden',
  },
  haloTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(75, 139, 255, 0.22)',
    borderRadius: HALO_SIZE / 2,
  },
  haloInner: {
    position: 'absolute',
    width: SIZE + 10,
    height: SIZE + 10,
    borderRadius: (SIZE + 10) / 2,
    backgroundColor: themeColors.primary,
    shadowColor: themeColors.primaryGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 14,
    elevation: 8,
  },
  pulseRing: {
    position: 'absolute',
    width: SIZE + 6,
    height: SIZE + 6,
    borderRadius: (SIZE + 6) / 2,
    borderWidth: 1.5,
    borderColor: themeColors.primarySoft,
  },
  pulseRingDelayed: {
    position: 'absolute',
    width: SIZE + 6,
    height: SIZE + 6,
    borderRadius: (SIZE + 6) / 2,
    borderWidth: 1,
    borderColor: themeColors.primaryGlow,
  },
  orb: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
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
    gap: EYE_GAP,
  },
  eye: {
    width: EYE_W,
    height: EYE_H,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
});

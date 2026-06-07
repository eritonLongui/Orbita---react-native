import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { themeColors } from '../../constants/theme';
import type { LyraSessionState } from '../../hooks/useLyraAssistant';

interface LyraTabIconProps {
  state: LyraSessionState;
  size?: number;
}

export function LyraTabIcon({ state, size = 32 }: LyraTabIconProps) {
  const isActive = state === 'recording' || state === 'processing' || state === 'responding';
  const isCompact = size <= 40;

  const colors = isActive
    ? ([...themeColors.gradientVivid] as [string, string, ...string[]])
    : ([...themeColors.gradient] as [string, string, ...string[]]);

  const pulseScale = isActive ? [1, 1.05, 1] : 1;
  const pulseDuration = isActive ? 1200 : 0;

  const metrics = useMemo(() => {
    const orb = size;
    const eyeW = Math.max(2, Math.round(size * 0.08));
    const eyeH = Math.max(6, Math.round(size * 0.2));
    const eyeGap = Math.max(3, Math.round(size * 0.1));
    return { orb, eyeW, eyeH, eyeGap };
  }, [size]);

  return (
    <MotiView
      style={[styles.container, { width: size, height: size }]}
      animate={{ scale: pulseScale }}
      transition={{
        type: 'timing',
        duration: pulseDuration,
        loop: isActive,
      }}
    >
      <View
        style={[
          styles.orb,
          {
            width: metrics.orb,
            height: metrics.orb,
            borderRadius: metrics.orb / 2,
            borderColor: isActive
              ? 'rgba(126, 200, 255, 0.5)'
              : 'rgba(255, 255, 255, 0.22)',
          },
          !isCompact && styles.orbLarge,
        ]}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0.2, y: 0.1 }}
          end={{ x: 0.8, y: 0.9 }}
          style={styles.gradient}
        >
          <View style={[styles.eyesContainer, { gap: metrics.eyeGap }]}>
            <View
              style={{
                width: metrics.eyeW,
                height: metrics.eyeH,
                borderRadius: metrics.eyeW / 2,
                backgroundColor: '#FFFFFF',
              }}
            />
            <View
              style={{
                width: metrics.eyeW,
                height: metrics.eyeH,
                borderRadius: metrics.eyeW / 2,
                backgroundColor: '#FFFFFF',
              }}
            />
          </View>
        </LinearGradient>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    overflow: 'hidden',
    borderWidth: 1,
  },
  orbLarge: {
    shadowColor: themeColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

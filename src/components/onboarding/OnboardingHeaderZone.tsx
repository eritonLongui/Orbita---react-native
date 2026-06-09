import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { themeColors } from '../../constants/theme';
import { OnboardingHeader } from './OnboardingHeader';

const BG = themeColors.bg;
/** Fade abaixo dos dots — conteúdo some gradualmente ao rolar */
export const ONBOARDING_HEADER_FADE_HEIGHT = 24;

interface OnboardingHeaderZoneProps {
  step: number;
  onClose?: () => void;
}

export function OnboardingHeaderZone({ step, onClose }: OnboardingHeaderZoneProps) {
  return (
    <View style={styles.zone} pointerEvents="box-none">
      <View style={styles.bar}>
        <OnboardingHeader step={step} onClose={onClose} />
      </View>
      <LinearGradient
        pointerEvents="none"
        colors={[BG, `${BG}D9`, `${BG}00`]}
        locations={[0, 0.45, 1]}
        style={styles.fade}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  zone: {
    zIndex: 10,
    elevation: 10,
  },
  bar: {
    backgroundColor: BG,
  },
  fade: {
    height: ONBOARDING_HEADER_FADE_HEIGHT,
  },
});

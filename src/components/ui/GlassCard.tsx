import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  highlighted?: boolean;
  padding?: boolean | 'relaxed';
  /** Preenche altura do container pai (cards lado a lado) */
  fill?: boolean;
  /** Visual mais leve — útil em cards expansíveis */
  subtle?: boolean;
}

export function GlassCard({
  children,
  highlighted = false,
  padding = true,
  fill = false,
  subtle = false,
}: GlassCardProps) {
  return (
    <View
      style={[
        styles.container,
        subtle && styles.subtle,
        highlighted && styles.highlighted,
        fill && styles.fill,
      ]}
    >
      {Platform.OS !== 'web' ? (
        <BlurView intensity={subtle ? 22 : 36} tint="dark" style={StyleSheet.absoluteFill} />
      ) : null}
      <View
        style={[
          styles.overlay,
          subtle && styles.subtleOverlay,
          Platform.OS === 'web' && styles.webOverlay,
          Platform.OS === 'web' && subtle && styles.webSubtleOverlay,
        ]}
      />
      <YStack
        flex={fill ? 1 : undefined}
        p={padding === 'relaxed' ? '$5' : padding ? '$4' : 0}
        gap="$3"
        position="relative"
      >
        {children}
      </YStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: themeColors.glassBorder,
  },
  fill: {
    flex: 1,
  },
  highlighted: {
    borderColor: 'rgba(75, 139, 255, 0.65)',
    shadowColor: themeColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: themeColors.glass,
  },
  subtle: {
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  subtleOverlay: {
    backgroundColor: 'rgba(8, 8, 8, 0.84)',
  },
  webOverlay: {
    backgroundColor: 'rgba(8, 8, 8, 0.9)',
  },
  webSubtleOverlay: {
    backgroundColor: 'rgba(8, 8, 8, 0.86)',
  },
});

import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Spinner, Text } from 'tamagui';
import { themeColors } from '../../constants/theme';

interface GlassButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
}

export function GlassButton({
  label,
  onPress,
  loading,
  disabled,
  variant = 'primary',
}: GlassButtonProps) {
  const isDisabled = loading || disabled;
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.wrapper,
        isPrimary ? styles.wrapperPrimary : styles.wrapperOutline,
        isDisabled && styles.wrapperDisabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {Platform.OS !== 'web' && !isDisabled ? (
        <BlurView intensity={35} tint="dark" style={styles.blur} />
      ) : null}
      <View
        style={[
          styles.overlay,
          isPrimary && !isDisabled && styles.overlayPrimary,
          isDisabled && styles.overlayDisabled,
          Platform.OS === 'web' && styles.webOverlay,
        ]}
      />
      {loading ? (
        <Spinner color={isDisabled ? themeColors.textSubtle : themeColors.text} />
      ) : (
        <Text
          fontWeight="700"
          fontSize={16}
          style={{
            color: isDisabled ? themeColors.textSubtle : themeColors.text,
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 52,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  wrapperPrimary: {
    borderColor: themeColors.glassBorderStrong,
  },
  wrapperOutline: {
    borderColor: themeColors.glassBorder,
  },
  wrapperDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  blur: {
    ...StyleSheet.absoluteFill,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: themeColors.glass,
  },
  overlayPrimary: {
    backgroundColor: themeColors.glassButton,
  },
  overlayDisabled: {
    backgroundColor: themeColors.glassButtonDisabled,
  },
  webOverlay: {
    backgroundColor: 'rgba(28, 30, 38, 0.92)',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});

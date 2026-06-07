import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Microphone, Sparkle } from 'phosphor-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';

interface LyraBannerProps {
  onPress: () => void;
  variant?: 'default' | 'promo';
}

export function LyraBanner({ onPress, variant = 'default' }: LyraBannerProps) {
  const isPromo = variant === 'promo';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <LinearGradient
        colors={isPromo ? ['#1A2F5C', '#243B6E', '#2F5FD4'] : [...themeColors.gradientMuted]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, isPromo && styles.promoGradient]}
      >
        <LinearGradient
          colors={['rgba(110, 196, 255, 0.35)', 'transparent', 'rgba(75, 139, 255, 0.15)']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {isPromo ? (
          <View style={styles.glowOrb} />
        ) : null}

        <XStack items="center" gap="$3" p={isPromo ? '$5' : '$4'}>
          <MotiView
            animate={isPromo ? { scale: [1, 1.06, 1] } : undefined}
            transition={{ type: 'timing', duration: 2200, loop: isPromo }}
          >
            <LinearGradient
              colors={[...themeColors.gradient]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconOrb}
            >
              <Microphone size={isPromo ? 28 : 24} color="white" weight="fill" />
            </LinearGradient>
          </MotiView>

          <YStack flex={1} gap="$1.5">
            {isPromo ? (
              <XStack items="center" gap="$1.5">
                <Sparkle size={14} color={themeColors.primaryGlow} weight="fill" />
                <Text fontSize={12} fontWeight="700" color={themeColors.primaryGlow} letterSpacing={0.5}>
                  ASSISTENTE DE VOZ
                </Text>
              </XStack>
            ) : null}
            <Text fontSize={isPromo ? 20 : 17} fontWeight="800" color="white" lineHeight={isPromo ? 26 : 22}>
              {isPromo ? 'Lyra está pronta para ouvir você' : 'Conversar com Lyra'}
            </Text>
            <Text fontSize={13} color="rgba(255,255,255,0.85)" lineHeight={18}>
              {isPromo
                ? 'Faça um check-in de 1 minuto e receba orientação personalizada.'
                : 'Check-in rápido por voz.'}
            </Text>
          </YStack>

          {isPromo ? (
            <YStack
              width={36}
              height={36}
              rounded={999}
              bg="rgba(255,255,255,0.12)"
              items="center"
              justify="center"
            >
              <ArrowRight size={18} color="white" weight="bold" />
            </YStack>
          ) : null}
        </XStack>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(75, 139, 255, 0.3)',
  },
  promoGradient: {
    borderColor: 'rgba(110, 196, 255, 0.45)',
    shadowColor: themeColors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  glowOrb: {
    position: 'absolute',
    top: -30,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(110, 196, 255, 0.18)',
  },
  iconOrb: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});

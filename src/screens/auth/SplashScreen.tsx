import { MotiView } from 'moti';
import React, { useEffect } from 'react';
import { Text, YStack } from 'tamagui';
import { AppBackground } from '../../components/ui/AppBackground';
import { GlassCard } from '../../components/ui/GlassCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(onFinish, 1600);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AppBackground>
      <StatusBar style="light" />
      <YStack
        flex={1}
        items="center"
        justify="center"
        gap="$4"
        pt={insets.top}
        pb={insets.bottom}
      >
        <MotiView
          from={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 800 }}
        >
          <GlassCard highlighted padding>
            <YStack width={72} height={72} items="center" justify="center">
              <Text fontSize={36} fontWeight="800" color="$text">
                O
              </Text>
            </YStack>
          </GlassCard>
        </MotiView>
        <MotiView
          from={{ opacity: 0, translateY: 8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 250 }}
        >
          <YStack items="center" gap="$1">
            <Text fontSize={26} fontWeight="800" color="$text" letterSpacing={3}>
              ORBITA
            </Text>
            <Text fontSize={12} color="$textMuted" letterSpacing={1.5}>
              SEU COPILOTO
            </Text>
          </YStack>
        </MotiView>
      </YStack>
    </AppBackground>
  );
}

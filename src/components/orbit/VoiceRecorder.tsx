import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Microphone } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';

interface VoiceRecorderProps {
  active: boolean;
  onPress: () => void;
}

const WAVE_HEIGHTS = [12, 24, 18, 32, 16, 28, 14, 22];

export function VoiceRecorder({ active, onPress }: VoiceRecorderProps) {
  return (
    <YStack items="center" gap="$4">
      <MotiView
        animate={{ scale: active ? [1, 1.08, 1] : 1 }}
        transition={{ type: 'timing', duration: 1200, loop: active }}
      >
        <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
          <LinearGradient
            colors={[...themeColors.gradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.orb}
          >
            <Microphone size={40} color="white" weight="fill" />
          </LinearGradient>
        </Pressable>
      </MotiView>

      {active ? (
        <XStack gap="$1" items="flex-end" height={36}>
          {WAVE_HEIGHTS.map((h, i) => (
            <MotiView
              key={i}
              animate={{ height: [h, h + 12, h] }}
              transition={{
                type: 'timing',
                duration: 600 + i * 80,
                loop: true,
              }}
              style={{
                width: 4,
                borderRadius: 4,
                backgroundColor: themeColors.primary,
              }}
            />
          ))}
        </XStack>
      ) : null}

      <Text fontSize={13} color="$textMuted" style={{ textAlign: 'center' }}>
        {active
          ? 'Fale agora. Paro sozinha no silêncio — ou toque para enviar'
          : 'Toque e fale com a Lyra'}
      </Text>
    </YStack>
  );
}

const styles = StyleSheet.create({
  orb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: themeColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  pressed: {
    opacity: 0.9,
  },
});

import { LinearGradient } from 'expo-linear-gradient';
import { RocketLaunch } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';

interface MissionStatusCardProps {
  title: string;
  description: string;
  onPress: () => void;
}

export function MissionStatusCard({ title, description, onPress }: MissionStatusCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      <LinearGradient
        colors={[...themeColors.gradientVivid]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <LinearGradient
          colors={['rgba(120, 190, 255, 0.55)', 'rgba(59, 130, 255, 0.2)', 'transparent']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.decorIcon} pointerEvents="none">
          <RocketLaunch size={96} color="rgba(255, 255, 255, 0.1)" />
        </View>

        <YStack gap="$2.5" pr={56}>
          <Text
            fontSize={11}
            fontWeight="800"
            letterSpacing={1.4}
            style={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            STATUS DA MISSÃO
          </Text>
          <Text fontSize={22} fontWeight="800" color="white" lineHeight={28}>
            {title}
          </Text>
          <Text fontSize={14} lineHeight={21} style={{ color: 'rgba(255, 255, 255, 0.92)' }}>
            {description}
          </Text>
        </YStack>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(140, 200, 255, 0.45)',
    minHeight: 148,
  },
  decorIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});

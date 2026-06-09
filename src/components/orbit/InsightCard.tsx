import { LinearGradient } from 'expo-linear-gradient';
import { Lightbulb } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';
import { OrbitaCard } from '../ui/OrbitaCard';

interface InsightCardProps {
  insight: string;
  title?: string;
  variant?: 'default' | 'banner';
}

export function InsightCard({
  insight,
  title = 'Insight da Lyra',
  variant = 'default',
}: InsightCardProps) {
  if (variant === 'banner') {
    return (
      <LinearGradient
        colors={['#0F1A2E', '#080C14', themeColors.bg]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bannerGradient}
      >
        <LinearGradient
          colors={['rgba(43, 75, 140, 0.22)', 'rgba(12, 18, 30, 0.12)', 'transparent']}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <YStack gap="$2.5">
          <XStack items="center" gap="$2">
            <Lightbulb size={16} color="rgba(255, 255, 255, 0.72)" weight="fill" />
            <Text
              fontSize={11}
              fontWeight="800"
              letterSpacing={1.4}
              style={{ color: 'rgba(255, 255, 255, 0.72)' }}
            >
              {title.toUpperCase()}
            </Text>
          </XStack>
          <Text
            fontSize={16}
            fontWeight="500"
            lineHeight={23}
            style={{ color: 'rgba(255, 255, 255, 0.92)' }}
          >
            {insight}
          </Text>
        </YStack>
      </LinearGradient>
    );
  }

  return (
    <OrbitaCard>
      <YStack gap="$3">
        <XStack items="center" gap="$1.5">
          <Lightbulb size={16} color={themeColors.textMuted} />
          <Text fontSize={13} fontWeight="700" style={{ color: themeColors.textMuted }}>
            {title}
          </Text>
        </XStack>
        <Text fontSize={15} color="$text" lineHeight={22}>
          {insight}
        </Text>
      </YStack>
    </OrbitaCard>
  );
}

const styles = StyleSheet.create({
  bannerGradient: {
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    minHeight: 120,
  },
});

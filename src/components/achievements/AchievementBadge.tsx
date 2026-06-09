import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowCounterClockwise,
  Calendar,
  ChatCircle,
  CheckCircle,
  Compass,
  Drop,
  Fire,
  Heart,
  type Icon as PhosphorIcon,
  Lightning,
  ListChecks,
  Lock,
  Medal,
  Moon,
  Planet,
  RocketLaunch,
  Scales,
  Sparkle,
  Star,
  Trophy,
} from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, YStack } from 'tamagui';
import { AchievementDef } from '../../constants/achievements';
import { themeColors } from '../../constants/theme';
import { TitleText } from '../ui/TitleText';

const ICON_MAP: Record<string, PhosphorIcon> = {
  RocketLaunch,
  Fire,
  Star,
  Medal,
  Planet,
  Scales,
  Lightning,
  CheckCircle,
  ListChecks,
  Trophy,
  ChatCircle,
  Moon,
  Drop,
  Heart,
  Sparkle,
  Calendar,
  Compass,
  ArrowCounterClockwise,
};

interface AchievementBadgeProps {
  definition: AchievementDef;
  unlocked: boolean;
  unlockedAt?: string;
}

export function AchievementBadge({ definition, unlocked }: AchievementBadgeProps) {
  const Icon = ICON_MAP[definition.icon] ?? Star;

  if (unlocked) {
    return (
      <LinearGradient
        colors={[...themeColors.gradientVivid]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.unlockedCard}
      >
        <LinearGradient
          colors={['rgba(120, 190, 255, 0.55)', 'rgba(59, 130, 255, 0.2)', 'transparent']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.decorIcon} pointerEvents="none">
          <Icon size={72} color="rgba(255, 255, 255, 0.1)" weight="fill" />
        </View>

        <YStack items="center" gap="$2" py="$4" px="$3" flex={1}>
          <View style={styles.unlockedIconCircle}>
            <Icon size={28} color="white" weight="fill" />
          </View>
          <TitleText size="sm" weight="700" color="white" text="center">
            {definition.title.toUpperCase()}
          </TitleText>
          <Text
            fontSize={12}
            fontWeight="500"
            text="center"
            lineHeight={16}
            numberOfLines={3}
            style={{ color: 'rgba(255, 255, 255, 0.9)' }}
          >
            {definition.description}
          </Text>
        </YStack>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.lockedCard}>
      <YStack items="center" gap="$2" py="$4" px="$3" flex={1}>
        <View style={styles.lockedIconCircle}>
          <Lock size={20} color="rgba(255, 255, 255, 0.45)" />
        </View>
        <TitleText
          size="sm"
          weight="700"
          text="center"
          style={{ color: 'rgba(255, 255, 255, 0.72)' }}
        >
          {definition.title.toUpperCase()}
        </TitleText>
        <Text
          fontSize={12}
          fontWeight="500"
          text="center"
          lineHeight={16}
          numberOfLines={3}
          style={{ color: 'rgba(255, 255, 255, 0.5)' }}
        >
          {definition.description}
        </Text>
      </YStack>
    </View>
  );
}

const styles = StyleSheet.create({
  unlockedCard: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    minHeight: 160,
  },
  decorIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  unlockedIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  lockedCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: themeColors.surface,
    borderWidth: 1,
    borderColor: themeColors.glassBorder,
    minHeight: 160,
  },
  lockedIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
});

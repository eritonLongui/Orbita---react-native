import React from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Spinner, Text, YStack } from 'tamagui';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { TitleText } from '../../components/ui/TitleText';
import { TwoColumnGrid } from '../../components/ui/TwoColumnGrid';
import { AchievementBadge } from '../../components/achievements/AchievementBadge';
import { useAchievements } from '../../hooks/useAchievements';
import { ACHIEVEMENTS } from '../../constants/achievements';

export function AchievementsScreen() {
  const { achievements, loading, unlockedCount, totalCount } = useAchievements();

  return (
    <ScreenWrapper tabBarOffset>
      <YStack gap="$5" pb="$14" pt="$4" width="100%">
        <YStack gap="$2">
          <TitleText size="screen">Conquistas</TitleText>
          <Text fontSize={15} color="$textMuted" lineHeight={22}>
            {unlockedCount} de {totalCount} desbloqueadas
          </Text>
        </YStack>

        {loading ? (
          <YStack py="$10" items="center">
            <Spinner size="large" color="$primary" />
          </YStack>
        ) : (
          <Animated.View entering={FadeIn.duration(400)} style={{ width: '100%' }}>
            <TwoColumnGrid
              items={ACHIEVEMENTS}
              keyExtractor={(def) => def.id}
              renderItem={(def) => {
                const state = achievements.find((a) => a.id === def.id);
                return (
                  <AchievementBadge
                    definition={def}
                    unlocked={state?.unlocked ?? false}
                    unlockedAt={state?.unlockedAt}
                  />
                );
              }}
            />
          </Animated.View>
        )}
      </YStack>
    </ScreenWrapper>
  );
}

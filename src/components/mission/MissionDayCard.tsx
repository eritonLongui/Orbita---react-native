import { RocketLaunch, Star } from 'phosphor-react-native';
import React from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';
import { OrbitaCard } from '../ui/OrbitaCard';
import { TitleText } from '../ui/TitleText';

interface MissionDayCardProps {
  missionDay: number;
  streak: number;
}

function getStreakCopy(streak: number): string {
  if (streak <= 1) return 'Volte amanhã para manter o ritmo.';
  if (streak < 7) return 'Ótimo começo — siga na missão.';
  return 'Ritmo forte na sua órbita.';
}

export function MissionDayCard({ missionDay, streak }: MissionDayCardProps) {
  const sequenceSuffix = streak === 1 ? 'dia seguido' : 'dias seguidos';

  return (
    <OrbitaCard>
      <XStack gap="$4">
        <YStack flex={1} gap="$2">
          <XStack items="center" gap="$2">
            <RocketLaunch size={18} color={themeColors.primarySoft} weight="fill" />
            <Text fontSize={12} fontWeight="700" letterSpacing={0.8} color="$textMuted">
              MINHA MISSÃO
            </Text>
          </XStack>
          <TitleText size="lg" lineHeight={26}>
            Dia {missionDay}
          </TitleText>
          <Text fontSize={13} color="$textSupport" lineHeight={18}>
            Desde que você entrou na Orbita
          </Text>
        </YStack>

        <YStack
          width={1}
          bg="$glassBorder"
          alignSelf="stretch"
          my="$1"
        />

        <YStack flex={1} gap="$2" justify="center">
          <XStack items="center" gap="$2">
            <Star size={18} color={themeColors.warning} weight="fill" />
            <Text fontSize={12} fontWeight="700" letterSpacing={0.8} color="$textMuted">
              SEQUÊNCIA
            </Text>
          </XStack>
          <XStack items="baseline" gap="$1.5" flexWrap="nowrap">
            <TitleText size="card" lineHeight={26} flexShrink={0}>
              {streak}
            </TitleText>
            <Text fontSize={13} fontWeight="600" color="$text" lineHeight={18} flexShrink={1}>
              {sequenceSuffix}
            </Text>
          </XStack>
          <Text fontSize={13} color="$textSupport" lineHeight={18}>
            {getStreakCopy(streak)}
          </Text>
        </YStack>
      </XStack>
    </OrbitaCard>
  );
}

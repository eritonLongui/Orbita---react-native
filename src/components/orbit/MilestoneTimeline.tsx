import { Star } from 'phosphor-react-native';
import React from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';
import { Milestone } from '../../types';
import { OrbitaCard } from '../ui/OrbitaCard';

interface MilestoneTimelineProps {
  milestones: Milestone[];
}

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  if (milestones.length === 0) {
    return (
      <OrbitaCard>
        <Text fontSize={14} color="$textMuted">
          Aguardando análise
        </Text>
      </OrbitaCard>
    );
  }

  return (
    <YStack gap="$3">
      {milestones.map((milestone, index) => (
        <XStack key={milestone.id} gap="$3" items="flex-start">
          <YStack items="center" width={24}>
            <YStack
              width={24}
              height={24}
              rounded={999}
              bg="$primaryBg"
              items="center"
              justify="center"
            >
              <Star size={12} color={themeColors.primary} weight="fill" />
            </YStack>
            {index < milestones.length - 1 ? (
              <YStack width={2} flex={1} bg="$border" minH={24} mt="$1" />
            ) : null}
          </YStack>
          <YStack flex={1} gap="$1" pb="$2">
            <Text fontSize={14} fontWeight="600" color="$text">
              {milestone.title}
            </Text>
            <Text fontSize={12} color="$textMuted">
              {milestone.date}
            </Text>
          </YStack>
        </XStack>
      ))}
    </YStack>
  );
}

import { Lightbulb } from 'phosphor-react-native';
import React from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';
import { OrbitaCard } from '../ui/OrbitaCard';

interface InsightCardProps {
  insight: string;
  title?: string;
}

export function InsightCard({ insight, title = 'Insight da Lyra' }: InsightCardProps) {
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

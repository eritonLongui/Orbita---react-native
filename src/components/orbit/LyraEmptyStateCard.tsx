import React from 'react';
import { Text, YStack } from 'tamagui';
import { TalkToLyraButton } from '../lyra/TalkToLyraButton';
import { OrbitaCard } from '../ui/OrbitaCard';
import { TitleText } from '../ui/TitleText';

interface LyraEmptyStateCardProps {
  title: string;
  description: string;
  onPress: () => void;
}

export function LyraEmptyStateCard({ title, description, onPress }: LyraEmptyStateCardProps) {
  return (
    <OrbitaCard>
      <YStack gap="$3" items="center" width="100%">
        <TitleText size="sm" text="center">
          {title}
        </TitleText>
        <Text fontSize={14} color="$textMuted" lineHeight={20} text="center">
          {description}
        </Text>
        <TalkToLyraButton variant="primary" fullWidth onPress={onPress} />
      </YStack>
    </OrbitaCard>
  );
}

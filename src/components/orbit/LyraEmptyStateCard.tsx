import React from 'react';
import { Text, YStack } from 'tamagui';
import { TalkToLyraButton } from '../lyra/TalkToLyraButton';
import { OrbitaCard } from '../ui/OrbitaCard';

interface LyraEmptyStateCardProps {
  title: string;
  description: string;
  onPress: () => void;
}

export function LyraEmptyStateCard({ title, description, onPress }: LyraEmptyStateCardProps) {
  return (
    <OrbitaCard>
      <YStack gap="$3">
        <Text fontSize={16} fontWeight="700" color="$text">
          {title}
        </Text>
        <Text fontSize={14} color="$textMuted" lineHeight={20}>
          {description}
        </Text>
        <TalkToLyraButton onPress={onPress} />
      </YStack>
    </OrbitaCard>
  );
}

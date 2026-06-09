import React from 'react';
import { Text, YStack } from 'tamagui';
import { PrimaryButton } from '../ui/PrimaryButton';
import { OrbitaCard } from '../ui/OrbitaCard';

interface LyraEmptyStateCardProps {
  title: string;
  description: string;
  ctaLabel?: string;
  onPress: () => void;
}

export function LyraEmptyStateCard({
  title,
  description,
  ctaLabel = 'Ir para a Lyra',
  onPress,
}: LyraEmptyStateCardProps) {
  return (
    <OrbitaCard>
      <YStack gap="$3">
        <Text fontSize={16} fontWeight="700" color="$text">
          {title}
        </Text>
        <Text fontSize={14} color="$textMuted" lineHeight={20}>
          {description}
        </Text>
        <PrimaryButton label={ctaLabel} onPress={onPress} />
      </YStack>
    </OrbitaCard>
  );
}

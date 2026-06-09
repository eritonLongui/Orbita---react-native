import React from 'react';
import { Text, YStack } from 'tamagui';
import { OrbitaCard } from '../ui/OrbitaCard';

interface LyraFirstSessionBannerProps {
  isTextMode?: boolean;
}

export function LyraFirstSessionBanner({ isTextMode = false }: LyraFirstSessionBannerProps) {
  return (
    <OrbitaCard highlighted>
      <YStack gap="$2">
        <Text fontSize={13} fontWeight="800" letterSpacing={1.2} color="$primary">
          PRIMEIRO CHECK-IN
        </Text>
        <Text fontSize={16} fontWeight="700" color="$text" lineHeight={22}>
          A Lyra vai guiar o check-in.
        </Text>
        <Text fontSize={14} color="$textMuted" lineHeight={20}>
          {isTextMode
            ? 'Ela pergunta área por área — responda e sua órbita toma forma.'
            : 'Ela começa falando e pergunta sobre descanso, energia, ritmo, nutrição e bem-estar.'}
        </Text>
        <Text fontSize={13} color="$textSupport" lineHeight={18}>
          No dia a dia, você começa pela Missão e faz o check-in aqui com a Lyra.
        </Text>
      </YStack>
    </OrbitaCard>
  );
}

import { Planet } from 'phosphor-react-native';
import React from 'react';
import { Text, YStack } from 'tamagui';
import { OrbitaCard } from '../ui/OrbitaCard';

export function MissionStatsPlaceholder() {
  return (
    <YStack gap="$3">
      <Text fontSize={13} fontWeight="800" letterSpacing={1.2} color="$textMuted">
        RESUMO DA MINHA ÓRBITA
      </Text>
      <OrbitaCard>
        <YStack gap="$3" items="center" py="$2">
          <Planet size={32} color="#6B7280" />
          <Text fontSize={15} fontWeight="600" color="$text" style={{ textAlign: 'center' }}>
            Seu resumo aparece depois do check-in
          </Text>
          <Text fontSize={14} color="$textMuted" lineHeight={20} style={{ textAlign: 'center' }}>
            Converse com a Lyra para mapear suas cinco áreas e ver como está sua órbita hoje.
          </Text>
        </YStack>
      </OrbitaCard>
    </YStack>
  );
}

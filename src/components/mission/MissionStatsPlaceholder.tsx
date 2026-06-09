import { Planet } from 'phosphor-react-native';
import React from 'react';
import { Text, YStack } from 'tamagui';
import { TalkToLyraButton } from '../lyra/TalkToLyraButton';
import { OrbitaCard } from '../ui/OrbitaCard';
import { SectionTitle } from '../ui/SectionTitle';

interface MissionStatsPlaceholderProps {
  onTalkToLyra?: () => void;
}

export function MissionStatsPlaceholder({ onTalkToLyra }: MissionStatsPlaceholderProps) {
  return (
    <YStack gap="$3">
      <SectionTitle>Resumo da minha órbita</SectionTitle>
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
      {onTalkToLyra ? <TalkToLyraButton variant="outline" onPress={onTalkToLyra} /> : null}
    </YStack>
  );
}

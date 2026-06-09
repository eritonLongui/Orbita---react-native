import { Check } from 'phosphor-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { OrbitaCard } from '../ui/OrbitaCard';

interface TodayChecklistProps {
  checkInDone: boolean;
  onPressCheckIn: () => void;
}

function CheckIcon({ done }: { done: boolean }) {
  if (done) {
    return (
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: '#34D399',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Check size={14} color="#fff" weight="bold" />
      </View>
    );
  }
  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#6B7280',
      }}
    />
  );
}

export function TodayChecklist({ checkInDone, onPressCheckIn }: TodayChecklistProps) {
  return (
    <YStack gap="$3">
      <Text fontSize={13} fontWeight="800" letterSpacing={1.2} color="$textMuted">
        LISTA DE TAREFAS
      </Text>
      <OrbitaCard>
        <Pressable onPress={checkInDone ? undefined : onPressCheckIn}>
          <XStack gap="$3" items="center">
            <CheckIcon done={checkInDone} />
            <YStack flex={1} gap="$0.5">
              <Text fontSize={15} fontWeight="600" color="$text">
                Check-in com a Lyra
              </Text>
              <Text fontSize={13} color="$textMuted" lineHeight={18}>
                {checkInDone
                  ? 'Concluído por hoje — ótimo ritmo.'
                  : 'Alguns minutos para atualizar sua órbita.'}
              </Text>
            </YStack>
          </XStack>
        </Pressable>
      </OrbitaCard>
    </YStack>
  );
}

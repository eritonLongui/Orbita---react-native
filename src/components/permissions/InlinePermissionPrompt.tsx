import React from 'react';
import { Pressable } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { OrbitaCard } from '../ui/OrbitaCard';
import { PrimaryButton } from '../ui/PrimaryButton';

interface InlinePermissionPromptProps {
  title: string;
  message: string;
  onAllow: () => void;
  onSkip: () => void;
  loading?: boolean;
}

export function InlinePermissionPrompt({
  title,
  message,
  onAllow,
  onSkip,
  loading,
}: InlinePermissionPromptProps) {
  return (
    <OrbitaCard>
      <YStack gap="$3">
        <YStack gap="$1">
          <Text fontSize={16} fontWeight="700" color="$text">
            {title}
          </Text>
          <Text fontSize={14} color="$textMuted" lineHeight={20}>
            {message}
          </Text>
        </YStack>
        <XStack gap="$3" items="center">
          <YStack flex={1}>
            <PrimaryButton label="Permitir" onPress={onAllow} loading={loading} />
          </YStack>
          <Pressable onPress={onSkip} accessibilityRole="button" disabled={loading}>
            <Text fontSize={14} fontWeight="600" color="$textMuted">
              Agora não
            </Text>
          </Pressable>
        </XStack>
      </YStack>
    </OrbitaCard>
  );
}

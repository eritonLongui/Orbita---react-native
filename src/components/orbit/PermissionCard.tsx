import React from 'react';
import { Pressable } from 'react-native';
import { Text, YStack } from 'tamagui';
import { OrbitaCard } from '../ui/OrbitaCard';
import { PrimaryButton } from '../ui/PrimaryButton';

interface PermissionCardProps {
  title: string;
  message: string;
  context?: string;
  onAllow: () => void;
  onSkip?: () => void;
  skipLabel?: string;
  loading?: boolean;
}

export function PermissionCard({
  title,
  message,
  context,
  onAllow,
  onSkip,
  skipLabel = 'Agora não',
  loading,
}: PermissionCardProps) {
  return (
    <YStack flex={1} justify="center" gap="$5" py="$4">
      <YStack gap="$3">
        <Text fontSize={28} fontWeight="800" color="$text">
          {title}
        </Text>
        {context ? (
          <Text fontSize={15} color="$textMuted" lineHeight={22}>
            {context}
          </Text>
        ) : null}
        <OrbitaCard>
          <Text fontSize={16} color="$text" lineHeight={24}>
            {message}
          </Text>
        </OrbitaCard>
      </YStack>
      <YStack gap="$3">
        <PrimaryButton label="Permitir" onPress={onAllow} loading={loading} />
        {onSkip ? (
          <Pressable onPress={onSkip} accessibilityRole="button">
            <Text fontSize={15} fontWeight="600" color="$textMuted" style={{ textAlign: 'center' }}>
              {skipLabel}
            </Text>
          </Pressable>
        ) : null}
      </YStack>
    </YStack>
  );
}

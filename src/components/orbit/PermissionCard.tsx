import React from 'react';
import { Text, YStack } from 'tamagui';
import { OrbitaCard } from '../ui/OrbitaCard';
import { PrimaryButton } from '../ui/PrimaryButton';

interface PermissionCardProps {
  title: string;
  message: string;
  onAllow: () => void;
  loading?: boolean;
}

export function PermissionCard({ title, message, onAllow, loading }: PermissionCardProps) {
  return (
    <YStack flex={1} justify="center" gap="$5" py="$4">
      <YStack gap="$3">
        <Text fontSize={28} fontWeight="800" color="$text">
          {title}
        </Text>
        <OrbitaCard>
          <Text fontSize={16} color="$text" lineHeight={24}>
            {message}
          </Text>
        </OrbitaCard>
      </YStack>
      <PrimaryButton label="Permitir" onPress={onAllow} loading={loading} />
    </YStack>
  );
}

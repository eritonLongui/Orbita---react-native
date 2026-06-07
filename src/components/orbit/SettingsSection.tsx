import React from 'react';
import { Text, YStack } from 'tamagui';
import { OrbitaCard } from '../ui/OrbitaCard';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <YStack gap="$2">
      <Text fontSize={12} fontWeight="700" color="$textMuted" letterSpacing={1}>
        {title}
      </Text>
      <OrbitaCard>{children}</OrbitaCard>
    </YStack>
  );
}

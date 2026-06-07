import React from 'react';
import { Text, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';

interface GlassChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function GlassChip({ label, selected = false, onPress }: GlassChipProps) {
  return (
    <YStack
      px="$3"
      py="$2"
      rounded={999}
      bg={selected ? '$primaryBg' : '$glassButton'}
      borderWidth={1}
      borderColor={selected ? '$primary' : 'rgba(255, 255, 255, 0.14)'}
      pressStyle={{ opacity: 0.85 }}
      onPress={onPress}
    >
      <Text
        fontSize={13}
        fontWeight="700"
        style={{ color: selected ? themeColors.primarySoft : themeColors.textMuted }}
      >
        {label}
      </Text>
    </YStack>
  );
}

import {
  Clock,
  Drop,
  GameController,
  Moon,
  PersonSimpleRun,
} from 'phosphor-react-native';
import React from 'react';
import { Text, XStack } from 'tamagui';
import { themeColors } from '../../constants/theme';
import { PillarType } from '../../types';

const ICONS = {
  sleep: Moon,
  movement: PersonSimpleRun,
  routine: Clock,
  nutrition: Drop,
  leisure: GameController,
} as const;

interface PillarChipProps {
  type: PillarType;
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function PillarChip({ type, label, selected, onPress }: PillarChipProps) {
  const Icon = ICONS[type];

  return (
    <XStack
      items="center"
      gap="$2"
      px="$3"
      py="$2"
      rounded={999}
      bg={selected ? '$primaryBg' : '$glass'}
      borderWidth={1}
      borderColor={selected ? '$primary' : '$glassBorder'}
      pressStyle={{ opacity: 0.85 }}
      onPress={onPress}
    >
      <Icon size={18} color={themeColors.primary} weight="duotone" />
      <Text fontSize={13} fontWeight="600" color={selected ? '$primary' : '$text'}>
        {label}
      </Text>
    </XStack>
  );
}

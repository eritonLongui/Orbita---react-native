import React from 'react';
import { Pressable } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';

interface StepperInputProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function StepperInput({
  label,
  value,
  min = 0,
  max = 20,
  unit,
  onChange,
}: StepperInputProps) {
  return (
    <YStack>
      <Text fontSize={14} fontWeight="600" color="$text">
        {label}
      </Text>
      <XStack items="center" justify="space-between" gap="$3" mt="$4">
        <Pressable
          onPress={() => onChange(Math.max(min, value - 1))}
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: themeColors.surfaceMuted,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text fontSize={22} fontWeight="700" color="$text">
            −
          </Text>
        </Pressable>
        <Text fontSize={24} fontWeight="800" color="$primary" minWidth={60} text="center">
          {value}
          {unit ? ` ${unit}` : ''}
        </Text>
        <Pressable
          onPress={() => onChange(Math.min(max, value + 1))}
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: themeColors.surfaceMuted,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text fontSize={22} fontWeight="700" color="$text">
            +
          </Text>
        </Pressable>
      </XStack>
    </YStack>
  );
}

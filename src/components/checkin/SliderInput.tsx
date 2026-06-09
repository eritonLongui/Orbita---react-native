import React from 'react';
import { Pressable, View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';

interface SliderInputProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function SliderInput({
  label,
  value,
  min = 0,
  max = 10,
  step = 1,
  unit,
  onChange,
}: SliderInputProps) {
  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(Math.min(max, value + step));
  const range = max - min || 1;
  const fillPct = ((value - min) / range) * 100;

  return (
    <YStack>
      <XStack justify="space-between" items="center">
        <Text fontSize={14} fontWeight="600" color="$text">
          {label}
        </Text>
        <Text fontSize={18} fontWeight="800" color="$primary">
          {value}
          {unit ? ` ${unit}` : ''}
        </Text>
      </XStack>
      <View
        style={{
          height: 6,
          borderRadius: 3,
          backgroundColor: themeColors.surfaceMuted,
          overflow: 'hidden',
          marginTop: 16,
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${fillPct}%`,
            backgroundColor: themeColors.primary,
            borderRadius: 3,
          }}
        />
      </View>
      <XStack justify="space-between" gap="$3" mt="$4">
        <Pressable
          onPress={decrement}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 12,
            backgroundColor: themeColors.surfaceMuted,
            alignItems: 'center',
          }}
        >
          <Text fontSize={20} fontWeight="700" color="$text">
            −
          </Text>
        </Pressable>
        <Pressable
          onPress={increment}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 12,
            backgroundColor: themeColors.surfaceMuted,
            alignItems: 'center',
          }}
        >
          <Text fontSize={20} fontWeight="700" color="$text">
            +
          </Text>
        </Pressable>
      </XStack>
    </YStack>
  );
}

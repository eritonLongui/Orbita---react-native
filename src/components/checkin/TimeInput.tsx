import React from 'react';
import { Pressable } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function parseHour(value: string): number {
  const h = Number.parseInt(value.split(':')[0] ?? '0', 10);
  return Number.isFinite(h) ? Math.min(23, Math.max(0, h)) : 0;
}

function formatHour(h: number): string {
  return `${String(h).padStart(2, '0')}:00`;
}

export function TimeInput({ label, value, onChange }: TimeInputProps) {
  const hour = parseHour(value);

  return (
    <YStack>
      <Text fontSize={14} fontWeight="600" color="$text">
        {label}
      </Text>
      <XStack items="center" justify="space-between" gap="$3" mt="$4">
        <Pressable
          onPress={() => onChange(formatHour((hour + 23) % 24))}
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
        <Text fontSize={22} fontWeight="800" color="$primary">
          {formatHour(hour)}
        </Text>
        <Pressable
          onPress={() => onChange(formatHour((hour + 1) % 24))}
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

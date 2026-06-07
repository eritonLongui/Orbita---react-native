import { CaretRight } from 'phosphor-react-native';
import React from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';
import { GlassCard } from '../ui/GlassCard';

interface SettingsMenuRowProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
}

export function SettingsMenuRow({ title, subtitle, onPress, destructive }: SettingsMenuRowProps) {
  return (
    <GlassCard padding>
      <XStack
        items="center"
        justify="space-between"
        gap="$3"
        pressStyle={{ opacity: 0.85 }}
        onPress={onPress}
      >
        <YStack flex={1} gap="$2.5">
          <Text
            fontSize={16}
            fontWeight="700"
            style={{ color: destructive ? themeColors.danger : themeColors.text }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text fontSize={13} color="$textMuted" lineHeight={18}>
              {subtitle}
            </Text>
          ) : null}
        </YStack>
        <CaretRight size={18} color={themeColors.textSubtle} weight="bold" />
      </XStack>
    </GlassCard>
  );
}

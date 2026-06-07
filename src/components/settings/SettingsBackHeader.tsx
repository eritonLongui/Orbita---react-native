import { useNavigation } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';
import React from 'react';
import { Pressable } from 'react-native';
import { Text, XStack } from 'tamagui';
import { themeColors } from '../../constants/theme';

interface SettingsBackHeaderProps {
  title: string;
}

export function SettingsBackHeader({ title }: SettingsBackHeaderProps) {
  const navigation = useNavigation();

  return (
    <XStack items="center" gap="$3" mb="$4">
      <Pressable
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        hitSlop={12}
      >
        <CaretLeft size={22} color={themeColors.text} />
      </Pressable>
      <Text fontSize={24} fontWeight="800" color="$text">
        {title}
      </Text>
    </XStack>
  );
}

import { useNavigation } from '@react-navigation/native';
import { CaretLeft } from 'phosphor-react-native';
import React from 'react';
import { Pressable } from 'react-native';
import { XStack } from 'tamagui';
import { TitleText } from '../ui/TitleText';
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
      <TitleText size="screen" fontSize={24}>
        {title}
      </TitleText>
    </XStack>
  );
}

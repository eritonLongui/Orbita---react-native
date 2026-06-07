import { SignOut } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text, XStack } from 'tamagui';
import { themeColors } from '../../constants/theme';

interface LogoutButtonProps {
  onPress: () => void;
}

export function LogoutButton({ onPress }: LogoutButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <XStack items="center" justify="center" gap="$2">
        <SignOut size={20} color={themeColors.dangerSoft} weight="bold" />
        <Text fontSize={16} fontWeight="700" style={{ color: themeColors.dangerSoft }}>
          Sair da conta
        </Text>
      </XStack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.28)',
  },
  pressed: {
    opacity: 0.88,
    backgroundColor: 'rgba(248, 113, 113, 0.16)',
  },
});

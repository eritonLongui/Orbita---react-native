import { Check } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, XStack } from 'tamagui';
import { themeColors } from '../../constants/theme';

interface TermsCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
}

export function TermsCheckbox({ checked, onToggle, label }: TermsCheckboxProps) {
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [pressed && styles.pressed]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <XStack items="flex-start" gap="$3">
        <View style={[styles.box, checked && styles.boxChecked]}>
          {checked ? <Check size={14} color="white" weight="bold" /> : null}
        </View>
        <Text flex={1} fontSize={12} color="$text" lineHeight={17}>
          {label}
        </Text>
      </XStack>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: themeColors.glassBorderStrong,
    backgroundColor: themeColors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  boxChecked: {
    backgroundColor: themeColors.primary,
    borderColor: themeColors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});

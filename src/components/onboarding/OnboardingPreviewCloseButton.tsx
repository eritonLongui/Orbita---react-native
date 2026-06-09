import { X } from 'phosphor-react-native';
import React from 'react';
import { Pressable } from 'react-native';
import { XStack } from 'tamagui';
import { themeColors } from '../../constants/theme';

interface OnboardingPreviewCloseButtonProps {
  onClose: () => void;
}

/** Só no preview de testes (Configurações). Onboarding real não passa onClose. */
export function OnboardingPreviewCloseButton({ onClose }: OnboardingPreviewCloseButtonProps) {
  return (
    <XStack justify="flex-end" minHeight={40}>
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Fechar preview"
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: themeColors.surfaceMuted,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={20} color={themeColors.textMuted} weight="bold" />
      </Pressable>
    </XStack>
  );
}

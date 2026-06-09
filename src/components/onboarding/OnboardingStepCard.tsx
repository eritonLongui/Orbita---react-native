import React from 'react';
import { View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { OrbitaCard } from '../ui/OrbitaCard';
import { themeColors } from '../../constants/theme';

interface OnboardingStepCardProps {
  icon: React.ComponentType<{ size: number; color: string; weight?: 'regular' | 'duotone' }>;
  stepNumber?: number;
  title: string;
  description: string;
}

export function OnboardingStepCard({
  icon: Icon,
  stepNumber,
  title,
  description,
}: OnboardingStepCardProps) {
  return (
    <OrbitaCard relaxed>
      <XStack gap="$4" items="flex-start">
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: themeColors.glassButton,
            borderWidth: 1,
            borderColor: themeColors.glassBorder,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={24} color={themeColors.text} weight="regular" />
        </View>
        <YStack flex={1} gap="$2.5">
          {stepNumber != null ? (
            <Text fontSize={11} fontWeight="700" color="$text" letterSpacing={1}>
              PASSO {stepNumber}
            </Text>
          ) : null}
          <Text fontSize={15} fontWeight="700" color="$text">
            {title}
          </Text>
          <Text fontSize={13} color="$text" lineHeight={20}>
            {description}
          </Text>
        </YStack>
      </XStack>
    </OrbitaCard>
  );
}

import React from 'react';
import { View as RNView } from 'react-native';
import { XStack } from 'tamagui';
import { ONBOARDING_TOTAL_STEPS } from '../../constants/onboardingCopy';
import { themeColors } from '../../constants/theme';
import { OnboardingPreviewCloseButton } from './OnboardingPreviewCloseButton';

interface OnboardingHeaderProps {
  step: number;
  onClose?: () => void;
}

function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <XStack gap="$2" items="center" justify="center">
      {Array.from({ length: total }, (_, i) => {
        const index = i + 1;
        const active = index === step;
        const done = index < step;
        return (
          <RNView
            key={index}
            style={{
              width: active ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: themeColors.text,
              opacity: active ? 1 : done ? 0.45 : 0.28,
            }}
          />
        );
      })}
    </XStack>
  );
}

export function OnboardingHeader({ step, onClose }: OnboardingHeaderProps) {
  return (
    <XStack items="center" height={40}>
      <RNView style={{ width: 40 }} />
      <XStack flex={1} justify="center">
        <ProgressDots step={step} total={ONBOARDING_TOTAL_STEPS} />
      </XStack>
      {onClose ? (
        <OnboardingPreviewCloseButton onClose={onClose} />
      ) : (
        <RNView style={{ width: 40 }} />
      )}
    </XStack>
  );
}

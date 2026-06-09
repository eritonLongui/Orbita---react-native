import React from 'react';
import { Text, YStack } from 'tamagui';
import { LyraTabOrb } from '../../components/lyra/LyraTabOrb';
import { OnboardingShell } from '../../components/onboarding/OnboardingShell';
import { ONBOARDING_COPY } from '../../constants/onboardingCopy';

interface OnboardingLyraScreenProps {
  onContinue: () => void;
  onClose?: () => void;
  embedded?: boolean;
}

export function OnboardingLyraScreen({
  onContinue,
  onClose,
  embedded,
}: OnboardingLyraScreenProps) {
  const copy = ONBOARDING_COPY.lyra;

  return (
    <OnboardingShell
      embedded={embedded}
      step={copy.step}
      title={copy.title}
      subtitle={copy.subtitle}
      hero={<LyraTabOrb size="hero" />}
      ctaLabel={copy.cta}
      onCta={onContinue}
      onClose={onClose}
    >
      <YStack gap="$2.5" items="center" width="100%" px="$2">
        {copy.bullets.map((bullet) => (
          <Text
            key={bullet}
            fontSize={14}
            color="$textMuted"
            lineHeight={20}
            style={{ textAlign: 'center' }}
          >
            • {bullet}
          </Text>
        ))}
      </YStack>
    </OnboardingShell>
  );
}

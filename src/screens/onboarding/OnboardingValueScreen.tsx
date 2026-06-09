import React from 'react';
import { OnboardingOrbitGraphic } from '../../components/onboarding/OnboardingOrbitGraphic';
import { OnboardingShell } from '../../components/onboarding/OnboardingShell';
import { ONBOARDING_COPY } from '../../constants/onboardingCopy';

interface OnboardingValueScreenProps {
  onContinue: () => void;
  onClose?: () => void;
  embedded?: boolean;
}

export function OnboardingValueScreen({
  onContinue,
  onClose,
  embedded,
}: OnboardingValueScreenProps) {
  const welcome = ONBOARDING_COPY.welcome;

  return (
    <OnboardingShell
      embedded={embedded}
      step={1}
      eyebrow={welcome.eyebrow}
      gradientTitle={welcome.title}
      subtitle={welcome.subtitle}
      hero={<OnboardingOrbitGraphic size={220} />}
      ctaLabel={ONBOARDING_COPY.loop.cta}
      onCta={onContinue}
      onClose={onClose}
    />
  );
}

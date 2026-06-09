import React from 'react';
import { OnboardingShell } from '../../components/onboarding/OnboardingShell';
import { OrbitaLogoMark } from '../../components/ui/OrbitaLogoMark';
import { ONBOARDING_COPY } from '../../constants/onboardingCopy';

interface OnboardingLoopScreenProps {
  onContinue: () => void;
  onClose?: () => void;
  embedded?: boolean;
}

export function OnboardingLoopScreen({
  onContinue,
  onClose,
  embedded,
}: OnboardingLoopScreenProps) {
  const copy = ONBOARDING_COPY.loop;

  return (
    <OnboardingShell
      embedded={embedded}
      step={copy.step}
      title={copy.title}
      subtitle={copy.subtitle}
      hero={<OrbitaLogoMark width={200} />}
      ctaLabel={copy.cta}
      onCta={onContinue}
      onClose={onClose}
    />
  );
}

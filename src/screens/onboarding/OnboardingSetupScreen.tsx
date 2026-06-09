import React, { useState } from 'react';
import { Image } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { OnboardingShell } from '../../components/onboarding/OnboardingShell';
import { GlassChip } from '../../components/ui/GlassChip';
import { GlassInput } from '../../components/ui/GlassInput';
import { TermsCheckbox } from '../../components/ui/TermsCheckbox';
import { ONBOARDING_COPY } from '../../constants/onboardingCopy';
import { ORBIT_AREAS } from '../../constants/orbitAreas';
import { useAuth } from '../../providers/AuthProvider';
import { PillarType } from '../../types';

const FORM_MAX_WIDTH = 320;

interface OnboardingSetupScreenProps {
  onComplete: () => void;
  previewMode?: boolean;
  onClose?: () => void;
  embedded?: boolean;
}

export function OnboardingSetupScreen({
  onComplete,
  previewMode = false,
  onClose,
  embedded,
}: OnboardingSetupScreenProps) {
  const { user, profile, finishOnboarding } = useAuth();
  const copy = ONBOARDING_COPY.setup;
  const [fullName, setFullName] = useState(profile?.full_name ?? user?.displayName ?? '');
  const [focusAreas, setFocusAreas] = useState<PillarType[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleFocus = (type: PillarType) => {
    setFocusAreas((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleComplete = async () => {
    if (!acceptedTerms || !fullName.trim()) return;
    setLoading(true);
    try {
      if (previewMode) {
        onComplete();
        return;
      }
      await finishOnboarding(fullName.trim(), {
        focus_areas: focusAreas,
      });
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  const avatar = user?.photoURL ? (
    <Image
      source={{ uri: user.photoURL }}
      style={{ width: 72, height: 72, borderRadius: 36 }}
    />
  ) : (
    <YStack
      width={72}
      height={72}
      rounded={999}
      bg="$primaryBg"
      items="center"
      justify="center"
    >
      <Text fontSize={28} fontWeight="700" color="$primary">
        {fullName.charAt(0) || 'O'}
      </Text>
    </YStack>
  );

  return (
    <OnboardingShell
      embedded={embedded}
      step={copy.step}
      title={copy.title}
      subtitle={copy.subtitle}
      ctaLabel={copy.cta}
      onCta={() => void handleComplete()}
      ctaLoading={loading}
      ctaDisabled={!acceptedTerms || !fullName.trim()}
      onClose={onClose}
      scrollable
    >
      <YStack gap="$5" pb="$4" items="center" width="100%">
        <YStack gap="$3" items="center" width="100%" maxWidth={FORM_MAX_WIDTH}>
          {avatar}

          <YStack gap="$2" width="100%">
            <Text
              fontSize={13}
              fontWeight="600"
              color="$text"
              style={{ textAlign: 'center' }}
            >
              Nome
            </Text>
            <GlassInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Seu nome"
              style={{ textAlign: 'center' }}
            />
          </YStack>
        </YStack>

        <YStack gap="$3" items="center" width="100%" maxWidth={FORM_MAX_WIDTH}>
          <Text
            fontSize={13}
            fontWeight="600"
            color="$text"
            lineHeight={18}
            style={{ textAlign: 'center' }}
          >
            {copy.focusLabel}
          </Text>
          <XStack gap="$2" flexWrap="wrap" justify="center">
            {ORBIT_AREAS.map((area) => (
              <GlassChip
                key={area.type}
                label={area.label}
                selected={focusAreas.includes(area.type)}
                onPress={() => toggleFocus(area.type)}
              />
            ))}
          </XStack>
        </YStack>

        <YStack width="100%" maxWidth={FORM_MAX_WIDTH}>
          <TermsCheckbox
            checked={acceptedTerms}
            onToggle={() => setAcceptedTerms((prev) => !prev)}
            label={copy.terms}
          />
        </YStack>
      </YStack>
    </OnboardingShell>
  );
}

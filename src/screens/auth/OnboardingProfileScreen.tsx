import React, { useState } from 'react';
import { Image } from 'react-native';
import { Input, Text, XStack, YStack } from 'tamagui';
import { OnboardingPreviewCloseButton } from '../../components/onboarding/OnboardingPreviewCloseButton';
import { GlassChip } from '../../components/ui/GlassChip';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { TermsCheckbox } from '../../components/ui/TermsCheckbox';
import { ORBIT_AREAS } from '../../constants/orbitAreas';
import { useAuth } from '../../providers/AuthProvider';
import { PillarType } from '../../types';

interface OnboardingProfileScreenProps {
  onComplete: () => void;
  /** Visualização em Configurações — não grava no perfil. */
  previewMode?: boolean;
  onClose?: () => void;
}

export function OnboardingProfileScreen({
  onComplete,
  previewMode = false,
  onClose,
}: OnboardingProfileScreenProps) {
  const { user, profile, finishOnboarding } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? user?.displayName ?? '');
  const [focusAreas, setFocusAreas] = useState<PillarType[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleFocus = (type: PillarType) => {
    setFocusAreas((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
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

  return (
    <ScreenWrapper scrollable={false}>
      <YStack flex={1} justify="space-between" gap="$5">
        {onClose ? <OnboardingPreviewCloseButton onClose={onClose} /> : null}
        <YStack gap="$6">
          <YStack gap="$1">
            <Text fontSize={28} fontWeight="800" color="$text">
              Só mais um passo
            </Text>
            <Text fontSize={14} color="$textMuted" lineHeight={20}>
              Confirme seus dados. As áreas abaixo são as mesmas cinco da sua órbita.
            </Text>
          </YStack>

          <YStack gap="$3">
            <XStack items="center" gap="$3">
              {user?.photoURL ? (
                <Image
                  source={{ uri: user.photoURL }}
                  style={{ width: 56, height: 56, borderRadius: 28 }}
                />
              ) : (
                <YStack
                  width={56}
                  height={56}
                  rounded={999}
                  bg="$primaryBg"
                  items="center"
                  justify="center"
                >
                  <Text fontSize={22} fontWeight="700" color="$primary">
                    {fullName.charAt(0) || 'O'}
                  </Text>
                </YStack>
              )}
              <YStack flex={1} gap="$3">
                <Text fontSize={13} fontWeight="600" color="$textMuted">
                  Nome
                </Text>
                <Input
                  value={fullName}
                  onChangeText={setFullName}
                  bg="$glass"
                  borderColor="$glassBorder"
                  rounded="$md"
                  color="$text"
                  placeholder="Seu nome"
                  placeholderTextColor="$textMuted"
                  size="$4"
                />
              </YStack>
            </XStack>
          </YStack>

          <YStack gap="$3">
            <Text fontSize={13} fontWeight="600" color="$textMuted">
              O que quer acompanhar com mais atenção? (opcional)
            </Text>
            <XStack gap="$2" flexWrap="wrap" mt="$1">
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

          <TermsCheckbox
            checked={acceptedTerms}
            onToggle={() => setAcceptedTerms((prev) => !prev)}
            label="Concordo com os termos e entendo que a Orbita não substitui apoio profissional."
          />
        </YStack>

        <PrimaryButton
          label="Começar"
          onPress={handleComplete}
          loading={loading}
          disabled={!acceptedTerms || !fullName.trim()}
        />
      </YStack>
    </ScreenWrapper>
  );
}

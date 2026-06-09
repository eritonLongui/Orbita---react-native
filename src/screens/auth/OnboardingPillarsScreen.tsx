import { Moon, PersonSimpleRun, Clock, Drop, GameController } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { OnboardingPreviewCloseButton } from '../../components/onboarding/OnboardingPreviewCloseButton';
import { themeColors } from '../../constants/theme';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { ORBIT_AREAS } from '../../constants/orbitAreas';

const ICONS = [Moon, PersonSimpleRun, Clock, Drop, GameController];

interface OnboardingPillarsScreenProps {
  onContinue: () => void;
  onClose?: () => void;
}

export function OnboardingPillarsScreen({ onContinue, onClose }: OnboardingPillarsScreenProps) {
  const [step, setStep] = useState(0);

  if (step === 0) {
    return (
      <ScreenWrapper>
        <YStack gap="$5" py="$2">
          {onClose ? <OnboardingPreviewCloseButton onClose={onClose} /> : null}
          <YStack gap="$2">
            <Text fontSize={28} fontWeight="800" color="$text">
              Sua órbita
            </Text>
            <Text fontSize={15} color="$textMuted" lineHeight={22}>
              Toda a missão se apoia nestas áreas. Acompanhe tendências — sem pressão, com
              consciência.
            </Text>
          </YStack>

          <YStack gap="$3">
            {ORBIT_AREAS.map((pillar, index) => {
              const Icon = ICONS[index];
              return (
                <XStack
                  key={pillar.type}
                  bg="$surface"
                  rounded="$md"
                  borderWidth={1}
                  borderColor="$border"
                  p="$4"
                  gap="$3"
                  items="center"
                >
                  <YStack
                    width={44}
                    height={44}
                    rounded={999}
                    bg="$glassButton"
                    borderWidth={1}
                    borderColor="$glassBorder"
                    items="center"
                    justify="center"
                  >
                    <Icon size={22} color={themeColors.text} weight="regular" />
                  </YStack>
                  <YStack flex={1} gap="$1">
                    <Text fontSize={15} fontWeight="700" color="$text">
                      {pillar.label}
                    </Text>
                    <Text fontSize={13} color="$textMuted" lineHeight={18}>
                      {pillar.description}
                    </Text>
                  </YStack>
                </XStack>
              );
            })}
          </YStack>

          <PrimaryButton label="Próximo" onPress={() => setStep(1)} />
        </YStack>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable={false}>
      <YStack flex={1} justify="space-between" py="$4">
        {onClose ? <OnboardingPreviewCloseButton onClose={onClose} /> : null}
        <YStack flex={1} justify="center" gap="$5">
          <YStack gap="$2">
            <Text fontSize={28} fontWeight="800" color="$text">
              Conheça a Lyra
            </Text>
            <Text fontSize={16} color="$textMuted" lineHeight={24}>
              Sua coach de IA. Fale ou digite — ela entende seu momento e atualiza sua órbita.
            </Text>
          </YStack>
          <YStack bg="$bgSoft" rounded="$lg" p="$5" gap="$2">
            <Text fontSize={14} color="$textMuted">
              Seu primeiro passo
            </Text>
            <Text fontSize={18} fontWeight="700" color="$text" lineHeight={24}>
              Um check-in de alguns minutos logo após configurar seu perfil.
            </Text>
          </YStack>
        </YStack>
        <PrimaryButton label="Continuar" onPress={onContinue} />
      </YStack>
    </ScreenWrapper>
  );
}

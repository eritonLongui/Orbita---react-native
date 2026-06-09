import { Clock, Drop, GameController, Moon, PersonSimpleRun } from 'phosphor-react-native';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { OrbitRadar } from '../../components/orbit/OrbitRadar';
import { OnboardingShell } from '../../components/onboarding/OnboardingShell';
import { ONBOARDING_COPY } from '../../constants/onboardingCopy';
import { ORBIT_AREAS } from '../../constants/orbitAreas';
import { themeColors } from '../../constants/theme';
import { OrbitAreaSummary } from '../../types';

const AREA_ICONS = [Moon, PersonSimpleRun, Clock, Drop, GameController];

interface OnboardingAreasScreenProps {
  onContinue: () => void;
  onClose?: () => void;
  embedded?: boolean;
}

export function OnboardingAreasScreen({
  onContinue,
  onClose,
  embedded,
}: OnboardingAreasScreenProps) {
  const copy = ONBOARDING_COPY.areas;

  const demoAreas = useMemo<OrbitAreaSummary[]>(
    () =>
      ORBIT_AREAS.map((area) => ({
        type: area.type,
        label: area.label,
        score: 72,
        status: 'balanced' as const,
      })),
    [],
  );

  return (
    <OnboardingShell
      embedded={embedded}
      step={copy.step}
      title={copy.title}
      subtitle={copy.subtitle}
      ctaLabel={copy.cta}
      onCta={onContinue}
      onClose={onClose}
      scrollable
    >
      <YStack gap="$4" items="center" pb="$4">
        <OrbitRadar areas={demoAreas} size={240} hideCenterScore />

        <YStack gap="$2" width="100%">
          {ORBIT_AREAS.map((area, index) => {
            const Icon = AREA_ICONS[index];
            return (
              <XStack
                key={area.type}
                gap="$3"
                items="center"
                p="$3"
                rounded="$md"
                borderWidth={1}
                borderColor="$glassBorder"
                bg="$glassButton"
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: themeColors.glass,
                    borderWidth: 1,
                    borderColor: themeColors.glassBorder,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={20} color={themeColors.text} weight="regular" />
                </View>
                <YStack flex={1} gap="$2">
                  <Text fontSize={14} fontWeight="700" color="$text">
                    {area.label}
                  </Text>
                  <Text fontSize={12} color="$textMuted" lineHeight={16}>
                    {area.description}
                  </Text>
                </YStack>
              </XStack>
            );
          })}
        </YStack>
      </YStack>
    </OnboardingShell>
  );
}

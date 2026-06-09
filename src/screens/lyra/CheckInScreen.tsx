import { X } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Spinner, Text, XStack, YStack } from 'tamagui';
import { CheckInStepForm } from '../../components/checkin/CheckInStepForm';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import {
  CHECK_IN_AREA_ICONS,
  CHECK_IN_STEPS,
  DEFAULT_CHECK_IN_ANSWERS,
} from '../../constants/checkInQuestionnaire';
import { themeColors } from '../../constants/theme';
import { useAuth } from '../../providers/AuthProvider';
import { CheckInAnswers, LyraChatResponse } from '../../types';
import { submitCheckInQuestionnaire } from '../../utils/checkInQuestionnaire';

interface CheckInScreenProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (response: LyraChatResponse) => void;
}

export function CheckInScreen({ visible, onClose, onComplete }: CheckInScreenProps) {
  const { profile } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<CheckInAnswers>(DEFAULT_CHECK_IN_ANSWERS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = CHECK_IN_STEPS[step];
  const AreaIcon = CHECK_IN_AREA_ICONS[current.area];
  const isLast = step === CHECK_IN_STEPS.length - 1;

  const handleNext = async () => {
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await submitCheckInQuestionnaire(answers, profile);
      setStep(0);
      setAnswers(DEFAULT_CHECK_IN_ANSWERS);
      onComplete(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao enviar check-in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setStep(0);
    setAnswers(DEFAULT_CHECK_IN_ANSWERS);
    setError(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <ScreenWrapper scrollable tabBarOffset={false}>
        <YStack flex={1} pt="$4" px="$2" gap="$4">
          <XStack items="center" minHeight={40}>
            <View style={{ width: 40 }} />
            <XStack flex={1} justify="center" items="center" gap="$2">
              {CHECK_IN_STEPS.map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: i === step ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: i === step ? '#FFFFFF' : themeColors.textMuted,
                  }}
                />
              ))}
            </XStack>
            <Pressable
              onPress={handleClose}
              disabled={submitting}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: themeColors.surfaceMuted,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: submitting ? 0.5 : 1,
              }}
            >
              <X size={20} color={themeColors.textMuted} weight="bold" />
            </Pressable>
          </XStack>

          <YStack gap="$2" mt="$2">
            <XStack items="center" gap="$2.5">
              {AreaIcon ? (
                <AreaIcon size={22} color={themeColors.textMuted} weight="regular" />
              ) : null}
              <Text fontSize={26} fontWeight="800" color="$text">
                {current.title}
              </Text>
            </XStack>
            <Text fontSize={14} color="$textMuted" lineHeight={20}>
              Responda com o que aconteceu nas últimas 24 horas.
            </Text>
          </YStack>

          <CheckInStepForm area={current.area} answers={answers} onChange={setAnswers} />

          {error ? (
            <Text fontSize={13} color="$danger" text="center">
              {error}
            </Text>
          ) : null}

          <YStack mt="auto" pb="$6" gap="$3">
            {submitting ? (
              <YStack items="center" py="$4">
                <Spinner size="large" color="$primary" />
                <Text fontSize={13} color="$textMuted" mt="$2" text="center">
                  Lyra está analisando seu dia...
                </Text>
              </YStack>
            ) : (
              <PrimaryButton
                label={isLast ? 'Concluir check-in' : 'Próximo'}
                onPress={() => void handleNext()}
              />
            )}
          </YStack>
        </YStack>
      </ScreenWrapper>
    </Modal>
  );
}

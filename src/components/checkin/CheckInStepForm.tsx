import React from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { CheckInAreaId } from '../../services/checkIn';
import { CheckInAnswers } from '../../types';
import { OrbitaSwitch } from '../ui/OrbitaSwitch';
import { SliderInput } from './SliderInput';
import { StepperInput } from './StepperInput';
import { TimeInput } from './TimeInput';

interface CheckInStepFormProps {
  area: CheckInAreaId;
  answers: CheckInAnswers;
  onChange: (answers: CheckInAnswers) => void;
}

export function CheckInStepForm({ area, answers, onChange }: CheckInStepFormProps) {
  if (area === 'sleep') {
    const s = answers.sleep;
    return (
      <YStack gap="$7">
        <TimeInput
          label="Que horas foi dormir?"
          value={s.bedTime}
          onChange={(bedTime) => onChange({ ...answers, sleep: { ...s, bedTime } })}
        />
        <TimeInput
          label="Que horas acordou?"
          value={s.wakeTime}
          onChange={(wakeTime) => onChange({ ...answers, sleep: { ...s, wakeTime } })}
        />
        <SliderInput
          label="Qualidade do sono"
          value={s.quality}
          min={0}
          max={10}
          onChange={(quality) => onChange({ ...answers, sleep: { ...s, quality } })}
        />
      </YStack>
    );
  }

  if (area === 'energy') {
    const e = answers.energy;
    return (
      <YStack gap="$7">
        <SliderInput
          label="Nível de energia agora"
          value={e.energyLevel}
          onChange={(energyLevel) => onChange({ ...answers, energy: { ...e, energyLevel } })}
        />
        <SliderInput
          label="Cansaço sentido hoje"
          value={e.fatigueLevel}
          onChange={(fatigueLevel) => onChange({ ...answers, energy: { ...e, fatigueLevel } })}
        />
      </YStack>
    );
  }

  if (area === 'routine') {
    const r = answers.routine;
    return (
      <YStack gap="$7">
        <StepperInput
          label="Horas em telas hoje"
          value={r.screenHours}
          min={0}
          max={16}
          unit="h"
          onChange={(screenHours) => onChange({ ...answers, routine: { ...r, screenHours } })}
        />
        <XStack justify="space-between" items="center">
          <YStack flex={1} gap="$1" pr="$3">
            <Text fontSize={14} fontWeight="600" color="$text">
              Horários regulares hoje?
            </Text>
            <Text fontSize={12} color="$textMuted">
              Refeições e atividades no mesmo horário
            </Text>
          </YStack>
          <OrbitaSwitch
            checked={r.regularSchedule}
            onCheckedChange={(regularSchedule) =>
              onChange({ ...answers, routine: { ...r, regularSchedule } })
            }
          />
        </XStack>
        <SliderInput
          label="Organização do ritmo"
          value={r.organization}
          onChange={(organization) => onChange({ ...answers, routine: { ...r, organization } })}
        />
      </YStack>
    );
  }

  if (area === 'nutrition') {
    const n = answers.nutrition;
    return (
      <YStack gap="$7">
        <StepperInput
          label="Refeições principais (24h)"
          value={n.meals}
          min={0}
          max={6}
          onChange={(meals) => onChange({ ...answers, nutrition: { ...n, meals } })}
        />
        <StepperInput
          label="Copos de água"
          value={n.waterGlasses}
          min={0}
          max={15}
          onChange={(waterGlasses) => onChange({ ...answers, nutrition: { ...n, waterGlasses } })}
        />
        <SliderInput
          label="Qualidade da alimentação"
          value={n.foodQuality}
          onChange={(foodQuality) => onChange({ ...answers, nutrition: { ...n, foodQuality } })}
        />
      </YStack>
    );
  }

  const w = answers.wellbeing;
  return (
    <YStack gap="$5">
      <SliderInput
        label="Humor agora"
        value={w.mood}
        onChange={(mood) => onChange({ ...answers, wellbeing: { ...w, mood } })}
      />
      <SliderInput
        label="Nível de estresse"
        value={w.stress}
        onChange={(stress) => onChange({ ...answers, wellbeing: { ...w, stress } })}
      />
      <SliderInput
        label="Ansiedade ou desconforto hoje"
        value={w.anxiety}
        onChange={(anxiety) => onChange({ ...answers, wellbeing: { ...w, anxiety } })}
      />
    </YStack>
  );
}

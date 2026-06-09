import {
  Clock,
  Drop,
  GameController,
  Moon,
  PersonSimpleRun,
} from 'phosphor-react-native';
import type { IconProps } from 'phosphor-react-native';
import type { ComponentType } from 'react';
import { CheckInAreaId, CHECK_IN_AREA_LABELS } from '../services/checkIn';
import { CheckInAnswers } from '../types';

type AreaIconComponent = ComponentType<IconProps>;

export const CHECK_IN_AREA_ICONS: Record<CheckInAreaId, AreaIconComponent> = {
  sleep: Moon,
  energy: PersonSimpleRun,
  routine: Clock,
  nutrition: Drop,
  wellbeing: GameController,
};

export const DEFAULT_CHECK_IN_ANSWERS: CheckInAnswers = {
  sleep: { bedTime: '23:00', wakeTime: '07:00', quality: 5 },
  energy: { energyLevel: 5, fatigueLevel: 5 },
  routine: { screenHours: 4, regularSchedule: true, organization: 5 },
  nutrition: { meals: 3, waterGlasses: 6, foodQuality: 5 },
  wellbeing: { mood: 5, stress: 5, anxiety: 5 },
};

export const CHECK_IN_STEPS: { area: CheckInAreaId; title: string }[] = [
  { area: 'sleep', title: CHECK_IN_AREA_LABELS.sleep },
  { area: 'energy', title: CHECK_IN_AREA_LABELS.energy },
  { area: 'routine', title: CHECK_IN_AREA_LABELS.routine },
  { area: 'nutrition', title: CHECK_IN_AREA_LABELS.nutrition },
  { area: 'wellbeing', title: CHECK_IN_AREA_LABELS.wellbeing },
];

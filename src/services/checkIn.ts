import AsyncStorage from '@react-native-async-storage/async-storage';
import { LyraChatResponse } from '../types';

export const CHECK_IN_AREA_IDS = [
  'sleep',
  'energy',
  'routine',
  'nutrition',
  'wellbeing',
] as const;

export type CheckInAreaId = (typeof CHECK_IN_AREA_IDS)[number];

export const CHECK_IN_AREA_LABELS: Record<CheckInAreaId, string> = {
  sleep: 'Descanso',
  energy: 'Energia',
  routine: 'Ritmo',
  nutrition: 'Nutrição',
  wellbeing: 'Bem-estar',
};

export type CheckInFlowStep = {
  area: CheckInAreaId;
  question: string;
};

/** Perguntas objetivas e metrificáveis — várias por área, ordem fixa. */
export const CHECK_IN_FLOW: CheckInFlowStep[] = [
  { area: 'sleep', question: 'Que horas você foi dormir?' },
  { area: 'sleep', question: 'Que horas você acordou?' },
  { area: 'sleep', question: 'De 0 a 10, como avalia a qualidade do seu sono?' },
  { area: 'energy', question: 'De 0 a 10, qual seu nível de energia agora?' },
  { area: 'energy', question: 'De 0 a 10, quanto cansaço você sentiu hoje?' },
  { area: 'routine', question: 'Quantas horas em média você passou em telas hoje?' },
  { area: 'routine', question: 'Você manteve horários regulares de refeições e atividades hoje?' },
  { area: 'routine', question: 'De 0 a 10, como avalia a organização do seu ritmo hoje?' },
  { area: 'nutrition', question: 'Quantas refeições principais você fez nas últimas 24 horas?' },
  { area: 'nutrition', question: 'Quantos copos de água você bebeu hoje, mais ou menos?' },
  { area: 'nutrition', question: 'De 0 a 10, como avalia sua alimentação nas últimas 24 horas?' },
  { area: 'wellbeing', question: 'De 0 a 10, como está seu humor agora?' },
  { area: 'wellbeing', question: 'De 0 a 10, qual seu nível de estresse neste momento?' },
  { area: 'wellbeing', question: 'De 0 a 10, quanto ansiedade ou desconforto você sentiu hoje?' },
];

export const CHECK_IN_AREA_ACKS: Record<CheckInAreaId, string> = {
  sleep: 'Descanso registrado.',
  energy: 'Energia registrada.',
  routine: 'Ritmo registrado.',
  nutrition: 'Nutrição registrada.',
  wellbeing: 'Bem-estar registrado.',
};

export const CHECK_IN_CLOSING =
  'Check-in completo! Você respondeu todas as áreas do dia. Sua órbita começou a tomar forma.';

const KEYS = {
  lastCheckInDate: 'orbita_last_checkin_date',
  sessionAreas: 'orbita_checkin_session_areas',
  sessionStepIndex: 'orbita_checkin_step_index',
} as const;

function getDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCheckInFlowStep(stepIndex: number): CheckInFlowStep | null {
  return CHECK_IN_FLOW[stepIndex] ?? null;
}

export function getAreasCompletedAfterAnsweredCount(count: number): CheckInAreaId[] {
  const answeredByArea = new Map<CheckInAreaId, number>();

  for (let i = 0; i < count && i < CHECK_IN_FLOW.length; i++) {
    const area = CHECK_IN_FLOW[i].area;
    answeredByArea.set(area, (answeredByArea.get(area) ?? 0) + 1);
  }

  return CHECK_IN_AREA_IDS.filter((area) => {
    const required = CHECK_IN_FLOW.filter((step) => step.area === area).length;
    return (answeredByArea.get(area) ?? 0) >= required;
  });
}

export function buildCheckInOpening(): LyraChatResponse {
  const first = CHECK_IN_FLOW[0];
  return {
    reply: `Oi! Vamos ao check-in de hoje. ${first.question}`,
    checkInComplete: false,
    areasCovered: [],
  };
}

export function buildCheckInStepAfterAnswer(
  answeredStep: CheckInFlowStep,
  nextStepIndex: number,
  areasCovered: CheckInAreaId[],
): LyraChatResponse {
  const nextStep = getCheckInFlowStep(nextStepIndex);

  if (!nextStep) {
    return {
      reply: `${CHECK_IN_AREA_ACKS[answeredStep.area]} ${CHECK_IN_CLOSING}`,
      checkInComplete: true,
      areasCovered,
    };
  }

  const ack =
    nextStep.area !== answeredStep.area
      ? `${CHECK_IN_AREA_ACKS[answeredStep.area]} ${nextStep.question}`
      : `Anotado. ${nextStep.question}`;

  return {
    reply: ack,
    checkInComplete: false,
    areasCovered,
  };
}

export async function getCheckInStepIndex(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.sessionStepIndex);
  const parsed = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export async function setCheckInStepIndex(index: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.sessionStepIndex, String(index));
}

export async function isTodayCheckInComplete(): Promise<boolean> {
  const last = await AsyncStorage.getItem(KEYS.lastCheckInDate);
  return last === getDateKey();
}

export async function getCheckInAreasCovered(): Promise<CheckInAreaId[]> {
  const raw = await AsyncStorage.getItem(KEYS.sessionAreas);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as string[];
    return parsed.filter((id): id is CheckInAreaId =>
      CHECK_IN_AREA_IDS.includes(id as CheckInAreaId),
    );
  } catch {
    return [];
  }
}

export async function setCheckInAreasCovered(areas: string[]): Promise<void> {
  const valid = areas.filter((id): id is CheckInAreaId =>
    CHECK_IN_AREA_IDS.includes(id as CheckInAreaId),
  );
  await AsyncStorage.setItem(KEYS.sessionAreas, JSON.stringify(valid));
}

export async function markTodayCheckInComplete(): Promise<void> {
  await AsyncStorage.setItem(KEYS.lastCheckInDate, getDateKey());
  await AsyncStorage.removeItem(KEYS.sessionAreas);
  await AsyncStorage.removeItem(KEYS.sessionStepIndex);
}

export async function resetTodayCheckIn(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.lastCheckInDate);
  await AsyncStorage.removeItem(KEYS.sessionAreas);
  await AsyncStorage.removeItem(KEYS.sessionStepIndex);
  await AsyncStorage.removeItem('orbita_first_lyra_completed');
  await AsyncStorage.removeItem('orbita_first_lyra_pending');
  const today = getDateKey();
  await AsyncStorage.removeItem(`orbita_daily_tasks_${today}`);
}

/** @deprecated Use buildCheckInOpening() */
export const CHECK_IN_OPENING_FALLBACK = buildCheckInOpening();

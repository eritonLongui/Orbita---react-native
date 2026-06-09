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

/** Usado quando a API falha na abertura do check-in — evita tela travada em "processando". */
export const CHECK_IN_OPENING_FALLBACK: LyraChatResponse = {
  reply:
    'Oi! Vamos ao seu check-in de hoje. Pra começar: como foi seu descanso ontem à noite?',
  checkInComplete: false,
  areasCovered: [],
};

const KEYS = {
  lastCheckInDate: 'orbita_last_checkin_date',
  sessionAreas: 'orbita_checkin_session_areas',
} as const;

function getDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
}

export async function resetTodayCheckIn(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.lastCheckInDate);
  await AsyncStorage.removeItem(KEYS.sessionAreas);
}

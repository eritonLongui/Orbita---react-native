import AsyncStorage from '@react-native-async-storage/async-storage';
import { markTodayCheckInComplete } from './checkIn';

export const JOURNEY_KEYS = {
  firstLyraCompleted: 'orbita_first_lyra_completed',
  firstLyraPending: 'orbita_first_lyra_pending',
  tabLabelsDismissed: 'orbita_tab_labels_dismissed',
  lastVisitDate: 'orbita_last_visit_date',
  visitStreak: 'orbita_visit_streak',
} as const;

function getDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayKey(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return getDateKey(date);
}

export async function getVisitStreak(): Promise<number> {
  const stored = await AsyncStorage.getItem(JOURNEY_KEYS.visitStreak);
  const parsed = Number.parseInt(stored ?? '0', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

/** Registra a visita do dia e retorna o streak atualizado. */
export async function recordMissionVisit(): Promise<number> {
  const today = getDateKey();
  const lastVisit = await AsyncStorage.getItem(JOURNEY_KEYS.lastVisitDate);
  const currentStreak = await getVisitStreak();

  if (lastVisit === today) {
    return currentStreak || 1;
  }

  const nextStreak = lastVisit === getYesterdayKey() ? Math.max(currentStreak, 0) + 1 : 1;

  await AsyncStorage.setMany({
    [JOURNEY_KEYS.lastVisitDate]: today,
    [JOURNEY_KEYS.visitStreak]: String(nextStreak),
  });

  return nextStreak;
}

export async function markFirstLyraPending(): Promise<void> {
  await AsyncStorage.setItem(JOURNEY_KEYS.firstLyraPending, 'true');
}

export async function isFirstLyraPending(): Promise<boolean> {
  return (await AsyncStorage.getItem(JOURNEY_KEYS.firstLyraPending)) === 'true';
}

export async function hasCompletedFirstLyraSession(): Promise<boolean> {
  return (await AsyncStorage.getItem(JOURNEY_KEYS.firstLyraCompleted)) === 'true';
}

export async function shouldShowTabLabels(): Promise<boolean> {
  if (await hasCompletedFirstLyraSession()) return false;
  return (await AsyncStorage.getItem(JOURNEY_KEYS.tabLabelsDismissed)) !== 'true';
}

/** Marca check-in do dia e primeira sessão (se aplicável). Retorna true na primeira conclusão. */
export async function completeCheckIn(): Promise<boolean> {
  await markTodayCheckInComplete();
  return markFirstLyraSessionCompleted();
}

/** Retorna true apenas na primeira vez que o check-in é concluído. */
export async function markFirstLyraSessionCompleted(): Promise<boolean> {
  if (await hasCompletedFirstLyraSession()) return false;
  await AsyncStorage.setMany({
    [JOURNEY_KEYS.firstLyraCompleted]: 'true',
    [JOURNEY_KEYS.firstLyraPending]: 'false',
    [JOURNEY_KEYS.tabLabelsDismissed]: 'true',
  });
  return true;
}

export type JourneyUserState = 'new' | 'activated' | 'returning';

export function resolveJourneyState(
  hasOrbitData: boolean,
  firstLyraCompleted: boolean,
): JourneyUserState {
  if (hasOrbitData) return 'returning';
  if (firstLyraCompleted) return 'activated';
  return 'new';
}

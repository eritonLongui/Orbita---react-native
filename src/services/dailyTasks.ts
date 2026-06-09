import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyTask } from '../types';

const KEY_PREFIX = 'orbita_daily_tasks_';

function getDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function todayKey(): string {
  return `${KEY_PREFIX}${getDateKey()}`;
}

export async function getTodayTasks(): Promise<DailyTask[]> {
  const raw = await AsyncStorage.getItem(todayKey());
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as DailyTask[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveTodayTasks(tasks: DailyTask[]): Promise<void> {
  await AsyncStorage.setItem(todayKey(), JSON.stringify(tasks));
}

export async function toggleTaskDone(taskId: string): Promise<DailyTask[]> {
  const tasks = await getTodayTasks();
  const next = tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
  await saveTodayTasks(next);
  return next;
}

export async function clearTodayTasks(): Promise<void> {
  await AsyncStorage.removeItem(todayKey());
}

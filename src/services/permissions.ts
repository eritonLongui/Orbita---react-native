import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
} from 'expo-audio';

export const PERMISSION_PROMPT_KEYS = {
  notificationPromptShown: 'orbita_notification_prompt_shown',
  microphonePromptShown: 'orbita_microphone_prompt_shown',
} as const;

async function isPromptShown(key: string): Promise<boolean> {
  return (await AsyncStorage.getItem(key)) === 'true';
}

export async function markNotificationPromptShown(): Promise<void> {
  await AsyncStorage.setItem(PERMISSION_PROMPT_KEYS.notificationPromptShown, 'true');
}

export async function markMicrophonePromptShown(): Promise<void> {
  await AsyncStorage.setItem(PERMISSION_PROMPT_KEYS.microphonePromptShown, 'true');
}

export async function shouldShowNotificationPrompt(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if (await isPromptShown(PERMISSION_PROMPT_KEYS.notificationPromptShown)) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return false;
  return true;
}

export async function shouldShowMicrophonePrompt(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if (await isPromptShown(PERMISSION_PROMPT_KEYS.microphonePromptShown)) return false;
  const current = await getRecordingPermissionsAsync();
  if (current.granted) return false;
  return true;
}

export async function requestMicrophonePermissionIfNeeded(): Promise<boolean> {
  const current = await getRecordingPermissionsAsync();
  if (current.granted) return true;
  if (current.status === 'denied' && current.canAskAgain === false) return false;

  const { granted } = await requestRecordingPermissionsAsync();
  return granted;
}

export async function requestNotificationPermissionIfNeeded(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (current.status === 'denied' && current.canAskAgain === false) return false;

  const result = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  return result.granted ?? result.status === 'granted';
}

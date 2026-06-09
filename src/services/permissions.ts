import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
} from 'expo-audio';

const BETWEEN_DIALOGS_MS = Platform.OS === 'ios' ? 450 : 200;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

/** Pede microfone e, em seguida, notificações — cada uma abre o modal do sistema se ainda não foi respondida. */
export async function requestOnboardingPermissions(): Promise<void> {
  await requestMicrophonePermissionIfNeeded();
  await delay(BETWEEN_DIALOGS_MS);
  await requestNotificationPermissionIfNeeded();
}

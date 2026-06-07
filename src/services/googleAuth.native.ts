import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { publicEnv } from '../config/publicEnv';

export const GOOGLE_REDIRECT_OPTIONS = {
  scheme: 'orbita',
  path: 'oauth2redirect',
} as const;

export function getGoogleRedirectUri() {
  return `orbita://${GOOGLE_REDIRECT_OPTIONS.path}`;
}

export function canUseNativeGoogleSignIn() {
  return Platform.OS !== 'web' && Constants.appOwnership !== 'expo';
}

export function logGoogleRedirectUriInDev() {}

export function configureGoogleSignIn() {
  if (!canUseNativeGoogleSignIn()) return;

  GoogleSignin.configure({
    webClientId: publicEnv('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID'),
    iosClientId: publicEnv('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID') || undefined,
    offlineAccess: false,
  });
}

export async function signInWithGoogleNative(): Promise<{ idToken: string } | 'cancelled'> {
  if (Platform.OS === 'android') {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  const result = await GoogleSignin.signIn();

  if (result.type === 'cancelled') {
    return 'cancelled';
  }

  const idToken = result.data.idToken;
  if (!idToken) {
    throw new Error('Token Google não retornado');
  }

  return { idToken };
}

export async function signOutGoogleNative() {
  try {
    await GoogleSignin.signOut();
  } catch {
    // ignore
  }
}

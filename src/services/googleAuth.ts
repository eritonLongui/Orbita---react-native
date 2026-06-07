import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const GOOGLE_REDIRECT_OPTIONS = {
  scheme: 'orbita',
  path: 'oauth2redirect',
} as const;

export function getGoogleRedirectUri() {
  return makeRedirectUri(GOOGLE_REDIRECT_OPTIONS);
}

/** SDK nativo só funciona em dev build ou app compilado — não no Expo Go nem na web. */
export function canUseNativeGoogleSignIn() {
  return Platform.OS !== 'web' && Constants.appOwnership !== 'expo';
}

export function logGoogleRedirectUriInDev() {
  if (__DEV__ && Constants.appOwnership === 'expo') {
    console.info(
      '[Orbita Auth] Adicione este redirect URI no Google Cloud Console (cliente OAuth Web):\n',
      getGoogleRedirectUri()
    );
  }
}

export function configureGoogleSignIn() {}

export async function signInWithGoogleNative(): Promise<{ idToken: string } | 'cancelled'> {
  throw new Error('Native Google Sign-In indisponível nesta plataforma');
}

export async function signOutGoogleNative() {}

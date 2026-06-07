import { Platform } from 'react-native';

/** Retorna a origem atual no browser (ex: http://192.168.1.131:8081). */
export function getWebAuthOrigin() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  return window.location.origin;
}

/** Google OAuth web só aceita http em localhost/127.0.0.1 — não em IP da rede. */
export function isGoogleWebAuthSupported() {
  const origin = getWebAuthOrigin();
  if (!origin) return true;

  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol !== 'http:' && protocol !== 'https:') return false;
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

export function getWebAuthUnsupportedMessage() {
  const origin = getWebAuthOrigin() ?? 'este endereço';

  return (
    `Login Google na web não funciona em ${origin}. ` +
    'Abra no Mac em http://localhost:8081 ou use o app nativo (Expo Go / build). ' +
    'O Google não aceita redirect OAuth em IP da rede local.'
  );
}

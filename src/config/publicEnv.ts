/**
 * Chaves públicas do cliente (Firebase + Supabase anon).
 * Protegidas por regras de segurança no servidor — podem ficar no repositório
 * para o time rodar o app sem criar .env local.
 *
 * Segredos de deploy (SUPABASE_ACCESS_TOKEN, OPENAI_API_KEY) NÃO entram aqui.
 */
const PUBLIC_ENV_DEFAULTS = {
  EXPO_PUBLIC_FIREBASE_API_KEY: 'AIzaSyDIGYiyGXJrHSHMMiwoc86upcd_BLIthq4',
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: 'orbita-fiap.firebaseapp.com',
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: 'orbita-fiap',
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: 'orbita-fiap.firebasestorage.app',
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '649295071611',
  EXPO_PUBLIC_FIREBASE_APP_ID: '1:649295071611:web:b71271be51e435069515de',
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID:
    '649295071611-ds35rvbjugjua54gc5i6bbp004ifu59e.apps.googleusercontent.com',
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID:
    '649295071611-7nfpj2sibkpa14bm60gkt5l8p5keli8i.apps.googleusercontent.com',
  EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: '',
  EXPO_PUBLIC_SUPABASE_URL: 'https://yifgbmrpnpljjrmjwwfq.supabase.co',
  EXPO_PUBLIC_SUPABASE_ANON_KEY: 'sb_publishable_IvRXj33P9hLrpR2Dr7Btmw_BP98I1C5',
} as const;

export type PublicEnvKey = keyof typeof PUBLIC_ENV_DEFAULTS;

export function publicEnv(key: PublicEnvKey): string {
  const fromProcess = process.env[key];
  if (typeof fromProcess === 'string' && fromProcess.length > 0) {
    return fromProcess;
  }
  return PUBLIC_ENV_DEFAULTS[key];
}

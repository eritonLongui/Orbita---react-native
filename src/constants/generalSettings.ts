import { Profile } from '../types';

export type AppLanguage = 'pt-BR' | 'en-US';

export type AppTimezone =
  | 'auto'
  | 'America/Sao_Paulo'
  | 'America/Manaus'
  | 'America/Rio_Branco'
  | 'America/Noronha'
  | 'UTC';

export const APP_LANGUAGE_OPTIONS: { key: AppLanguage; label: string }[] = [
  { key: 'pt-BR', label: 'Português (BR)' },
  { key: 'en-US', label: 'English (US)' },
];

export const APP_TIMEZONE_OPTIONS: { key: AppTimezone; label: string }[] = [
  { key: 'auto', label: 'Automático' },
  { key: 'America/Sao_Paulo', label: 'Brasília (UTC-3)' },
  { key: 'America/Manaus', label: 'Manaus (UTC-4)' },
  { key: 'America/Rio_Branco', label: 'Acre (UTC-5)' },
  { key: 'America/Noronha', label: 'Fernando de Noronha (UTC-2)' },
  { key: 'UTC', label: 'UTC' },
];

const DEFAULT_LANGUAGE: AppLanguage = 'pt-BR';
const DEFAULT_TIMEZONE: AppTimezone = 'auto';

export function getGeneralSettingsFromProfile(profile: Profile | null | undefined): {
  language: AppLanguage;
  timezone: AppTimezone;
} {
  const prefs = profile?.preferences ?? {};
  const language = prefs.app_language as AppLanguage | undefined;
  const timezone = prefs.app_timezone as AppTimezone | undefined;

  return {
    language:
      language && APP_LANGUAGE_OPTIONS.some((o) => o.key === language) ? language : DEFAULT_LANGUAGE,
    timezone:
      timezone && APP_TIMEZONE_OPTIONS.some((o) => o.key === timezone) ? timezone : DEFAULT_TIMEZONE,
  };
}

export function getAppLanguageLabel(language: AppLanguage): string {
  return APP_LANGUAGE_OPTIONS.find((o) => o.key === language)?.label ?? 'Português (BR)';
}

export function getAppTimezoneLabel(timezone: AppTimezone): string {
  return APP_TIMEZONE_OPTIONS.find((o) => o.key === timezone)?.label ?? 'Automático';
}

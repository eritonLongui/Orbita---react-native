import React, { useEffect, useState } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import {
  APP_LANGUAGE_OPTIONS,
  APP_TIMEZONE_OPTIONS,
  AppLanguage,
  AppTimezone,
  getGeneralSettingsFromProfile,
} from '../../constants/generalSettings';
import { SettingsBackHeader } from '../../components/settings/SettingsBackHeader';
import { OrbitaCard } from '../../components/ui/OrbitaCard';
import { GlassChip } from '../../components/ui/GlassChip';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useAuth } from '../../providers/AuthProvider';
import { updateGeneralPreferences } from '../../services/profile';

export function GeneralSettingsScreen() {
  const { profile, user, patchProfile } = useAuth();
  const initial = getGeneralSettingsFromProfile(profile);
  const [language, setLanguage] = useState<AppLanguage>(initial.language);
  const [timezone, setTimezone] = useState<AppTimezone>(initial.timezone);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const resolved = getGeneralSettingsFromProfile(profile);
    setLanguage(resolved.language);
    setTimezone(resolved.timezone);
  }, [profile]);

  const persist = async (patch: { language?: AppLanguage; timezone?: AppTimezone }) => {
    if (!user) return false;

    const { profile: updated, error } = await updateGeneralPreferences(user.uid, profile, patch);

    if (updated) {
      patchProfile(updated);
      const resolved = getGeneralSettingsFromProfile(updated);
      setLanguage(resolved.language);
      setTimezone(resolved.timezone);
      setSaveError(error ?? null);
      return true;
    }

    setSaveError(error ?? 'Não foi possível salvar as configurações.');
    return false;
  };

  const handleLanguage = async (next: AppLanguage) => {
    if (next === language) return;
    const previous = language;
    setLanguage(next);
    setSaveError(null);

    const ok = await persist({ language: next });
    if (!ok) setLanguage(previous);
  };

  const handleTimezone = async (next: AppTimezone) => {
    if (next === timezone) return;
    const previous = timezone;
    setTimezone(next);
    setSaveError(null);

    const ok = await persist({ timezone: next });
    if (!ok) setTimezone(previous);
  };

  return (
    <ScreenWrapper tabBarOffset>
      <SettingsBackHeader title="Configurações gerais" />

      <YStack gap="$4" pt="$4" px="$2">
        {saveError ? (
          <Text fontSize={13} color="$red10" lineHeight={18}>
            {saveError}
          </Text>
        ) : null}

        <OrbitaCard>
          <YStack gap="$3">
            <Text fontSize={15} fontWeight="700" color="$text">
              Idioma
            </Text>
            <XStack gap="$2" flexWrap="wrap">
              {APP_LANGUAGE_OPTIONS.map((option) => (
                <GlassChip
                  key={option.key}
                  label={option.label}
                  selected={language === option.key}
                  onPress={() => handleLanguage(option.key)}
                />
              ))}
            </XStack>
          </YStack>
        </OrbitaCard>

        <OrbitaCard>
          <YStack gap="$3">
            <Text fontSize={15} fontWeight="700" color="$text">
              Fuso horário
            </Text>
            <XStack gap="$2" flexWrap="wrap">
              {APP_TIMEZONE_OPTIONS.map((option) => (
                <GlassChip
                  key={option.key}
                  label={option.label}
                  selected={timezone === option.key}
                  onPress={() => handleTimezone(option.key)}
                />
              ))}
            </XStack>
          </YStack>
        </OrbitaCard>
      </YStack>
    </ScreenWrapper>
  );
}

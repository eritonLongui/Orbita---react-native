import React, { useState } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { SettingsBackHeader } from '../../components/settings/SettingsBackHeader';
import {
  getLyraVoiceConfigFromProfile,
  LYRA_VOICE_STYLE_PRESETS,
} from '../../constants/lyraVoice';
import { OrbitaCard } from '../../components/ui/OrbitaCard';
import { GlassChip } from '../../components/ui/GlassChip';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useAuth } from '../../providers/AuthProvider';
import { updateLyraVoicePreferences } from '../../services/profile';
import { LyraVoiceStyle } from '../../types';

export function LyraSettingsScreen() {
  const { profile, user, patchProfile } = useAuth();
  const initialVoice = getLyraVoiceConfigFromProfile(profile);
  const [voiceStyle, setVoiceStyle] = useState<LyraVoiceStyle>(initialVoice.style);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleVoiceStyle = async (style: LyraVoiceStyle) => {
    if (!user) return;
    const previousStyle = voiceStyle;
    setVoiceStyle(style);
    setSaveError(null);

    const { profile: updated, error } = await updateLyraVoicePreferences(user.uid, profile, {
      style,
      accent: 'none',
    });

    if (updated) {
      patchProfile(updated);
      const resolved = getLyraVoiceConfigFromProfile(updated);
      setVoiceStyle(resolved.style);
      if (error) setSaveError(error);
      return;
    }

    setVoiceStyle(previousStyle);
    setSaveError(error ?? 'Não foi possível salvar o estilo de voz.');
  };

  return (
    <ScreenWrapper tabBarOffset scrollable={false}>
      <SettingsBackHeader title="Lyra" />

      <YStack gap="$5" pt="$4" px="$2">
        {saveError ? (
          <Text fontSize={13} color="$red10" lineHeight={18}>
            {saveError}
          </Text>
        ) : null}

        <OrbitaCard>
          <YStack gap="$4">
            <YStack gap="$1">
              <Text fontSize={15} fontWeight="700" color="$text">
                Estilo de voz
              </Text>
              <Text fontSize={13} color="$textMuted" lineHeight={18}>
                Define a personalidade e o tom da Lyra quando ela fala com você.
              </Text>
            </YStack>
            <XStack gap="$2" flexWrap="wrap">
              {LYRA_VOICE_STYLE_PRESETS.map((preset) => (
                <GlassChip
                  key={preset.key}
                  label={preset.label}
                  selected={voiceStyle === preset.key}
                  onPress={() => handleVoiceStyle(preset.key)}
                />
              ))}
            </XStack>
          </YStack>
        </OrbitaCard>
      </YStack>
    </ScreenWrapper>
  );
}

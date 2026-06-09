import { Camera } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';
import { Input, Text, YStack } from 'tamagui';
import { SettingsBackHeader } from '../../components/settings/SettingsBackHeader';
import { OrbitaCard } from '../../components/ui/OrbitaCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { themeColors } from '../../constants/theme';
import { useAuth } from '../../providers/AuthProvider';
import { pickProfileImage } from '../../services/avatarImage';
import { updatePreferences, updateProfileAvatar } from '../../services/profile';
import { getProfileInitial, getProfilePhotoUrl } from '../../utils/profilePhoto';

export function ProfileEditScreen() {
  const { profile, user, refreshProfile, patchProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? user?.displayName ?? '');
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    () => getProfilePhotoUrl(profile, user),
  );
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFullName(profile?.full_name ?? user?.displayName ?? '');
    setPhotoPreview(getProfilePhotoUrl(profile, user));
  }, [profile, user]);

  const handleChangePhoto = async () => {
    if (!user || photoLoading) return;
    setError(null);

    try {
      const picked = await pickProfileImage();
      if (!picked) return;

      setPhotoLoading(true);
      setPhotoPreview(picked.uri);

      const { profile: updated, error: uploadError } = await updateProfileAvatar(
        user.uid,
        profile,
        picked,
      );

      if (updated) {
        patchProfile(updated);
        setPhotoPreview(updated.avatar_url ?? picked.uri);
        if (uploadError) setError(uploadError);
        return;
      }

      setPhotoPreview(getProfilePhotoUrl(profile, user));
      setError(uploadError ?? 'Não foi possível atualizar a foto.');
    } catch (e) {
      setPhotoPreview(getProfilePhotoUrl(profile, user));
      setError(e instanceof Error ? e.message : 'Não foi possível alterar a foto.');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !fullName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await updatePreferences(user.uid, { full_name: fullName.trim() });
      if (updated) {
        patchProfile(updated);
      }
      await refreshProfile();
    } catch {
      setError('Não foi possível salvar o nome.');
    } finally {
      setLoading(false);
    }
  };

  const initial = getProfileInitial(profile, user);

  return (
    <ScreenWrapper tabBarOffset>
      <SettingsBackHeader title="Editar perfil" />

      <YStack gap="$5" pt="$4" px="$2">
        {error ? (
          <Text fontSize={13} color="$red10" lineHeight={18}>
            {error}
          </Text>
        ) : null}

        <OrbitaCard>
          <YStack gap="$4" items="center">
            <Pressable
              onPress={handleChangePhoto}
              disabled={photoLoading}
              accessibilityRole="button"
              accessibilityLabel="Alterar foto de perfil"
            >
              <View style={styles.avatarWrap}>
                {photoPreview ? (
                  <Image source={{ uri: photoPreview }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarFallback]}>
                    <Text fontSize={28} fontWeight="700" color="$primary">
                      {initial}
                    </Text>
                  </View>
                )}

                <View style={styles.cameraBadge}>
                  {photoLoading ? (
                    <ActivityIndicator size="small" color={themeColors.text} />
                  ) : (
                    <Camera size={18} color={themeColors.text} />
                  )}
                </View>
              </View>
            </Pressable>

            <YStack gap="$1" items="center">
              <Text fontSize={15} fontWeight="700" color="$text">
                Foto de perfil
              </Text>
              <Text fontSize={13} color="$textMuted" text="center">
                Toque na imagem para escolher da galeria
              </Text>
            </YStack>
          </YStack>
        </OrbitaCard>

        <YStack gap="$3">
          <Text fontSize={14} fontWeight="600" color="$textMuted">
            Nome de exibição
          </Text>
          <Input
            value={fullName}
            onChangeText={setFullName}
            bg="$glassButton"
            borderColor="$glassBorder"
            rounded="$md"
            color="$text"
            placeholder="Seu nome"
            placeholderTextColor="$textSubtle"
            size="$4"
          />
        </YStack>

        <PrimaryButton
          label="Salvar"
          onPress={handleSave}
          loading={loading}
          disabled={!fullName.trim()}
        />
      </YStack>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  avatarFallback: {
    backgroundColor: themeColors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: themeColors.glassBorder,
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themeColors.surface,
    borderWidth: 1,
    borderColor: themeColors.glassBorder,
  },
});

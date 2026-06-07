import { User, deleteUser, reauthenticateWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Platform } from 'react-native';
import { auth } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { syncFirebaseUserPhoto, uploadProfileAvatar } from './avatar';
import { PickedProfileImage } from './avatarImage';
import {
  AppLanguage,
  AppTimezone,
  getGeneralSettingsFromProfile,
} from '../constants/generalSettings';
import { getLyraVoiceConfigFromProfile } from '../constants/lyraVoice';
import { LyraVoiceAccent, LyraVoiceStyle, Profile } from '../types';

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('fetchProfile error:', error.message);
    return null;
  }

  return data as Profile | null;
}

function buildFallbackProfile(user: User, onboardingCompleted: boolean): Profile {
  return {
    id: user.uid,
    email: user.email,
    full_name: user.displayName,
    avatar_url: user.photoURL,
    onboarding_completed: onboardingCompleted,
    voice_enabled: true,
    notification_enabled: true,
    created_at: new Date().toISOString(),
  };
}

export async function upsertProfileFromFirebaseUser(
  user: User,
  onboardingCompleted = false
): Promise<Profile | null> {
  const existing = await fetchProfile(user.uid);
  if (existing) return existing;

  const payload = {
    id: user.uid,
    email: user.email,
    full_name: user.displayName,
    avatar_url: user.photoURL,
    onboarding_completed: onboardingCompleted,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('profiles').insert(payload).select('*').maybeSingle();

  if (error) {
    if (error.code === '23505') {
      const profile = await fetchProfile(user.uid);
      if (profile) return profile;
    }
    console.warn('upsertProfile error:', error.message);
    return buildFallbackProfile(user, onboardingCompleted);
  }

  return data as Profile;
}

export async function completeOnboarding(
  userId: string,
  fullName: string,
  preferences?: Record<string, unknown>
) {
  const payload = {
    id: userId,
    full_name: fullName,
    onboarding_completed: true,
    updated_at: new Date().toISOString(),
    ...(preferences ? { preferences } : {}),
  };

  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });

  if (error) {
    console.warn('completeOnboarding error:', error.message);
    return null;
  }

  return fetchProfile(userId);
}

export interface ProfilePreferences {
  full_name?: string;
  avatar_url?: string;
  voice_enabled?: boolean;
  notification_enabled?: boolean;
  lyra_voice_style?: LyraVoiceStyle;
  lyra_voice_accent?: LyraVoiceAccent;
  preferences?: Record<string, unknown>;
}

async function persistProfileUpdate(
  userId: string,
  payload: Record<string, unknown>
): Promise<Profile | null> {
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (updateError) {
    console.warn('persistProfileUpdate error:', updateError.message);
    return null;
  }

  return fetchProfile(userId);
}

async function ensureProfileRow(userId: string): Promise<Profile | null> {
  const existing = await fetchProfile(userId);
  if (existing) return existing;

  const user = auth.currentUser;
  if (!user || user.uid !== userId) return null;

  return upsertProfileFromFirebaseUser(user, true);
}

export async function updatePreferences(
  userId: string,
  prefs: ProfilePreferences
): Promise<Profile | null> {
  await ensureProfileRow(userId);
  return persistProfileUpdate(userId, { ...prefs });
}

export interface LyraVoicePreferencesPatch {
  style?: LyraVoiceStyle;
  accent?: LyraVoiceAccent;
}

export async function updateLyraVoicePreferences(
  userId: string,
  currentProfile: Profile | null,
  patch: LyraVoicePreferencesPatch
): Promise<{ profile: Profile | null; error?: string }> {
  const currentPrefs = { ...(currentProfile?.preferences ?? {}) } as Record<string, unknown>;
  const currentVoice = getLyraVoiceConfigFromProfile(currentProfile);

  const style = patch.style ?? currentVoice.style;
  const accent = patch.accent ?? currentVoice.accent;

  const preferences = {
    ...currentPrefs,
    lyra_voice_style: style,
    lyra_voice_accent: accent,
  };

  await ensureProfileRow(userId);

  const fullPayload = {
    preferences,
    lyra_voice_style: style,
    lyra_voice_accent: accent,
  };

  let updated = await persistProfileUpdate(userId, fullPayload);

  if (!updated) {
    console.warn('updateLyraVoicePreferences columns error, trying preferences only');
    updated = await persistProfileUpdate(userId, { preferences });
  }

  if (updated) {
    return { profile: updated };
  }

  const mergedProfile: Profile = {
    ...(currentProfile ?? {
      id: userId,
      email: auth.currentUser?.email ?? null,
      full_name: auth.currentUser?.displayName ?? null,
      avatar_url: auth.currentUser?.photoURL ?? null,
      onboarding_completed: true,
      voice_enabled: true,
      notification_enabled: true,
      created_at: new Date().toISOString(),
    }),
    lyra_voice_style: style,
    lyra_voice_accent: accent,
    preferences,
  };

  return {
    profile: mergedProfile,
    error: 'Não foi possível confirmar o salvamento no servidor. Preferência aplicada localmente.',
  };
}

export async function updateProfileAvatar(
  userId: string,
  currentProfile: Profile | null,
  image: PickedProfileImage,
): Promise<{ profile: Profile | null; error?: string }> {
  try {
    const avatarUrl = await uploadProfileAvatar(userId, image);
    await syncFirebaseUserPhoto(avatarUrl);
    await ensureProfileRow(userId);

    const updated = await persistProfileUpdate(userId, { avatar_url: avatarUrl });

    if (updated) {
      return { profile: updated };
    }

    const mergedProfile: Profile = {
      ...(currentProfile ?? {
        id: userId,
        email: auth.currentUser?.email ?? null,
        full_name: auth.currentUser?.displayName ?? null,
        avatar_url: avatarUrl,
        onboarding_completed: true,
        voice_enabled: true,
        notification_enabled: true,
        created_at: new Date().toISOString(),
      }),
      avatar_url: avatarUrl,
    };

    return {
      profile: mergedProfile,
      error: 'Foto salva, mas não foi possível confirmar no servidor.',
    };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : 'Não foi possível atualizar a foto de perfil.';
    return { profile: null, error: message };
  }
}

export interface GeneralPreferencesPatch {
  language?: AppLanguage;
  timezone?: AppTimezone;
}

export async function updateGeneralPreferences(
  userId: string,
  currentProfile: Profile | null,
  patch: GeneralPreferencesPatch,
): Promise<{ profile: Profile | null; error?: string }> {
  const currentPrefs = { ...(currentProfile?.preferences ?? {}) } as Record<string, unknown>;
  const currentGeneral = getGeneralSettingsFromProfile(currentProfile);

  const language = patch.language ?? currentGeneral.language;
  const timezone = patch.timezone ?? currentGeneral.timezone;

  const preferences = {
    ...currentPrefs,
    app_language: language,
    app_timezone: timezone,
  };

  await ensureProfileRow(userId);

  const updated = await persistProfileUpdate(userId, { preferences });

  if (updated) {
    return { profile: updated };
  }

  const mergedProfile: Profile = {
    ...(currentProfile ?? {
      id: userId,
      email: auth.currentUser?.email ?? null,
      full_name: auth.currentUser?.displayName ?? null,
      avatar_url: auth.currentUser?.photoURL ?? null,
      onboarding_completed: true,
      voice_enabled: true,
      notification_enabled: true,
      created_at: new Date().toISOString(),
    }),
    preferences,
  };

  return {
    profile: mergedProfile,
    error: 'Não foi possível confirmar o salvamento no servidor. Preferência aplicada localmente.',
  };
}

export async function deleteConversationHistory(userId: string): Promise<boolean> {
  const { error } = await supabase.from('conversation_logs').delete().eq('user_id', userId);
  if (error) {
    console.warn('deleteConversationHistory error:', error.message);
    return false;
  }
  return true;
}

export async function deleteAccount(userId: string): Promise<{ ok: boolean; error?: string }> {
  const user = auth.currentUser;
  if (!user || user.uid !== userId) {
    return { ok: false, error: 'Usuário não autenticado.' };
  }

  try {
    if (Platform.OS === 'web') {
      const provider = new GoogleAuthProvider();
      await reauthenticateWithPopup(user, provider);
    }

    await supabase.from('conversation_logs').delete().eq('user_id', userId);
    await supabase.from('profiles').delete().eq('id', userId);
    await deleteUser(user);
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Falha ao excluir conta.';
    return { ok: false, error: message };
  }
}

import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import Constants from 'expo-constants';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform } from 'react-native';
import { ExpoGoGoogleAuthHandler } from '../components/auth/ExpoGoGoogleAuthHandler';
import { auth } from '../lib/firebase';
import { firebaseSignInWithIdToken } from '../services/firebaseAuth';
import {
  canUseNativeGoogleSignIn,
  configureGoogleSignIn,
  signInWithGoogleNative,
  signOutGoogleNative,
} from '../services/googleAuth';
import { getWebAuthUnsupportedMessage, isGoogleWebAuthSupported } from '../services/googleAuthWeb';
import { getOnboardingDoneLocal, setOnboardingDoneLocal } from '../services/onboardingStorage';
import { completeOnboarding, fetchProfile, upsertProfileFromFirebaseUser } from '../services/profile';
import { Profile } from '../types';

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  /** True apenas no boot inicial (não em cada evento do Firebase). */
  initializing: boolean;
  signingIn: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  finishOnboarding: (fullName: string, preferences?: Record<string, unknown>) => Promise<void>;
  signOutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  patchProfile: (profile: Profile) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getAuthErrorMessage(error: unknown) {
  const code = (error as { code?: string })?.code;
  if (code === 'auth/popup-blocked') {
    return 'Popup bloqueado. Permita pop-ups para localhost no Chrome.';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'Domínio não autorizado no Firebase. Adicione localhost em Authorized domains.';
  }
  if (code === 'auth/cancelled-popup-request' || code === 'auth/popup-closed-by-user') {
    return 'Login cancelado.';
  }
  return 'Não foi possível entrar com Google. Tente novamente.';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  /** Só bloqueia a UI na primeira resolução de sessão — não a cada refresh de token. */
  const [initializing, setInitializing] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const isWeb = Platform.OS === 'web';
  const isExpoGo = Constants.appOwnership === 'expo';
  const expoPromptRef = useRef<(() => Promise<void>) | null>(null);
  const signingInRef = useRef(false);

  const syncProfile = useCallback(async (firebaseUser: User) => {
    const localOnboardingDone = await getOnboardingDoneLocal(firebaseUser.uid);
    const existing = await fetchProfile(firebaseUser.uid);

    if (existing) {
      if (localOnboardingDone && !existing.onboarding_completed) {
        const synced = await completeOnboarding(
          firebaseUser.uid,
          existing.full_name ?? firebaseUser.displayName ?? 'Usuário',
          existing.preferences
        );
        setProfile(synced ?? { ...existing, onboarding_completed: true });
        return;
      }
      setProfile(existing);
      return;
    }

    if (localOnboardingDone) {
      setProfile({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        full_name: firebaseUser.displayName,
        avatar_url: firebaseUser.photoURL,
        onboarding_completed: true,
        voice_enabled: true,
        notification_enabled: true,
        created_at: new Date().toISOString(),
      });
      await completeOnboarding(
        firebaseUser.uid,
        firebaseUser.displayName ?? 'Usuário'
      );
      return;
    }

    const created = await upsertProfileFromFirebaseUser(firebaseUser, false);
    setProfile(created);
  }, []);

  useEffect(() => {
    if (isExpoGo) {
      WebBrowser.maybeCompleteAuthSession();
    }
    configureGoogleSignIn();
  }, [isExpoGo]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await syncProfile(firebaseUser);
      } else {
        setProfile(null);
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, [syncProfile]);

  const signInWithGoogle = useCallback(async () => {
    if (signingInRef.current) return;

    signingInRef.current = true;
    setAuthError(null);
    setSigningIn(true);

    try {
      // Dev build iOS/Android — fluxo de produção
      if (canUseNativeGoogleSignIn()) {
        const result = await signInWithGoogleNative();
        if (result === 'cancelled') {
          setAuthError('Login cancelado.');
          return;
        }

        const firebaseUser = await firebaseSignInWithIdToken(result.idToken);
        await syncProfile(firebaseUser);
        return;
      }

      // Web — apenas dev local (popup Firebase, sem redirect)
      if (isWeb) {
        if (!isGoogleWebAuthSupported()) {
          setAuthError(getWebAuthUnsupportedMessage());
          return;
        }

        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        await syncProfile(result.user);
        return;
      }

      // Expo Go — fallback browser (instável; prefira dev build)
      if (!expoPromptRef.current) {
        setAuthError('Use o dev build para login Google: bash scripts/run-ios.sh');
        return;
      }

      await expoPromptRef.current();
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setAuthError(getAuthErrorMessage(error));
    } finally {
      signingInRef.current = false;
      setSigningIn(false);
    }
  }, [isWeb, syncProfile]);

  const finishOnboarding = useCallback(
    async (fullName: string, preferences?: Record<string, unknown>) => {
      if (!user) return;

      await setOnboardingDoneLocal(user.uid);

      const updated = await completeOnboarding(user.uid, fullName, preferences);
      if (updated) {
        setProfile(updated);
      } else {
        setProfile((prev) =>
          prev
            ? { ...prev, full_name: fullName, onboarding_completed: true, preferences }
            : {
                id: user.uid,
                email: user.email,
                full_name: fullName,
                avatar_url: user.photoURL,
                onboarding_completed: true,
                voice_enabled: true,
                notification_enabled: true,
                preferences,
                created_at: new Date().toISOString(),
              }
        );
      }
    },
    [user]
  );

  const signOutUser = useCallback(async () => {
    await signOutGoogleNative();
    await signOut(auth);
    setProfile(null);
    setAuthError(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await syncProfile(user);
  }, [syncProfile, user]);

  const patchProfile = useCallback((next: Profile) => {
    setProfile(next);
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      initializing,
      signingIn,
      authError,
      signInWithGoogle,
      finishOnboarding,
      signOutUser,
      refreshProfile,
      patchProfile,
    }),
    [
      user,
      profile,
      initializing,
      signingIn,
      authError,
      signInWithGoogle,
      finishOnboarding,
      signOutUser,
      refreshProfile,
      patchProfile,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {isExpoGo ? (
        <ExpoGoGoogleAuthHandler
          promptRef={expoPromptRef}
          onSigningInChange={setSigningIn}
          onAuthError={setAuthError}
          onSignedIn={syncProfile}
        />
      ) : null}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

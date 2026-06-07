import * as Google from 'expo-auth-session/providers/google';
import { User } from 'firebase/auth';
import React, { useEffect } from 'react';
import { publicEnv } from '../../config/publicEnv';
import { GOOGLE_REDIRECT_OPTIONS } from '../../services/googleAuth';
import { firebaseSignInWithIdToken } from '../../services/firebaseAuth';

type Props = {
  onSigningInChange: (signingIn: boolean) => void;
  onAuthError: (message: string | null) => void;
  onSignedIn: (user: User) => Promise<void>;
  promptRef: React.MutableRefObject<(() => Promise<void>) | null>;
};

export function ExpoGoGoogleAuthHandler({
  onSigningInChange,
  onAuthError,
  onSignedIn,
  promptRef,
}: Props) {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      webClientId: publicEnv('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID'),
      iosClientId: publicEnv('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID'),
      androidClientId: publicEnv('EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID') || undefined,
      selectAccount: false,
    },
    GOOGLE_REDIRECT_OPTIONS
  );

  useEffect(() => {
    promptRef.current = async () => {
      if (!request) {
        onAuthError('Login Google ainda não está pronto. Tente novamente em instantes.');
        onSigningInChange(false);
        return;
      }
      onAuthError(null);
      await promptAsync();
    };
  }, [onAuthError, onSigningInChange, promptAsync, promptRef, request]);

  useEffect(() => {
    if (!response) return;

    const signIn = async () => {
      if (response.type !== 'success') {
        onSigningInChange(false);
        if (response.type === 'error') {
          onAuthError('Não foi possível concluir o login com Google.');
        }
        return;
      }

      try {
        onSigningInChange(true);
        const idToken = response.params.id_token;
        if (!idToken) throw new Error('Token Google não retornado');

        const firebaseUser = await firebaseSignInWithIdToken(idToken);
        await onSignedIn(firebaseUser);
        onAuthError(null);
      } catch (error) {
        console.error('Google sign-in failed:', error);
        onAuthError('Falha ao entrar com Google. Tente novamente.');
      } finally {
        onSigningInChange(false);
      }
    };

    signIn();
  }, [onAuthError, onSignedIn, onSigningInChange, response]);

  return null;
}

import { useCallback, useRef, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { sendToLyra } from '../services/conversation';
import { getCheckInAreasCovered } from '../services/checkIn';
import {
  cancelRecording,
  getMicrophonePermissionStatus,
  playAudioBase64,
  playReceivedFeedback,
  requestMicrophonePermission,
  speakText,
  startRecording,
  stopPlayback,
  stopRecording,
  stopSpeaking,
} from '../services/voice';
import { getLyraVoiceConfigFromProfile } from '../constants/lyraVoice';
import { useAuth } from '../providers/AuthProvider';
import { useLyraState } from '../providers/LyraStateProvider';
import { fetchCheckInOpening, processStructuredCheckInTurn } from '../utils/checkInFlow';
import { processCheckInResponse } from '../utils/checkInResponse';
import { LyraChatResponse } from '../types';

export type LyraSessionState = 'idle' | 'recording' | 'processing' | 'responding';

async function playLyraReply(
  reply: string,
  audioBase64?: string,
  speechRate = 0.95,
  allowSystemFallback = true,
) {
  if (audioBase64) {
    try {
      await playAudioBase64(audioBase64);
      return;
    } catch (e) {
      console.warn('playAudioBase64 failed:', e);
    }
  }
  if (allowSystemFallback) {
    await speakText(reply, speechRate);
  }
}

interface UseLyraAssistantOptions {
  checkInMode?: boolean;
  continuousVoice?: boolean;
  syncLyraState?: boolean;
  onCheckInComplete?: (isFirstCompletion: boolean) => void;
}

export function useLyraAssistant(options?: UseLyraAssistantOptions) {
  const { profile } = useAuth();
  const { setLyraState } = useLyraState();
  const [state, setState] = useState<LyraSessionState>('idle');
  const [error, setError] = useState<string | null>(null);
  const stoppingRef = useRef(false);
  const initiatingRef = useRef(false);
  const stateRef = useRef<LyraSessionState>('idle');
  const sessionGenerationRef = useRef(0);

  const checkInMode = options?.checkInMode ?? false;
  const continuousVoice = options?.continuousVoice ?? !checkInMode;
  const syncLyraState = options?.syncLyraState ?? true;
  const autoMicRef = useRef(true);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!syncLyraState) return;
    setLyraState(state);
  }, [state, setLyraState, syncLyraState]);

  const voiceEnabled = true;
  const voiceConfig = getLyraVoiceConfigFromProfile(profile);
  const stopVoiceSessionRef = useRef<() => Promise<void>>(async () => {});
  const startVoiceSessionRef = useRef<() => Promise<void>>(async () => {});

  const isSessionCurrent = useCallback(
    (generation: number) => sessionGenerationRef.current === generation,
    [],
  );

  const handleLyraResponse = useCallback(
    async (response: LyraChatResponse) => {
      const generation = sessionGenerationRef.current;
      setState('responding');
      let autoMicStarted = false;

      try {
        if (voiceEnabled && isSessionCurrent(generation)) {
          await playLyraReply(response.reply, response.audioBase64, voiceConfig.speechRate);
        }
        if (!isSessionCurrent(generation)) return;
        await processCheckInResponse(response, checkInMode, options?.onCheckInComplete);

        if (
          (checkInMode || continuousVoice) &&
          !response.checkInComplete &&
          autoMicRef.current &&
          isSessionCurrent(generation)
        ) {
          await new Promise((r) => setTimeout(r, 300));
          if (isSessionCurrent(generation) && autoMicRef.current) {
            autoMicStarted = true;
            await startVoiceSessionRef.current();
          }
          return;
        }
      } finally {
        if (!autoMicStarted && isSessionCurrent(generation)) {
          setState('idle');
        }
      }
    },
    [voiceEnabled, voiceConfig.speechRate, checkInMode, continuousVoice, options, isSessionCurrent],
  );

  const stopVoiceSession = useCallback(async () => {
    if (stoppingRef.current) return;
    stoppingRef.current = true;
    const generation = sessionGenerationRef.current;
    setState('processing');
    setError(null);

    try {
      const audio = await stopRecording();

      if (!isSessionCurrent(generation)) return;

      if (!audio?.base64) {
        setState('idle');
        setError('Não captei sua voz. Tente falar um pouco mais alto e por mais tempo.');
        return;
      }

      let response: LyraChatResponse;

      if (checkInMode) {
        response = await processStructuredCheckInTurn({
          audioBase64: audio.base64,
          audioMimeType: audio.mimeType,
          audioExt: audio.ext,
          voiceEnabled: true,
          voiceStyle: voiceConfig.style,
          voiceAccent: voiceConfig.accent,
        });
      } else {
        response = await sendToLyra({
          audioBase64: audio.base64,
          audioMimeType: audio.mimeType,
          audioExt: audio.ext,
          voiceEnabled: true,
          voiceStyle: voiceConfig.style,
          voiceAccent: voiceConfig.accent,
        });
      }

      if (!isSessionCurrent(generation)) return;
      await handleLyraResponse(response);
    } catch (e) {
      if (!isSessionCurrent(generation)) return;
      console.warn('Lyra session failed:', e);
      setError(e instanceof Error ? e.message : 'Erro ao processar sua mensagem.');
      setState('idle');
    } finally {
      stoppingRef.current = false;
    }
  }, [voiceConfig, checkInMode, handleLyraResponse, isSessionCurrent]);

  const handleSilenceDetected = useCallback(async () => {
    if (stoppingRef.current) return;
    await playReceivedFeedback();
    await stopVoiceSessionRef.current();
  }, []);

  const handleInactivityTimeout = useCallback(() => {
    autoMicRef.current = false;
    setState('idle');
  }, []);

  const startVoiceSession = useCallback(async () => {
    const generation = sessionGenerationRef.current;
    setError(null);
    setState('recording');

    if (Platform.OS !== 'web') {
      const granted = await requestMicrophonePermission();
      if (!isSessionCurrent(generation)) return;

      if (!granted) {
        setError('Permissão de microfone necessária para conversar com a Lyra.');
        setState('idle');
        return;
      }
    }

    try {
      await startRecording({
        onSilenceAutoStop: handleSilenceDetected,
        onInactivityTimeout: handleInactivityTimeout,
        inactivityTimeoutMs: 120_000,
      });
      if (!isSessionCurrent(generation)) {
        cancelRecording();
        return;
      }
      setState('recording');
    } catch (e) {
      if (!isSessionCurrent(generation)) return;
      console.warn('startRecording failed:', e);
      setError('Não foi possível iniciar a gravação. Use o dev build nativo (não Expo Go).');
      setState('idle');
    }
  }, [handleSilenceDetected, handleInactivityTimeout, isSessionCurrent]);

  stopVoiceSessionRef.current = stopVoiceSession;
  startVoiceSessionRef.current = startVoiceSession;

  const initiateCheckIn = useCallback(async (): Promise<boolean> => {
    if (!checkInMode || initiatingRef.current || stateRef.current !== 'idle') {
      return false;
    }

    initiatingRef.current = true;
    autoMicRef.current = true;
    const generation = sessionGenerationRef.current;
    setState('processing');
    setError(null);

    try {
      const response = await fetchCheckInOpening(
        true,
        voiceConfig.style,
        voiceConfig.accent,
      );

      if (!isSessionCurrent(generation)) return false;
      await handleLyraResponse(response);
      return true;
    } catch (e) {
      if (!isSessionCurrent(generation)) return false;
      console.warn('initiateCheckIn failed:', e);
      setError(e instanceof Error ? e.message : 'Erro ao iniciar check-in.');
      setState('idle');
      return false;
    } finally {
      initiatingRef.current = false;
    }
  }, [checkInMode, voiceConfig, handleLyraResponse, isSessionCurrent]);

  const sendTextMessage = useCallback(
    async (text: string, textModeOnly: boolean = false) => {
      if (!text.trim()) return;
      setState('processing');
      setError(null);

      try {
        const areasCovered = checkInMode ? await getCheckInAreasCovered() : undefined;
        const response = await sendToLyra({
          text: text.trim(),
          voiceEnabled: true,
          voiceStyle: voiceConfig.style,
          voiceAccent: voiceConfig.accent,
          checkInMode,
          areasCovered,
        });

        if (!textModeOnly && voiceEnabled) {
          await handleLyraResponse(response);
        } else {
          await processCheckInResponse(response, checkInMode, options?.onCheckInComplete);
          setState('idle');
        }

        return response.reply;
      } catch (e) {
        console.warn('sendTextMessage failed:', e);
        setError(e instanceof Error ? e.message : 'Erro ao enviar mensagem.');
        setState('idle');
        throw e;
      }
    },
    [voiceEnabled, voiceConfig, checkInMode, options, handleLyraResponse],
  );

  const toggleRecording = useCallback(async () => {
    const current = stateRef.current;

    if (current === 'recording') {
      await playReceivedFeedback();
      await stopVoiceSession();
      return;
    }

    if (current === 'idle') {
      autoMicRef.current = true;
      await startVoiceSession();
    }
  }, [startVoiceSession, stopVoiceSession]);

  const deliverReply = useCallback(
    async (reply: string, audioBase64?: string) => {
      const generation = sessionGenerationRef.current;
      autoMicRef.current = false;
      setError(null);
      setState('responding');

      try {
        if (!voiceEnabled || !isSessionCurrent(generation)) return;

        let audio = audioBase64;
        if (!audio) {
          try {
            const ttsRes = await sendToLyra({
              text: reply,
              structuredCheckIn: 'tts',
              voiceEnabled: true,
              voiceStyle: voiceConfig.style,
              voiceAccent: voiceConfig.accent,
            });
            audio = ttsRes.audioBase64;
          } catch (e) {
            console.warn('deliverReply TTS request failed:', e);
          }
        }

        if (isSessionCurrent(generation)) {
          await playLyraReply(reply, audio, voiceConfig.speechRate, false);
        }
      } finally {
        if (isSessionCurrent(generation)) {
          setState('idle');
        }
      }
    },
    [voiceEnabled, voiceConfig, isSessionCurrent],
  );

  const cancelSession = useCallback(() => {
    sessionGenerationRef.current += 1;
    autoMicRef.current = false;
    cancelRecording();
    void stopPlayback();
    stopSpeaking();
    stoppingRef.current = false;
    initiatingRef.current = false;
    setState('idle');
    setError(null);
  }, []);

  const checkMicPermission = useCallback(() => getMicrophonePermissionStatus(), []);

  return {
    state,
    error,
    voiceEnabled,
    toggleRecording,
    sendTextMessage,
    deliverReply,
    initiateCheckIn,
    cancelSession,
    checkMicPermission,
  };
};

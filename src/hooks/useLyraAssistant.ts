import { useCallback, useRef, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { sendToLyra } from '../services/conversation';
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

export type LyraSessionState = 'idle' | 'recording' | 'processing' | 'responding';

async function playLyraReply(reply: string, audioBase64?: string, speechRate = 0.95) {
  if (audioBase64) {
    try {
      await playAudioBase64(audioBase64);
      return;
    } catch (e) {
      console.warn('playAudioBase64 failed, fallback to speech:', e);
    }
  }
  await speakText(reply, speechRate);
}

export function useLyraAssistant() {
  const { profile } = useAuth();
  const { setLyraState } = useLyraState();
  const [state, setState] = useState<LyraSessionState>('idle');
  const [error, setError] = useState<string | null>(null);
  const stoppingRef = useRef(false);

  // Sincronizar estado local com o contexto global
  useEffect(() => {
    setLyraState(state);
  }, [state, setLyraState]);

  const voiceEnabled = true;
  const voiceConfig = getLyraVoiceConfigFromProfile(profile);

  const stopVoiceSession = useCallback(async () => {
    if (stoppingRef.current) return;
    stoppingRef.current = true;
    setState('processing');
    setError(null);

    try {
      const audio = await stopRecording();

      if (!audio?.base64) {
        setState('idle');
        setError('Não captei sua voz. Tente falar um pouco mais alto e por mais tempo.');
        return;
      }

      const response = await sendToLyra({
        audioBase64: audio.base64,
        audioMimeType: audio.mimeType,
        audioExt: audio.ext,
        voiceEnabled,
        voiceStyle: voiceConfig.style,
        voiceAccent: voiceConfig.accent,
      });

      setState('responding');

      if (voiceEnabled) {
        await playLyraReply(
          response.reply,
          response.audioBase64,
          voiceConfig.speechRate
        );
      }

      setState('idle');
    } catch (e) {
      console.warn('Lyra session failed:', e);
      setError(e instanceof Error ? e.message : 'Erro ao processar sua mensagem.');
      setState('idle');
    } finally {
      stoppingRef.current = false;
    }
  }, [voiceEnabled, voiceConfig]);

  const handleSilenceDetected = useCallback(async () => {
    if (stoppingRef.current) return;
    await playReceivedFeedback();
    await stopVoiceSession();
  }, [stopVoiceSession]);

  const startVoiceSession = useCallback(async () => {
    setError(null);

    if (Platform.OS !== 'web') {
      const granted = await requestMicrophonePermission();
      if (!granted) {
        setError('Permissão de microfone necessária para conversar com a Lyra.');
        return;
      }
    }

    try {
      await startRecording(handleSilenceDetected);
      setState('recording');
    } catch (e) {
      console.warn('startRecording failed:', e);
      setError('Não foi possível iniciar a gravação. Use o dev build nativo (não Expo Go).');
    }
  }, [handleSilenceDetected]);

  const sendTextMessage = useCallback(
    async (text: string, textModeOnly: boolean = false) => {
      if (!text.trim()) return;
      setState('processing');
      setError(null);

      try {
        const response = await sendToLyra({
          text: text.trim(),
          voiceEnabled: textModeOnly ? false : voiceEnabled,
          voiceStyle: voiceConfig.style,
          voiceAccent: voiceConfig.accent,
        });
        setState('responding');

        // No modo texto, não reproduz áudio
        if (!textModeOnly && voiceEnabled) {
          await playLyraReply(
            response.reply,
            response.audioBase64,
            voiceConfig.speechRate
          );
        }

        setState('idle');
        return response.reply;
      } catch (e) {
        console.warn('sendTextMessage failed:', e);
        setError(e instanceof Error ? e.message : 'Erro ao enviar mensagem.');
        setState('idle');
        throw e;
      }
    },
    [voiceEnabled, voiceConfig]
  );

  const toggleRecording = useCallback(async () => {
    if (state === 'recording') {
      await playReceivedFeedback();
      await stopVoiceSession();
      return;
    }

    if (state === 'idle' || state === 'responding') {
      await stopPlayback();
      stopSpeaking();
      await startVoiceSession();
    }
  }, [state, startVoiceSession, stopVoiceSession]);

  const cancelSession = useCallback(() => {
    cancelRecording();
    void stopPlayback();
    stopSpeaking();
    stoppingRef.current = false;
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
    cancelSession,
    checkMicPermission,
  };
}

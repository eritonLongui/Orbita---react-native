import { useCallback, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLyraVoiceConfigFromProfile } from '../constants/lyraVoice';
import { pickChatImage } from '../services/chatImage';
import { buildCheckInOpening } from '../services/checkIn';
import { sendToLyra } from '../services/conversation';
import { useAuth } from '../providers/AuthProvider';
import { useLyraState } from '../providers/LyraStateProvider';
import { processStructuredCheckInTurn } from '../utils/checkInFlow';
import { subscribeLyraTextChatClear } from '../services/lyraTextChatSession';
import { processCheckInResponse } from '../utils/checkInResponse';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  imageUri?: string;
}

function isToday(date: Date): boolean {
  return date.toDateString() === new Date().toDateString();
}

function filterTodayMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter((msg) => isToday(msg.timestamp));
}

interface UseLyraTextChatOptions {
  checkInMode?: boolean;
  syncLyraState?: boolean;
  onCheckInComplete?: (isFirstCompletion: boolean) => void;
}

export function useLyraTextChat(options?: UseLyraTextChatOptions) {
  const { profile } = useAuth();
  const { setLyraState } = useLyraState();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const voiceConfig = getLyraVoiceConfigFromProfile(profile);
  const checkInMode = options?.checkInMode ?? false;
  const syncLyraState = options?.syncLyraState ?? true;

  useEffect(() => {
    void AsyncStorage.removeItem('lyra_text_messages');
  }, []);

  useEffect(() => {
    return subscribeLyraTextChatClear(() => {
      setMessages([]);
      setError(null);
    });
  }, []);

  useEffect(() => {
    if (!syncLyraState) return;
    if (isLoading) {
      setLyraState('processing');
    } else {
      setLyraState('idle');
    }
  }, [isLoading, setLyraState, syncLyraState]);

  const appendLyraMessage = useCallback((text: string) => {
    const lyraMessage: ChatMessage = {
      id: Date.now().toString() + '-lyra',
      text,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => filterTodayMessages([...prev, lyraMessage]));
  }, []);

  const sendMessage = useCallback(
    async (
      text: string,
      image?: { uri: string; base64: string; mimeType: string },
    ) => {
      const trimmed = text.trim();
      if (isLoading || (!trimmed && !image)) return;

      const displayText = trimmed || '📷 Foto';

      const userMessage: ChatMessage = {
        id: Date.now().toString() + '-user',
        text: displayText,
        isUser: true,
        timestamp: new Date(),
        imageUri: image?.uri,
      };

      setMessages((prev) => filterTodayMessages([...prev, userMessage]));
      setIsLoading(true);
      setError(null);

      try {
        let response;

        if (checkInMode && !image) {
          response = await processStructuredCheckInTurn({
            text: trimmed,
            voiceEnabled: false,
            voiceStyle: voiceConfig.style,
            voiceAccent: voiceConfig.accent,
          });
        } else {
          response = await sendToLyra({
            text: trimmed || undefined,
            imageBase64: image?.base64,
            imageMimeType: image?.mimeType,
            voiceEnabled: false,
            voiceStyle: voiceConfig.style,
            voiceAccent: voiceConfig.accent,
          });
        }

        appendLyraMessage(response.reply);
        await processCheckInResponse(response, checkInMode && !image, options?.onCheckInComplete);
      } catch (e) {
        console.warn('sendMessage failed:', e);
        setError(e instanceof Error ? e.message : 'Erro ao enviar mensagem.');
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, voiceConfig, checkInMode, options, appendLyraMessage],
  );

  const initiateCheckIn = useCallback(async (): Promise<boolean> => {
    if (isLoading || !checkInMode) return false;

    setIsLoading(true);
    setError(null);

    try {
      const opening = buildCheckInOpening();
      appendLyraMessage(opening.reply);
      await processCheckInResponse(opening, true, options?.onCheckInComplete);
      return true;
    } catch (e) {
      console.warn('initiateCheckIn failed:', e);
      setError(e instanceof Error ? e.message : 'Erro ao iniciar check-in.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, checkInMode, voiceConfig, options, appendLyraMessage]);

  const pickImage = useCallback(async () => {
    try {
      setError(null);
      return await pickChatImage();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Não foi possível selecionar a foto.';
      setError(message);
      return null;
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const todayMessages = filterTodayMessages(messages);

  return {
    messages: todayMessages,
    isLoading,
    error,
    sendMessage,
    appendLyraMessage,
    initiateCheckIn,
    pickImage,
    clearMessages,
  };
}

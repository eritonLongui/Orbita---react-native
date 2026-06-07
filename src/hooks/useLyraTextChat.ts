import { useCallback, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLyraVoiceConfigFromProfile } from '../constants/lyraVoice';
import { pickChatImage } from '../services/chatImage';
import { sendToLyra } from '../services/conversation';
import { useAuth } from '../providers/AuthProvider';
import { useLyraState } from '../providers/LyraStateProvider';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  imageUri?: string;
}

const STORAGE_KEY = 'lyra_text_messages';

export function useLyraTextChat() {
  const { profile } = useAuth();
  const { setLyraState } = useLyraState();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const voiceConfig = getLyraVoiceConfigFromProfile(profile);

  // Carregar mensagens salvas ao inicializar
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Converter timestamps de volta para Date objects
          const messagesWithDates = parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(messagesWithDates);
        }
      } catch (e) {
        console.warn('Failed to load messages:', e);
      }
    };
    loadMessages();
  }, []);

  // Salvar mensagens quando alteradas
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
        console.warn('Failed to save messages:', e);
      }
    };
    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);

  // Sincronizar estado de loading com o contexto global
  useEffect(() => {
    if (isLoading) {
      setLyraState('processing');
    } else {
      setLyraState('idle');
    }
  }, [isLoading, setLyraState]);

  const sendMessage = useCallback(
    async (
      text: string,
      image?: { uri: string; base64: string; mimeType: string }
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

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await sendToLyra({
          text: trimmed || undefined,
          imageBase64: image?.base64,
          imageMimeType: image?.mimeType,
          voiceEnabled: false,
          voiceStyle: voiceConfig.style,
          voiceAccent: voiceConfig.accent,
        });

        const lyraMessage: ChatMessage = {
          id: Date.now().toString() + '-lyra',
          text: response.reply,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, lyraMessage]);
      } catch (e) {
        console.warn('sendMessage failed:', e);
        setError(e instanceof Error ? e.message : 'Erro ao enviar mensagem.');
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, voiceConfig]
  );

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

  const clearMessages = useCallback(async () => {
    setMessages([]);
    setError(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear messages:', e);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    pickImage,
    clearMessages,
  };
}
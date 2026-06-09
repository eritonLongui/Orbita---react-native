import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { ConversationMessage, LyraChatResponse, LyraVoiceAccent, LyraVoiceStyle } from '../types';

export async function fetchHistory(userId: string, limit = 20): Promise<ConversationMessage[]> {
  const { data, error } = await supabase
    .from('conversation_logs')
    .select('id, role, content, channel, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('fetchHistory error:', error.message);
    return [];
  }

  return (data ?? []).reverse() as ConversationMessage[];
}

export interface SendToLyraParams {
  text?: string;
  audioBase64?: string;
  audioMimeType?: string;
  audioExt?: string;
  imageBase64?: string;
  imageMimeType?: string;
  voiceEnabled?: boolean;
  voiceStyle?: LyraVoiceStyle;
  voiceAccent?: LyraVoiceAccent;
  checkInMode?: boolean;
  initiateCheckIn?: boolean;
  areasCovered?: string[];
}

const LYRA_TIMEOUT_MS = 35_000;

async function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function sendToLyra(params: SendToLyraParams): Promise<LyraChatResponse> {
  const { data, error } = await withTimeout(
    supabase.functions.invoke('lyra-chat', { body: params }),
    LYRA_TIMEOUT_MS,
    'A Lyra demorou demais. Tente novamente.',
  );

  if (error) {
    let message = error.message || 'Falha ao conversar com a Lyra';
    let serverDetail: string | undefined;

    if (error instanceof FunctionsHttpError && error.context) {
      try {
        const body = await error.context.json();
        if (typeof body?.error === 'string' && body.error.trim()) {
          serverDetail = body.error.trim();
        } else if (typeof body?.message === 'string' && body.message.trim()) {
          serverDetail = body.message.trim();
        }
      } catch {
        try {
          const raw = await error.context.text();
          if (raw?.trim()) serverDetail = raw.trim();
        } catch {
          // keep default message
        }
      }
    }

    if (serverDetail) {
      message = serverDetail;
    } else if (message.includes('non-2xx')) {
      message =
        'A Lyra não respondeu. Verifique sua conexão ou tente novamente em instantes.';
    }

    throw new Error(message);
  }

  const response = data as LyraChatResponse & { error?: string };
  if (response?.error) {
    throw new Error(response.error);
  }

  if (!response?.reply) {
    throw new Error('Resposta vazia da Lyra');
  }

  return response;
}

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
}

export async function sendToLyra(params: SendToLyraParams): Promise<LyraChatResponse> {
  const { data, error } = await supabase.functions.invoke('lyra-chat', {
    body: params,
  });

  if (error) {
    let message = error.message || 'Falha ao conversar com a Lyra';

    if (error instanceof FunctionsHttpError && error.context) {
      try {
        const body = await error.context.json();
        if (body?.error) message = body.error;
      } catch {
        // keep default message
      }
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

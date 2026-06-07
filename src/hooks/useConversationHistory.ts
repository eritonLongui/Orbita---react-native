import { useCallback, useEffect, useState } from 'react';
import { fetchHistory } from '../services/conversation';
import { useAuth } from '../providers/AuthProvider';
import { ConversationMessage } from '../types';

export function useConversationHistory() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const history = await fetchHistory(user.uid);
    setMessages(history);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { messages, loading, refresh };
}

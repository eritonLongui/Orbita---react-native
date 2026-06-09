import { useCallback, useState } from 'react';
import {
  markNotificationPromptShown,
  requestNotificationPermissionIfNeeded,
  shouldShowNotificationPrompt,
} from '../services/permissions';

export function useNotificationPermissionPrompt() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const check = useCallback(async () => {
    if (await shouldShowNotificationPrompt()) {
      setVisible(true);
    }
  }, []);

  const allow = useCallback(async () => {
    setLoading(true);
    try {
      await requestNotificationPermissionIfNeeded();
      await markNotificationPromptShown();
      setVisible(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const skip = useCallback(async () => {
    await markNotificationPromptShown();
    setVisible(false);
  }, []);

  return { visible, loading, check, allow, skip };
}

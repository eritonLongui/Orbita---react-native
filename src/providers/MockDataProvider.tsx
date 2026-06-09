import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { isMockDataEnabled, setMockDataEnabled } from '../services/devSettings';

interface MockDataContextValue {
  enabled: boolean;
  ready: boolean;
  setEnabled: (enabled: boolean) => Promise<void>;
}

const MockDataContext = createContext<MockDataContextValue | null>(null);

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void isMockDataEnabled().then((value) => {
      setEnabledState(value);
      setReady(true);
    });
  }, []);

  const setEnabled = useCallback(async (next: boolean) => {
    await setMockDataEnabled(next);
    setEnabledState(next);
  }, []);

  const value = useMemo(() => ({ enabled, ready, setEnabled }), [enabled, ready, setEnabled]);

  return <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>;
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData must be used within MockDataProvider');
  }
  return context;
}

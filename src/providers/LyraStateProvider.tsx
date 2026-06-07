import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LyraSessionState } from '../hooks/useLyraAssistant';

interface LyraStateContextType {
  lyraState: LyraSessionState;
  setLyraState: (state: LyraSessionState) => void;
}

const LyraStateContext = createContext<LyraStateContextType | undefined>(undefined);

export function LyraStateProvider({ children }: { children: ReactNode }) {
  const [lyraState, setLyraState] = useState<LyraSessionState>('idle');

  return (
    <LyraStateContext.Provider value={{ lyraState, setLyraState }}>
      {children}
    </LyraStateContext.Provider>
  );
}

export function useLyraState() {
  const context = useContext(LyraStateContext);
  if (context === undefined) {
    throw new Error('useLyraState must be used within a LyraStateProvider');
  }
  return context;
}
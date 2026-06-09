import { useCallback, useEffect, useState } from 'react';
import { isTodayCheckInComplete } from '../services/checkIn';
import {
  getVisitStreak,
  hasCompletedFirstLyraSession,
  isFirstLyraPending,
  markFirstLyraSessionCompleted,
  recordMissionVisit,
  shouldShowTabLabels,
} from '../services/journey';

interface JourneyState {
  firstLyraCompleted: boolean;
  firstLyraPending: boolean;
  todayCheckInComplete: boolean;
  showTabLabels: boolean;
  visitStreak: number;
  loaded: boolean;
}

export function useJourney() {
  const [state, setState] = useState<JourneyState>({
    firstLyraCompleted: false,
    firstLyraPending: false,
    todayCheckInComplete: false,
    showTabLabels: false,
    visitStreak: 0,
    loaded: false,
  });

  const refresh = useCallback(async () => {
    const [firstLyraCompleted, firstLyraPending, todayCheckInComplete, showTabLabels, visitStreak] =
      await Promise.all([
        hasCompletedFirstLyraSession(),
        isFirstLyraPending(),
        isTodayCheckInComplete(),
        shouldShowTabLabels(),
        getVisitStreak(),
      ]);
    setState({
      firstLyraCompleted,
      firstLyraPending,
      todayCheckInComplete,
      showTabLabels,
      visitStreak,
      loaded: true,
    });
  }, []);

  const trackMissionVisit = useCallback(async () => {
    const visitStreak = await recordMissionVisit();
    setState((prev) => ({ ...prev, visitStreak, loaded: true }));
    return visitStreak;
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const completeFirstLyraSession = useCallback(async () => {
    await markFirstLyraSessionCompleted();
    await refresh();
  }, [refresh]);

  return { ...state, refresh, trackMissionVisit, completeFirstLyraSession };
}

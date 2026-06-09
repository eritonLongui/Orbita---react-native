import { useCallback, useEffect, useState } from 'react';
import { MOCK_VISIT_STREAK } from '../constants/orbitAreas';
import { useMockData } from '../providers/MockDataProvider';
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
  const { enabled: mockDataEnabled } = useMockData();
  const [state, setState] = useState<JourneyState>({
    firstLyraCompleted: false,
    firstLyraPending: false,
    todayCheckInComplete: false,
    showTabLabels: false,
    visitStreak: 0,
    loaded: false,
  });

  const refresh = useCallback(async () => {
    if (mockDataEnabled) {
      setState({
        firstLyraCompleted: true,
        firstLyraPending: false,
        todayCheckInComplete: true,
        showTabLabels: false,
        visitStreak: MOCK_VISIT_STREAK,
        loaded: true,
      });
      return;
    }

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
  }, [mockDataEnabled]);

  const trackMissionVisit = useCallback(async () => {
    if (mockDataEnabled) {
      setState((prev) => ({ ...prev, visitStreak: MOCK_VISIT_STREAK, loaded: true }));
      return MOCK_VISIT_STREAK;
    }

    const visitStreak = await recordMissionVisit();
    setState((prev) => ({ ...prev, visitStreak, loaded: true }));
    return visitStreak;
  }, [mockDataEnabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const completeFirstLyraSession = useCallback(async () => {
    await markFirstLyraSessionCompleted();
    await refresh();
  }, [refresh]);

  return { ...state, refresh, trackMissionVisit, completeFirstLyraSession };
}

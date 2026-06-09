import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACHIEVEMENTS, AchievementId } from '../constants/achievements';
import { useJourney } from './useJourney';
import { useOrbitStatus } from './useOrbitStatus';

const STORAGE_KEY = 'orbita_achievements';

interface AchievementState {
  id: AchievementId;
  unlocked: boolean;
  unlockedAt?: string;
}

interface UseAchievementsReturn {
  achievements: AchievementState[];
  loading: boolean;
  unlockedCount: number;
  totalCount: number;
  refresh: () => Promise<void>;
}

export function useAchievements(): UseAchievementsReturn {
  const [achievements, setAchievements] = useState<AchievementState[]>([]);
  const [loading, setLoading] = useState(true);
  const { visitStreak, todayCheckInComplete } = useJourney();
  const { areas, hasData } = useOrbitStatus();

  const checkAndUpdate = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const existing: Record<string, string> = stored ? JSON.parse(stored) : {};

      const now = new Date().toISOString();
      const newState: AchievementState[] = ACHIEVEMENTS.map((def) => {
        if (existing[def.id]) {
          return { id: def.id, unlocked: true, unlockedAt: existing[def.id] };
        }

        let unlocked = false;

        switch (def.id) {
          case 'first_checkin':
            unlocked = todayCheckInComplete || visitStreak >= 1;
            break;
          case 'streak_3':
            unlocked = visitStreak >= 3;
            break;
          case 'streak_7':
            unlocked = visitStreak >= 7;
            break;
          case 'streak_14':
            unlocked = visitStreak >= 14;
            break;
          case 'streak_30':
            unlocked = visitStreak >= 30;
            break;
          case 'first_week':
            unlocked = visitStreak >= 7;
            break;
          case 'first_month':
            unlocked = visitStreak >= 30;
            break;
          case 'all_areas_balanced':
            if (hasData && areas.length === 5) {
              unlocked = areas.every((a) => a.status === 'balanced' || a.status === 'excellent');
            }
            break;
          case 'excellent_area':
            if (hasData) {
              unlocked = areas.some((a) => a.score >= 80);
            }
            break;
          case 'orbit_score_70':
            if (hasData && areas.length > 0) {
              const avg = areas.reduce((s, a) => s + a.score, 0) / areas.length;
              unlocked = avg >= 70;
            }
            break;
          case 'orbit_score_85':
            if (hasData && areas.length > 0) {
              const avg = areas.reduce((s, a) => s + a.score, 0) / areas.length;
              unlocked = avg >= 85;
            }
            break;
          default:
            break;
        }

        if (unlocked) {
          existing[def.id] = now;
        }

        return { id: def.id, unlocked, unlockedAt: unlocked ? now : undefined };
      });

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      setAchievements(newState);
    } catch {
      setAchievements(ACHIEVEMENTS.map((def) => ({ id: def.id, unlocked: false })));
    } finally {
      setLoading(false);
    }
  }, [visitStreak, todayCheckInComplete, areas, hasData]);

  useEffect(() => {
    void checkAndUpdate();
  }, [checkAndUpdate]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return {
    achievements,
    loading,
    unlockedCount,
    totalCount: ACHIEVEMENTS.length,
    refresh: checkAndUpdate,
  };
}

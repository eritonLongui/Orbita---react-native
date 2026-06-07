import { useEffect, useState } from 'react';
import { getMissionData, getOrbitDetails } from '../services/orbitData';
import { supabase } from '../lib/supabase';
import { useAuth } from '../providers/AuthProvider';
import { MissionHeroState, OrbitAreaDetail, OrbitAreaSummary } from '../types';
import {
  ORBIT_AREAS,
  averageToMissionHeroState,
  scoreToOrbitStatus,
} from '../constants/orbitAreas';

interface OrbitStatusState {
  loading: boolean;
  heroState: MissionHeroState;
  areas: OrbitAreaSummary[];
  details: OrbitAreaDetail[];
  insight: string;
  hasData: boolean;
}

export function useOrbitStatus(): OrbitStatusState {
  const { user } = useAuth();
  const [state, setState] = useState<OrbitStatusState>(() => {
    const mock = getMissionData();
    return {
      loading: true,
      heroState: mock.heroState,
      areas: mock.areas,
      details: getOrbitDetails(),
      insight: mock.insight,
      hasData: mock.hasData,
    };
  });

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function load() {
      const { data: insights } = await supabase
        .from('weekly_insights')
        .select('summary, pillar_scores')
        .eq('user_id', user!.uid)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      if (insights?.pillar_scores && typeof insights.pillar_scores === 'object') {
        const scores = insights.pillar_scores as Record<string, number>;
        const areas: OrbitAreaSummary[] = ORBIT_AREAS.map((area) => {
          const score = scores[area.type] ?? 50;
          return {
            type: area.type,
            label: area.label,
            score,
            status: scoreToOrbitStatus(score),
          };
        });
        const avg = areas.reduce((s, a) => s + a.score, 0) / areas.length;
        setState({
          loading: false,
          heroState: averageToMissionHeroState(avg),
          areas,
          details: getOrbitDetails(),
          insight: insights.summary ?? getMissionData().insight,
          hasData: true,
        });
        return;
      }

      const mock = getMissionData();
      setState({
        loading: false,
        heroState: mock.heroState,
        areas: mock.areas,
        details: getOrbitDetails(),
        insight: mock.insight,
        hasData: false,
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return state;
}

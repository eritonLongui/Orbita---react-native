import { useEffect, useState } from 'react';
import { getMissionData, getOrbitDetails } from '../services/orbitData';
import { supabase } from '../lib/supabase';
import { useAuth } from '../providers/AuthProvider';
import { useMockData } from '../providers/MockDataProvider';
import { MissionHeroState, OrbitAreaDetail, OrbitAreaSummary, PillarType } from '../types';
import {
  MOCK_AREA_RECOMMENDATIONS,
  MOCK_HISTORICAL_INSIGHTS,
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
  areaRecommendations: Partial<Record<PillarType, string>>;
  historicalInsights: string[];
  hasData: boolean;
}

const EMPTY_STATE: OrbitStatusState = {
  loading: true,
  heroState: 'attention',
  areas: [],
  details: [],
  insight: '',
  areaRecommendations: {},
  historicalInsights: [],
  hasData: false,
};

function buildMockState(): OrbitStatusState {
  const mock = getMissionData(true);
  return {
    loading: false,
    heroState: mock.heroState,
    areas: mock.areas,
    details: getOrbitDetails(),
    insight: mock.insight,
    areaRecommendations: MOCK_AREA_RECOMMENDATIONS,
    historicalInsights: MOCK_HISTORICAL_INSIGHTS,
    hasData: true,
  };
}

export function useOrbitStatus(): OrbitStatusState {
  const { user } = useAuth();
  const { enabled: mockDataEnabled, ready: mockDataReady } = useMockData();
  const [state, setState] = useState<OrbitStatusState>(EMPTY_STATE);

  useEffect(() => {
    if (!user || !mockDataReady) return;

    let cancelled = false;

    async function load() {
      if (mockDataEnabled) {
        if (!cancelled) setState(buildMockState());
        return;
      }

      const [insightsResult, pillarResult, historicalResult] = await Promise.all([
        supabase
          .from('weekly_insights')
          .select('summary, pillar_scores, area_recommendations')
          .eq('user_id', user!.uid)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('pillar_records')
          .select('pillar, value, date')
          .eq('user_id', user!.uid)
          .order('date', { ascending: true }),
        supabase
          .from('weekly_insights')
          .select('summary')
          .eq('user_id', user!.uid)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      if (cancelled) return;

      const insights = insightsResult.data;
      const pillarRecords = pillarResult.data ?? [];
      const historicalRows = historicalResult.data ?? [];

      if (!insights?.pillar_scores || typeof insights.pillar_scores !== 'object') {
        setState({
          loading: false,
          heroState: 'attention',
          areas: [],
          details: [],
          insight: '',
          areaRecommendations: {},
          historicalInsights: [],
          hasData: false,
        });
        return;
      }

      const scores = insights.pillar_scores as Record<string, number>;
      const areaRecs = (insights.area_recommendations ?? {}) as Record<string, string>;

      const fallbackRecs: Record<string, string> = {
        sleep: 'Mantenha horários regulares de sono para melhorar a recuperação.',
        movement: 'Incorpore movimento leve ao longo do dia para manter a energia.',
        routine: 'Crie rituais de início e fim do dia para mais consistência.',
        nutrition: 'Hidrate-se e faça refeições em horários regulares.',
        leisure: 'Reserve tempo para atividades que recarregam sua energia mental.',
      };

      const effectiveRecs: Record<string, string> = {};
      for (const area of ORBIT_AREAS) {
        effectiveRecs[area.type] = areaRecs[area.type] || fallbackRecs[area.type] || '';
      }

      const historicalInsights = historicalRows
        .map((r) => r.summary)
        .filter((s): s is string => Boolean(s && s.trim()));

      const effectiveInsights = historicalInsights.length > 0
        ? historicalInsights
        : insights.summary ? [insights.summary] : [];

      const historyByArea: Record<string, number[]> = {};
      for (const record of pillarRecords) {
        if (!historyByArea[record.pillar]) historyByArea[record.pillar] = [];
        historyByArea[record.pillar].push(record.value);
      }

      const areas: OrbitAreaSummary[] = ORBIT_AREAS.map((area) => {
        const score = scores[area.type] ?? 50;
        return {
          type: area.type,
          label: area.label,
          score,
          status: scoreToOrbitStatus(score),
        };
      });

      const details: OrbitAreaDetail[] = ORBIT_AREAS.map((area) => {
        const score = scores[area.type] ?? 50;
        const history = historyByArea[area.type] ?? [score];
        return {
          type: area.type,
          label: area.label,
          score,
          status: scoreToOrbitStatus(score),
          description: area.description,
          summary: '',
          recommendation: effectiveRecs[area.type] ?? '',
          history,
        };
      });

      const avg = areas.reduce((s, a) => s + a.score, 0) / areas.length;

      setState({
        loading: false,
        heroState: averageToMissionHeroState(avg),
        areas,
        details,
        insight: insights.summary ?? '',
        areaRecommendations: effectiveRecs as Partial<Record<PillarType, string>>,
        historicalInsights: effectiveInsights,
        hasData: true,
      });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user, mockDataEnabled, mockDataReady]);

  return state;
}

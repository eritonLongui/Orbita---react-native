import {
  MOCK_INSIGHT,
  MOCK_ORBIT_AREAS,
  MOCK_ORBIT_DETAILS,
  averageToMissionHeroState,
} from '../constants/orbitAreas';
import { Milestone, MissionHeroState, OrbitAreaDetail, OrbitAreaSummary } from '../types';

export interface MissionData {
  heroState: MissionHeroState;
  areas: OrbitAreaSummary[];
  insight: string;
  hasData: boolean;
}

export function getMissionData(hasRealData = false): MissionData {
  const areas = MOCK_ORBIT_AREAS;
  const avg = areas.reduce((sum, a) => sum + a.score, 0) / areas.length;

  return {
    heroState: averageToMissionHeroState(avg),
    areas,
    insight: MOCK_INSIGHT,
    hasData: hasRealData || true,
  };
}

export function getOrbitDetails(): OrbitAreaDetail[] {
  return MOCK_ORBIT_DETAILS;
}

export function getEvolutionSeries(period: '7d' | '30d' | '90d' | '12m') {
  const lengths = { '7d': 7, '30d': 30, '90d': 12, '12m': 12 };
  const count = lengths[period];
  const labels =
    period === '7d'
      ? ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
      : period === '30d'
        ? Array.from({ length: count }, (_, i) => `${i + 1}`)
        : ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].slice(
            0,
            count
          );

  const base = 55;
  return labels.map((label, i) => ({
    value: Math.min(100, base + i * 3 + (i % 2) * 5),
    label,
  }));
}

export function getEvolutionHeroPercent(period: '7d' | '30d' | '90d' | '12m'): number {
  const map = { '7d': 5, '30d': 12, '90d': 18, '12m': 24 };
  return map[period];
}

export function getMilestones(): Milestone[] {
  return [
    { id: '1', title: '7 dias seguidos de rotina consistente', date: 'Há 3 dias' },
    { id: '2', title: 'Melhora significativa no descanso', date: 'Há 1 semana' },
    { id: '3', title: 'Recuperação de energia', date: 'Há 2 semanas' },
  ];
}

export function getHistoricalInsights(): string[] {
  return [
    'Você manteve boa consistência na rotina durante esta semana.',
    'Seu padrão de descanso melhorou após check-ins com a Lyra.',
    'A energia correlacionou com dias de mais movimento.',
  ];
}

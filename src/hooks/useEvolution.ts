import { useMemo, useState } from 'react';
import {
  getEvolutionHeroPercent,
  getEvolutionSeries,
  getHistoricalInsights,
  getMilestones,
} from '../services/orbitData';
import { MOCK_ORBIT_AREAS } from '../constants/orbitAreas';
import { EvolutionPeriod, Milestone } from '../types';

export function useEvolution(initialPeriod: EvolutionPeriod = '30d') {
  const [period, setPeriod] = useState<EvolutionPeriod>(initialPeriod);

  const chartData = useMemo(() => getEvolutionSeries(period), [period]);
  const heroPercent = useMemo(() => getEvolutionHeroPercent(period), [period]);
  const milestones: Milestone[] = useMemo(() => getMilestones(), []);
  const insights = useMemo(() => getHistoricalInsights(), []);
  const areaScores = MOCK_ORBIT_AREAS;

  return {
    period,
    setPeriod,
    chartData,
    heroPercent,
    milestones,
    insights,
    areaScores,
  };
}

import {
  MOCK_INSIGHT,
  MOCK_ORBIT_AREAS,
  MOCK_ORBIT_DETAILS,
  averageToMissionHeroState,
} from '../constants/orbitAreas';
import { MissionHeroState, OrbitAreaDetail, OrbitAreaSummary } from '../types';

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
    hasData: hasRealData,
  };
}

export function getOrbitDetails(): OrbitAreaDetail[] {
  return MOCK_ORBIT_DETAILS;
}

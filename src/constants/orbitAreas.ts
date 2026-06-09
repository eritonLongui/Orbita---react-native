import {
  MissionHeroState,
  OrbitAreaDetail,
  OrbitAreaStatus,
  OrbitAreaSummary,
  PillarType,
} from '../types';

export const ORBIT_AREAS: { type: PillarType; label: string; description: string }[] = [
  { type: 'sleep', label: 'Descanso', description: 'Sono, regularidade e recuperação.' },
  { type: 'movement', label: 'Energia', description: 'Atividade física e vitalidade.' },
  { type: 'routine', label: 'Ritmo', description: 'Rotina, consistência e pausas.' },
  { type: 'nutrition', label: 'Nutrição', description: 'Alimentação e hidratação.' },
  { type: 'leisure', label: 'Bem-estar', description: 'Lazer, descanso mental e hobby.' },
];

export const ORBIT_STATUS_LABELS: Record<OrbitAreaStatus, string> = {
  excellent: 'Excelente',
  balanced: 'Em equilíbrio',
  oscillating: 'Oscilando',
  attention: 'Atenção',
};

export const MISSION_HERO_COPY: Record<
  MissionHeroState,
  { title: string; description: string }
> = {
  excellent: {
    title: 'Sua órbita está excelente',
    description: 'Você manteve ótima consistência. Continue cultivando esse ritmo hoje.',
  },
  stable: {
    title: 'Sua órbita está estável',
    description:
      'Você manteve uma boa consistência nos últimos dias. Hoje vale atenção ao seu descanso.',
  },
  attention: {
    title: 'Sua órbita pede atenção',
    description: 'Algumas áreas oscilaram recentemente. Um check-in com a Lyra pode ajudar.',
  },
  critical: {
    title: 'Sua órbita precisa de cuidado',
    description: 'Vários sinais pedem atenção hoje. Priorize descanso e converse com a Lyra.',
  },
};

export function scoreToOrbitStatus(score: number): OrbitAreaStatus {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'balanced';
  if (score >= 45) return 'oscillating';
  return 'attention';
}

export function orbitStatusColor(status: OrbitAreaStatus): string {
  switch (status) {
    case 'excellent':
      return '#34D399';
    case 'balanced':
      return '#4B8BFF';
    case 'oscillating':
      return '#6BA3FF';
    case 'attention':
      return '#F87171';
  }
}

export function averageToMissionHeroState(avg: number): MissionHeroState {
  if (avg >= 80) return 'excellent';
  if (avg >= 65) return 'stable';
  if (avg >= 45) return 'attention';
  return 'critical';
}

export const MOCK_ORBIT_AREAS: OrbitAreaSummary[] = [
  { type: 'sleep', label: 'Descanso', score: 78, status: 'balanced' },
  { type: 'movement', label: 'Energia', score: 62, status: 'oscillating' },
  { type: 'routine', label: 'Ritmo', score: 71, status: 'balanced' },
  { type: 'nutrition', label: 'Nutrição', score: 55, status: 'oscillating' },
  { type: 'leisure', label: 'Bem-estar', score: 48, status: 'attention' },
];

export const MOCK_MISSION_DAY = 7;
export const MOCK_VISIT_STREAK = 7;

export const MOCK_AREA_RECOMMENDATIONS: Record<PillarType, string> = {
  sleep: 'Deite 30 min mais cedo e evite telas após 22h.',
  movement: 'Uma caminhada de 20 min após o almoço pode destravar sua energia.',
  routine: 'Blindar 15 min pela manhã para planejar o dia mantém seu ritmo.',
  nutrition: 'Inclua proteína no café da manhã e beba água antes do meio-dia.',
  leisure: 'Reserve 30 min hoje para algo que você gosta, sem telas.',
};

const MOCK_AREA_HISTORY: Record<PillarType, number[]> = {
  sleep: [65, 68, 70, 72, 74, 76, 78],
  movement: [55, 58, 60, 58, 60, 61, 62],
  routine: [62, 65, 67, 68, 69, 70, 71],
  nutrition: [48, 50, 52, 50, 52, 54, 55],
  leisure: [40, 42, 44, 45, 46, 47, 48],
};

export const MOCK_ORBIT_DETAILS: OrbitAreaDetail[] = ORBIT_AREAS.map((area) => {
  const mock = MOCK_ORBIT_AREAS.find((a) => a.type === area.type)!;
  const recommendation = MOCK_AREA_RECOMMENDATIONS[area.type];
  return {
    ...mock,
    description: area.description,
    summary: '',
    recommendation,
    history: MOCK_AREA_HISTORY[area.type],
  };
});

export const MOCK_INSIGHT =
  'Seu descanso oscilou nos últimos dias — horários mais tardes podem estar pesando na energia. Tente deitar 30 min antes hoje e manter o despertar no mesmo horário.';

export const MOCK_HISTORICAL_INSIGHTS = [
  MOCK_INSIGHT,
  'Você manteve boa consistência na rotina durante esta semana.',
  'Seu padrão de descanso melhorou após os últimos check-ins com a Lyra.',
  'Sua energia correlacionou com os dias em que você se moveu mais.',
];

/** @deprecated Use MOCK_MISSION_DAY */
export const MOCK_MISSION_NUMBER = MOCK_MISSION_DAY;

/** @deprecated Use ORBIT_AREAS */
export const PILLARS = ORBIT_AREAS;

/** @deprecated Use MOCK_ORBIT_AREAS */
export const MOCK_PILLAR_SCORES = MOCK_ORBIT_AREAS;

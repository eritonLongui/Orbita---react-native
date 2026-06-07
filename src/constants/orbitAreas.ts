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

export const MOCK_ORBIT_DETAILS: OrbitAreaDetail[] = ORBIT_AREAS.map((area) => {
  const mock = MOCK_ORBIT_AREAS.find((a) => a.type === area.type)!;
  return {
    ...mock,
    description: area.description,
    summary: 'Você manteve regularidade na maior parte da semana.',
    recommendation: 'Tente dormir 30 minutos mais cedo hoje.',
    history: [52, 58, 61, 65, 68, 72, mock.score],
  };
});

export const MOCK_INSIGHT =
  'Seu padrão de descanso caiu nos últimos 3 dias.';

export const MOCK_MISSION_NUMBER = 184;

/** @deprecated Use ORBIT_AREAS */
export const PILLARS = ORBIT_AREAS;

/** @deprecated Use MOCK_ORBIT_AREAS */
export const MOCK_PILLAR_SCORES = MOCK_ORBIT_AREAS;

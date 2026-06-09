export type AchievementId =
  | 'first_checkin'
  | 'streak_3'
  | 'streak_7'
  | 'streak_14'
  | 'streak_30'
  | 'all_areas_balanced'
  | 'excellent_area'
  | 'all_tasks_done'
  | 'tasks_10'
  | 'tasks_50'
  | 'lyra_chat_5'
  | 'night_owl_fixed'
  | 'energy_boost'
  | 'nutrition_master'
  | 'wellness_warrior'
  | 'orbit_score_70'
  | 'orbit_score_85'
  | 'first_week'
  | 'first_month'
  | 'comeback';

export interface AchievementDef {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'score' | 'task' | 'social' | 'milestone';
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_checkin',
    title: 'Primeiro passo',
    description: 'Completar seu primeiro check-in',
    icon: 'RocketLaunch',
    category: 'milestone',
  },
  {
    id: 'streak_3',
    title: 'Ritmo inicial',
    description: '3 dias seguidos de check-in',
    icon: 'Fire',
    category: 'streak',
  },
  {
    id: 'streak_7',
    title: 'Semana completa',
    description: '7 dias seguidos de check-in',
    icon: 'Star',
    category: 'streak',
  },
  {
    id: 'streak_14',
    title: 'Consistente',
    description: '14 dias seguidos de check-in',
    icon: 'Medal',
    category: 'streak',
  },
  {
    id: 'streak_30',
    title: 'Orbitando',
    description: '30 dias seguidos de check-in',
    icon: 'Planet',
    category: 'streak',
  },
  {
    id: 'all_areas_balanced',
    title: 'Equilíbrio total',
    description: 'Todas as 5 áreas em equilíbrio ou melhor',
    icon: 'Scales',
    category: 'score',
  },
  {
    id: 'excellent_area',
    title: 'Área excelente',
    description: 'Uma área com score 80+',
    icon: 'Lightning',
    category: 'score',
  },
  {
    id: 'all_tasks_done',
    title: 'Missão cumprida',
    description: 'Completar todas as tarefas de um dia',
    icon: 'CheckCircle',
    category: 'task',
  },
  {
    id: 'tasks_10',
    title: 'Executor',
    description: '10 tarefas concluídas no total',
    icon: 'ListChecks',
    category: 'task',
  },
  {
    id: 'tasks_50',
    title: 'Produtivo',
    description: '50 tarefas concluídas no total',
    icon: 'Trophy',
    category: 'task',
  },
  {
    id: 'lyra_chat_5',
    title: 'Amigo da Lyra',
    description: '5 conversas com a Lyra',
    icon: 'ChatCircle',
    category: 'social',
  },
  {
    id: 'night_owl_fixed',
    title: 'Dorminhoco reformado',
    description: 'Score de sono subiu 20pts em 7 dias',
    icon: 'Moon',
    category: 'score',
  },
  {
    id: 'energy_boost',
    title: 'Energia renovada',
    description: 'Score de energia 80+ por 3 dias',
    icon: 'Lightning',
    category: 'score',
  },
  {
    id: 'nutrition_master',
    title: 'Nutrição em dia',
    description: 'Score de nutrição 80+ por 5 dias',
    icon: 'Drop',
    category: 'score',
  },
  {
    id: 'wellness_warrior',
    title: 'Guerreiro do bem-estar',
    description: 'Score de bem-estar 80+ por 3 dias',
    icon: 'Heart',
    category: 'score',
  },
  {
    id: 'orbit_score_70',
    title: 'Órbita estável',
    description: 'Média geral acima de 70',
    icon: 'Planet',
    category: 'score',
  },
  {
    id: 'orbit_score_85',
    title: 'Órbita excelente',
    description: 'Média geral acima de 85',
    icon: 'Sparkle',
    category: 'score',
  },
  {
    id: 'first_week',
    title: 'Veterano',
    description: '7 dias usando o app',
    icon: 'Calendar',
    category: 'milestone',
  },
  {
    id: 'first_month',
    title: 'Explorador',
    description: '30 dias usando o app',
    icon: 'Compass',
    category: 'milestone',
  },
  {
    id: 'comeback',
    title: 'De volta',
    description: 'Retornar após 3+ dias sem check-in',
    icon: 'ArrowCounterClockwise',
    category: 'milestone',
  },
];

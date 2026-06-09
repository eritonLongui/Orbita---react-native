import { MissionHeroState } from '../types';
import { MISSION_HERO_COPY } from './orbitAreas';
import { JourneyUserState } from '../services/journey';

export const CHECK_IN_PENDING_COPY = {
  title: 'Hora do check-in',
  description:
    'Registre como foi seu dia e receba ações personalizadas da Lyra para evoluir sua órbita.',
};

const NEW_USER_COPY = {
  title: 'Sua missão começa hoje',
  description: 'Converse com a Lyra para mapear sua órbita e receber os primeiros insights.',
};

const ACTIVATED_COPY = {
  title: 'Primeiros sinais na órbita',
  description:
    'Seu check-in já ajudou a traçar o mapa. Volte amanhã ou explore a Órbita agora.',
};

export function getMissionHeroCopy(
  journeyState: JourneyUserState,
  heroState: MissionHeroState,
): { title: string; description: string } {
  if (journeyState === 'returning') return MISSION_HERO_COPY[heroState];
  if (journeyState === 'activated') return ACTIVATED_COPY;
  return NEW_USER_COPY;
}

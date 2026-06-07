import React from 'react';
import { Text } from 'tamagui';
import { MISSION_HERO_COPY } from '../../constants/orbitAreas';
import { MissionHeroState } from '../../types';
import { OrbitaCard } from '../ui/OrbitaCard';

interface HeroMissionCardProps {
  state: MissionHeroState;
  title?: string;
  description?: string;
}

export function HeroMissionCard({ state, title, description }: HeroMissionCardProps) {
  const copy = MISSION_HERO_COPY[state];

  return (
    <OrbitaCard highlighted>
      <Text fontSize={14} color="$textMuted">
        Status da missão
      </Text>
      <Text fontSize={22} fontWeight="800" color="$text">
        {title ?? copy.title}
      </Text>
      <Text fontSize={14} color="$textMuted" lineHeight={20}>
        {description ?? copy.description}
      </Text>
    </OrbitaCard>
  );
}

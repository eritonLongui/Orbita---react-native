import {
  Clock,
  Drop,
  GameController,
  Moon,
  PersonSimpleRun,
} from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, YStack } from 'tamagui';
import { orbitStatusColor } from '../../constants/orbitAreas';
import { themeColors } from '../../constants/theme';
import { OrbitAreaSummary, PillarType } from '../../types';
import { TwoColumnGrid } from '../ui/TwoColumnGrid';

const AREA_ICONS: Record<PillarType, React.ComponentType<{ size: number; color: string }>> = {
  sleep: Moon,
  movement: PersonSimpleRun,
  routine: Clock,
  nutrition: Drop,
  leisure: GameController,
};

interface EvolutionAreaGridProps {
  areas: OrbitAreaSummary[];
}

function EvolutionAreaCard({ area }: { area: OrbitAreaSummary }) {
  const Icon = AREA_ICONS[area.type];
  const color = orbitStatusColor(area.status);

  return (
    <View style={styles.card}>
      <YStack items="center" gap="$2" py="$3" px="$2">
        <Icon size={24} color={themeColors.primary} />
        <Text fontSize={12} fontWeight="600" color="$textMuted">
          {area.label}
        </Text>
        <Text fontSize={22} fontWeight="800" style={{ color }}>
          {area.score}
        </Text>
        <View style={styles.progressBg}>
          <View
            style={[styles.progressFill, { width: `${area.score}%`, backgroundColor: color }]}
          />
        </View>
      </YStack>
    </View>
  );
}

export function EvolutionAreaGrid({ areas }: EvolutionAreaGridProps) {
  if (!areas.length) return null;

  return (
    <YStack gap="$3" width="100%">
      <Text
        fontSize={13}
        fontWeight="800"
        letterSpacing={1.2}
        style={{ color: themeColors.textMuted }}
      >
        EVOLUÇÃO POR ÁREA
      </Text>
      <Text fontSize={14} color="$textMuted" lineHeight={20}>
        Como cada área evoluiu ao longo dos seus check-ins
      </Text>
      <TwoColumnGrid
        items={areas}
        keyExtractor={(area) => area.type}
        renderItem={(area) => <EvolutionAreaCard area={area} />}
      />
    </YStack>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: themeColors.surface,
    borderWidth: 1,
    borderColor: themeColors.glassBorder,
  },
  progressBg: {
    width: '80%',
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
});

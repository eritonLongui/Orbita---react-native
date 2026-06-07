import { BlurView } from 'expo-blur';
import { Clock, Drop, GameController, Moon, PersonSimpleRun } from 'phosphor-react-native';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { ORBIT_STATUS_LABELS, orbitStatusColor } from '../../constants/orbitAreas';
import { themeColors } from '../../constants/theme';
import { OrbitAreaStatus, PillarType } from '../../types';

const ICONS = {
  sleep: Moon,
  movement: PersonSimpleRun,
  routine: Clock,
  nutrition: Drop,
  leisure: GameController,
} as const;

interface OrbitStatusCardProps {
  type: PillarType;
  label: string;
  score: number;
  status: OrbitAreaStatus;
  compact?: boolean;
}

export function OrbitStatusCard({ type, label, score, status, compact }: OrbitStatusCardProps) {
  const Icon = ICONS[type];
  const statusColor = orbitStatusColor(status);

  return (
    <View style={[styles.card, compact && styles.compact]}>
      {Platform.OS !== 'web' ? (
        <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
      ) : null}
      <View style={styles.overlay} />
      <YStack p="$3" gap="$2">
        <XStack items="center" justify="space-between">
          <Icon size={18} color={themeColors.primary} />
          <Text fontSize={12} fontWeight="700" style={{ color: statusColor }}>
            {score}%
          </Text>
        </XStack>
        <Text fontSize={13} fontWeight="600" color="$text">
          {label}
        </Text>
        <Text fontSize={11} fontWeight="600" style={{ color: statusColor }}>
          {ORBIT_STATUS_LABELS[status]}
        </Text>
      </YStack>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: themeColors.glassBorder,
  },
  compact: {
    flex: undefined,
    minWidth: undefined,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: themeColors.glass,
  },
});

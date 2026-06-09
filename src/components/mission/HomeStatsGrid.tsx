import {
  CheckCircle,
  Clock,
  Drop,
  GameController,
  IconProps,
  Moon,
  PersonSimpleRun,
  Planet,
  TrendDown,
  TrendUp,
} from 'phosphor-react-native';
import React from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';
import { OrbitAreaSummary, PillarType } from '../../types';
import {
  areaStatusPhrase,
  orbitScoreToHeadline,
  orbitStatusDescription,
  weeklyTrendDetail,
  weeklyTrendLabel,
} from '../../utils/orbitLabels';
import { GlassCard } from '../ui/GlassCard';

interface HomeStatsGridProps {
  areas: OrbitAreaSummary[];
  missionDay: number;
  weeklyDelta?: number;
}

const AREA_ICONS = {
  sleep: Moon,
  movement: PersonSimpleRun,
  routine: Clock,
  nutrition: Drop,
  leisure: GameController,
} as const;

function ProgressBar({ value, color = themeColors.primary }: { value: number; color?: string }) {
  return (
    <YStack height={6} bg="rgba(255,255,255,0.1)" rounded={999} overflow="hidden">
      <YStack height="100%" width={`${value}%`} style={{ backgroundColor: color }} rounded={999} />
    </YStack>
  );
}

function AreaDots({ total, filled }: { total: number; filled: number }) {
  return (
    <XStack gap="$2">
      {Array.from({ length: total }).map((_, i) => (
        <YStack
          key={i}
          width={8}
          height={8}
          rounded={999}
          bg={i < filled ? '$primary' : 'rgba(255,255,255,0.15)'}
        />
      ))}
    </XStack>
  );
}

function StatHeadline({
  icon: Icon,
  headline,
  iconColor = themeColors.primarySoft,
}: {
  icon: React.ComponentType<IconProps>;
  headline: string;
  iconColor?: string;
}) {
  return (
    <XStack items="center" gap="$3">
      <Icon size={24} color={iconColor} />
      <Text flex={1} fontSize={18} fontWeight="800" color="$text" lineHeight={24}>
        {headline}
      </Text>
    </XStack>
  );
}

function StatBlock({
  label,
  headlineIcon,
  headline,
  headlineIconColor,
  detail,
  visual,
}: {
  label: string;
  headlineIcon: React.ComponentType<IconProps>;
  headline: string;
  headlineIconColor?: string;
  detail?: string;
  visual?: React.ReactNode;
}) {
  return (
    <GlassCard padding>
      <YStack gap="$4">
        <Text
          fontSize={14}
          fontWeight="600"
          letterSpacing={0.5}
          textTransform="uppercase"
          style={{ color: themeColors.textMuted }}
        >
          {label}
        </Text>
        <StatHeadline icon={headlineIcon} headline={headline} iconColor={headlineIconColor} />
        {visual ? <YStack pt="$1">{visual}</YStack> : null}
        {detail ? (
          <Text fontSize={16} lineHeight={22} style={{ color: 'rgba(255, 255, 255, 0.82)' }}>
            {detail}
          </Text>
        ) : null}
      </YStack>
    </GlassCard>
  );
}

const MIN_DAYS_FOR_WEEKLY_TREND = 7;

export function HomeStatsGrid({ areas, missionDay, weeklyDelta = 12 }: HomeStatsGridProps) {
  const orbitAvg = Math.round(areas.reduce((sum, a) => sum + a.score, 0) / areas.length);
  const balancedCount = areas.filter(
    (a) => a.status === 'balanced' || a.status === 'excellent',
  ).length;
  const focusArea = [...areas].sort((a, b) => a.score - b.score)[0];
  const showWeeklyTrend = missionDay >= MIN_DAYS_FOR_WEEKLY_TREND;
  const trendUp = weeklyDelta >= 0;
  const FocusIcon = AREA_ICONS[focusArea.type as PillarType];
  const TrendIcon = trendUp ? TrendUp : TrendDown;

  return (
    <YStack gap="$3">
      <StatBlock
          headlineIcon={Planet}
          label="Como está sua órbita"
          headline={orbitScoreToHeadline(orbitAvg)}
          detail="Média geral das 5 áreas"
          visual={<ProgressBar value={orbitAvg} />}
        />
        <StatBlock
          headlineIcon={CheckCircle}
          label="Áreas estáveis"
          headline={`${balancedCount} em dia`}
          detail={`de ${areas.length} áreas acompanhadas`}
          visual={<AreaDots total={areas.length} filled={balancedCount} />}
        />
        {showWeeklyTrend ? (
          <StatBlock
            headlineIcon={TrendIcon}
            label="Tendência semanal"
            headline={weeklyTrendLabel(weeklyDelta)}
            headlineIconColor={trendUp ? themeColors.primarySoft : themeColors.warning}
            detail={weeklyTrendDetail(weeklyDelta)}
          />
        ) : null}
        <StatBlock
          headlineIcon={FocusIcon}
          label="Foco de hoje"
          headline={areaStatusPhrase(focusArea.label, focusArea.status)}
          visual={
            <ProgressBar
              value={focusArea.score}
              color={
                focusArea.status === 'attention'
                  ? themeColors.danger
                  : focusArea.status === 'oscillating'
                    ? themeColors.warning
                    : themeColors.primary
              }
            />
          }
          detail={orbitStatusDescription(focusArea.status)}
        />
    </YStack>
  );
}

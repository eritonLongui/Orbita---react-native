import React from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { EvolutionChart, InsightCard, MilestoneTimeline } from '../../components/orbit';
import { GlassChip } from '../../components/ui/GlassChip';
import { OrbitaCard } from '../../components/ui/OrbitaCard';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useEvolution } from '../../hooks/useEvolution';
import { EvolutionPeriod } from '../../types';

const PERIODS: { key: EvolutionPeriod; label: string }[] = [
  { key: '7d', label: '7 dias' },
  { key: '30d', label: '30 dias' },
  { key: '90d', label: '90 dias' },
  { key: '12m', label: '12 meses' },
];

export function EvolutionScreen() {
  const { period, setPeriod, chartData, heroPercent, milestones, insights, areaScores } =
    useEvolution('30d');

  return (
    <ScreenWrapper tabBarOffset>
      <YStack gap="$5">
        <YStack gap="$2">
          <Text fontSize={28} fontWeight="800" color="$text">
            Evolução
          </Text>
          <Text fontSize={15} color="$textMuted" lineHeight={22}>
            Progresso da sua órbita ao longo do tempo.
          </Text>
        </YStack>

        <OrbitaCard highlighted>
          <Text fontSize={14} color="$textMuted">
            Hero
          </Text>
          <Text fontSize={22} fontWeight="800" color="$text">
            Sua órbita evoluiu {heroPercent}% nos últimos{' '}
            {PERIODS.find((p) => p.key === period)?.label ?? '30 dias'}.
          </Text>
        </OrbitaCard>

        <XStack gap="$2" flexWrap="wrap">
          {PERIODS.map((p) => (
            <GlassChip
              key={p.key}
              label={p.label}
              selected={period === p.key}
              onPress={() => setPeriod(p.key)}
            />
          ))}
        </XStack>

        <OrbitaCard>
          <EvolutionChart data={chartData} title="Evolução geral" />
        </OrbitaCard>

        <YStack gap="$3">
          <Text fontSize={16} fontWeight="700" color="$text">
            Evolução por área
          </Text>
          {areaScores.map((area) => (
            <OrbitaCard key={area.type}>
              <XStack items="center" gap="$3">
              <YStack flex={1} gap="$2">
                <XStack justify="space-between">
                  <Text fontSize={14} fontWeight="600" color="$text">
                    {area.label}
                  </Text>
                  <Text fontSize={14} fontWeight="700" color="$primary">
                    {area.score}%
                  </Text>
                </XStack>
                <YStack height={8} bg="$surfaceMuted" rounded={999} overflow="hidden">
                  <YStack
                    height="100%"
                    width={`${area.score}%`}
                    bg="$primary"
                    rounded={999}
                  />
                </YStack>
              </YStack>
              </XStack>
            </OrbitaCard>
          ))}
        </YStack>

        <YStack gap="$3">
          <Text fontSize={16} fontWeight="700" color="$text">
            Marcos
          </Text>
          <MilestoneTimeline milestones={milestones} />
        </YStack>

        <YStack gap="$3">
          <Text fontSize={16} fontWeight="700" color="$text">
            Insights históricos
          </Text>
          {insights.map((insight, i) => (
            <InsightCard key={i} insight={insight} title="Lyra" />
          ))}
        </YStack>
      </YStack>
    </ScreenWrapper>
  );
}

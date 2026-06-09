import React, { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { Spinner, Text, XStack, YStack } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendUp } from 'phosphor-react-native';
import {
  EvolutionChart,
  LyraEmptyStateCard,
  OrbitAreaDetailCard,
  OrbitRadar,
} from '../../components/orbit';
import { InsightsCarousel } from '../../components/orbit/InsightsCarousel';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { GlassChip } from '../../components/ui/GlassChip';
import { GradientText } from '../../components/ui/GradientText';
import { InfoTooltip } from '../../components/ui/InfoTooltip';
import { OrbitaCard } from '../../components/ui/OrbitaCard';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { themeColors } from '../../constants/theme';
import { useOrbitStatus } from '../../hooks/useOrbitStatus';
import { MainTabParamList } from '../../navigation/types';
import { EvolutionPeriod } from '../../types';

const OVERVIEW_TOOLTIP =
  'Equilíbrio entre as cinco áreas — quanto maior a forma, mais estável está sua órbita.';

const PERIODS: { key: EvolutionPeriod; label: string }[] = [
  { key: '7d', label: '7 dias' },
  { key: '30d', label: '30 dias' },
  { key: '90d', label: '90 dias' },
];

export function OrbitScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { areas, details, hasData, loading, insight, historicalInsights } = useOrbitStatus();
  const [period, setPeriod] = useState<EvolutionPeriod>('30d');

  const avgScore = useMemo(
    () =>
      areas.length ? Math.round(areas.reduce((sum, area) => sum + area.score, 0) / areas.length) : 0,
    [areas],
  );

  const evolutionChartData = useMemo(() => {
    if (!details.length) return [];
    const maxLen = Math.max(...details.map((d) => d.history.length));
    const combined: { value: number; label?: string }[] = [];
    for (let i = 0; i < maxLen; i++) {
      let sum = 0;
      let count = 0;
      for (const d of details) {
        if (i < d.history.length) {
          sum += d.history[i];
          count++;
        }
      }
      combined.push({ value: count ? Math.round(sum / count) : 0, label: `D${i + 1}` });
    }
    return combined;
  }, [details]);

  const evolutionPercent = useMemo(() => {
    if (evolutionChartData.length < 2) return 0;
    const first = evolutionChartData[0].value;
    const last = evolutionChartData[evolutionChartData.length - 1].value;
    if (first === 0) return 0;
    return Math.round(((last - first) / first) * 100);
  }, [evolutionChartData]);

  return (
    <ScreenWrapper tabBarOffset>
      <YStack gap="$5" pb="$14" pt="$4" width="100%">
        <Text fontSize={28} fontWeight="800" color="$text">
          Minha Órbita
        </Text>

        {loading ? (
          <YStack py="$10" items="center">
            <Spinner size="large" color="$primary" />
          </YStack>
        ) : !hasData ? (
          <LyraEmptyStateCard
            title="Sua órbita ainda está se formando"
            description="Converse com a Lyra para mapear descanso, energia, ritmo, nutrição e bem-estar. Os dados aparecem aqui depois do check-in."
            onPress={() => navigation.navigate('Lyra')}
          />
        ) : (
          <>
            {/* Radar + Score */}
            <OrbitaCard>
              <YStack gap="$4" items="center">
                <View style={styles.overviewHeader}>
                  <View style={styles.tooltipSlot}>
                    <InfoTooltip text={OVERVIEW_TOOLTIP} align="right" />
                  </View>

                  <YStack items="center" gap="$2" width="100%">
                    <Text
                      fontSize={13}
                      fontWeight="800"
                      letterSpacing={1.2}
                      color="$text"
                      text="center"
                    >
                      VISÃO GERAL
                    </Text>
                    <YStack items="center" gap="$0.5">
                      <GradientText fontSize={36} lineHeight={42}>
                        {String(avgScore)}
                      </GradientText>
                      <Text fontSize={11} fontWeight="600" color="$textMuted" text="center">
                        média
                      </Text>
                    </YStack>
                  </YStack>
                </View>
                <OrbitRadar areas={areas} hideCenterScore />
              </YStack>
            </OrbitaCard>

            {/* Area detail cards with recommendations */}
            <YStack gap="$3">
              {details.map((detail) => (
                <OrbitAreaDetailCard key={detail.type} detail={detail} />
              ))}
            </YStack>

            {/* Evolution section */}
            <YStack gap="$4">
              <LinearGradient
                colors={[...themeColors.gradientVivid]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.evolutionBanner}
              >
                <LinearGradient
                  colors={['rgba(120, 190, 255, 0.55)', 'rgba(59, 130, 255, 0.2)', 'transparent']}
                  start={{ x: 0.2, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.decorIcon} pointerEvents="none">
                  <TrendUp size={88} color="rgba(255, 255, 255, 0.1)" weight="bold" />
                </View>
                <YStack gap="$2" pr={56}>
                  <Text
                    fontSize={11}
                    fontWeight="800"
                    letterSpacing={1.4}
                    style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    EVOLUÇÃO
                  </Text>
                  <Text fontSize={20} fontWeight="800" color="white" lineHeight={26}>
                    {evolutionPercent >= 0 ? '+' : ''}
                    {evolutionPercent}% desde o início
                  </Text>
                  <Text fontSize={14} lineHeight={20} style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Como sua órbita mudou ao longo do tempo
                  </Text>
                </YStack>
              </LinearGradient>

              {evolutionChartData.length >= 2 && (
                <>
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
                    <EvolutionChart data={evolutionChartData} title="Evolução geral" />
                  </OrbitaCard>
                </>
              )}

            </YStack>

            {historicalInsights.length > 0 && (
              <YStack gap="$3">
                <SectionTitle>Insights históricos</SectionTitle>
                <InsightsCarousel insights={historicalInsights} />
              </YStack>
            )}
          </>
        )}
      </YStack>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  overviewHeader: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingTop: 2,
  },
  tooltipSlot: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
  },
  evolutionBanner: {
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    minHeight: 132,
  },
  decorIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
});

import React from 'react';
import { StyleSheet, Text as RNText, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Text, XStack, YStack } from 'tamagui';
import { orbitStatusColor } from '../../constants/orbitAreas';
import { themeColors } from '../../constants/theme';
import { OrbitAreaStatus } from '../../types';
import { InfoTooltip } from '../ui/InfoTooltip';

const DAY_LABELS = ['6d', '5d', '4d', '3d', '2d', 'Ontem', 'Hoje'];

const EVOLUTION_TOOLTIP =
  'Cada barra é a pontuação do dia (0 a 100). Quanto mais alta, melhor o equilíbrio na área.';

interface OrbitAreaHistoryChartProps {
  history: number[];
  status: OrbitAreaStatus;
}

export function OrbitAreaHistoryChart({ history, status }: OrbitAreaHistoryChartProps) {
  const accent = orbitStatusColor(status);

  const barData = history.map((value, index) => ({
    value: Math.max(0, Math.min(100, value)),
    label: DAY_LABELS[index] ?? '',
    frontColor: accent,
    gradientColor: themeColors.primaryGlow,
    topLabelComponent: () => <RNText style={styles.barValue}>{value}</RNText>,
  }));

  return (
    <YStack gap="$4">
      <XStack justify="space-between" items="flex-start" gap="$3">
        <YStack flex={1} gap="$2">
          <Text fontSize={12} fontWeight="700" letterSpacing={1.2} style={{ color: themeColors.textMuted }}>
            EVOLUÇÃO
          </Text>
          <Text fontSize={13} color="$textMuted" lineHeight={18}>
            Últimos 7 dias
          </Text>
        </YStack>
        <InfoTooltip text={EVOLUTION_TOOLTIP} align="right" />
      </XStack>

      <View style={styles.chartWrap}>
        <BarChart
          data={barData}
          height={156}
          barWidth={24}
          spacing={12}
          roundedTop
          roundedBottom
          hideRules
          maxValue={100}
          noOfSections={4}
          yAxisColor="transparent"
          xAxisColor={themeColors.glassBorder}
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          initialSpacing={8}
          endSpacing={8}
          showGradient
          isAnimated
          animationDuration={600}
          barBorderRadius={8}
        />
      </View>
    </YStack>
  );
}

const styles = StyleSheet.create({
  chartWrap: {
    marginLeft: -8,
    paddingTop: 6,
  },
  axisText: {
    color: themeColors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  barValue: {
    color: themeColors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
  },
});

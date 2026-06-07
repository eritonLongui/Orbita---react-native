import React from 'react';
import { LineChart } from 'react-native-gifted-charts';
import { YStack, Text } from 'tamagui';
import { themeColors } from '../../constants/theme';

interface EvolutionChartProps {
  data: { value: number; label?: string }[];
  title?: string;
}

export function EvolutionChart({ data, title }: EvolutionChartProps) {
  return (
    <YStack gap="$2">
      {title ? (
        <Text fontSize={14} color="$textMuted">
          {title}
        </Text>
      ) : null}
      <LineChart
        data={data}
        height={160}
        spacing={data.length > 12 ? 28 : 40}
        color={themeColors.primary}
        thickness={3}
        startFillColor="rgba(75, 139, 255, 0.35)"
        endFillColor="rgba(75, 139, 255, 0.05)"
        startOpacity={0.4}
        endOpacity={0.1}
        areaChart
        hideRules
        yAxisColor={themeColors.glassBorder}
        xAxisColor={themeColors.glassBorder}
        yAxisTextStyle={{ color: themeColors.textMuted, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: themeColors.textMuted, fontSize: 10 }}
        noOfSections={4}
        maxValue={100}
        initialSpacing={12}
        endSpacing={12}
      />
    </YStack>
  );
}

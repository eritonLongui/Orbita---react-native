import {
  CaretDown,
  Clock,
  Drop,
  GameController,
  Lightbulb,
  Moon,
  PersonSimpleRun,
} from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text, XStack, YStack } from 'tamagui';
import { ORBIT_STATUS_LABELS, orbitStatusColor } from '../../constants/orbitAreas';
import { themeColors } from '../../constants/theme';
import { OrbitAreaDetail, PillarType } from '../../types';
import { OrbitaCard } from '../ui/OrbitaCard';
import { OrbitAreaHistoryChart } from './OrbitAreaHistoryChart';

const AREA_ICONS = {
  sleep: Moon,
  movement: PersonSimpleRun,
  routine: Clock,
  nutrition: Drop,
  leisure: GameController,
} as const;

const EXPAND_DURATION = 320;
const EXPAND_EASING = Easing.out(Easing.cubic);

interface OrbitAreaDetailCardProps {
  detail: OrbitAreaDetail;
}

function InnerSection({ children }: { children: React.ReactNode }) {
  return <View style={styles.innerSection}>{children}</View>;
}

export function OrbitAreaDetailCard({ detail }: OrbitAreaDetailCardProps) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = orbitStatusColor(detail.status);
  const AreaIcon = AREA_ICONS[detail.type as PillarType];
  const chevronRotation = useSharedValue(expanded ? 1 : 0);

  useEffect(() => {
    chevronRotation.value = withTiming(expanded ? 1 : 0, {
      duration: EXPAND_DURATION,
      easing: EXPAND_EASING,
    });
  }, [expanded, chevronRotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value * 180}deg` }],
  }));

  return (
    <OrbitaCard subtle>
      <Animated.View layout={LinearTransition.duration(EXPAND_DURATION).easing(EXPAND_EASING)}>
        <YStack gap={expanded ? '$4' : 0}>
          <Pressable
            onPress={() => setExpanded((v) => !v)}
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            accessibilityLabel={`${detail.label}, nota ${detail.score}`}
          >
            <XStack justify="space-between" items="center" gap="$3">
              <XStack flex={1} items="center" gap="$2.5">
                <AreaIcon size={22} color={themeColors.primary} />
                <YStack flex={1} gap={expanded ? '$2.5' : 0}>
                  <Text fontSize={18} fontWeight="800" color="$text">
                    {detail.label}
                  </Text>
                  {expanded ? (
                    <Animated.View
                      entering={FadeIn.duration(240).easing(EXPAND_EASING)}
                      exiting={FadeOut.duration(180)}
                    >
                      <Text fontSize={13} color="$textMuted" lineHeight={18}>
                        {detail.description}
                      </Text>
                    </Animated.View>
                  ) : null}
                </YStack>
              </XStack>

              <XStack items="center" gap="$3">
                <YStack
                  minW={52}
                  items="center"
                  justify="center"
                  py="$2"
                  px="$2"
                  rounded={14}
                  style={{ backgroundColor: `${statusColor}14` }}
                >
                  <Text fontSize={20} fontWeight="800" style={{ color: statusColor }}>
                    {detail.score}
                  </Text>
                </YStack>
                <Animated.View style={chevronStyle}>
                  <CaretDown size={18} color={themeColors.textMuted} />
                </Animated.View>
              </XStack>
            </XStack>
          </Pressable>

          {expanded ? (
            <Animated.View
              entering={FadeIn.duration(EXPAND_DURATION).easing(EXPAND_EASING)}
              exiting={FadeOut.duration(240).easing(Easing.in(Easing.cubic))}
            >
              <YStack gap="$3">
                <InnerSection>
                  <YStack gap="$3">
                    <Text
                      fontSize={12}
                      fontWeight="700"
                      letterSpacing={1.2}
                      style={{ color: themeColors.textMuted }}
                    >
                      ESTADO
                    </Text>
                    <Text fontSize={16} fontWeight="700" style={{ color: statusColor }}>
                      {ORBIT_STATUS_LABELS[detail.status]}
                    </Text>
                  </YStack>
                </InnerSection>

                <InnerSection>
                  <OrbitAreaHistoryChart history={detail.history} status={detail.status} />
                </InnerSection>

                <InnerSection>
                  <YStack gap="$3" items="center">
                    <Lightbulb size={28} color={themeColors.primarySoft} />
                    <Text
                      fontSize={12}
                      fontWeight="700"
                      letterSpacing={1.2}
                      text="center"
                      style={{ color: themeColors.textMuted }}
                    >
                      RECOMENDAÇÃO DA LYRA
                    </Text>
                    <Text fontSize={14} color="$text" lineHeight={21} text="center">
                      {detail.recommendation}
                    </Text>
                  </YStack>
                </InnerSection>
              </YStack>
            </Animated.View>
          ) : null}
        </YStack>
      </Animated.View>
    </OrbitaCard>
  );
}

const styles = StyleSheet.create({
  innerSection: {
    borderRadius: 16,
    backgroundColor: themeColors.surface,
    borderWidth: 1,
    borderColor: themeColors.glassBorder,
    padding: 14,
  },
});

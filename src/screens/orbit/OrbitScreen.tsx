import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { Text, YStack } from 'tamagui';
import { LyraEmptyStateCard, OrbitAreaDetailCard, OrbitRadar } from '../../components/orbit';
import { GradientText } from '../../components/ui/GradientText';
import { InfoTooltip } from '../../components/ui/InfoTooltip';
import { OrbitaCard } from '../../components/ui/OrbitaCard';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useOrbitStatus } from '../../hooks/useOrbitStatus';
import { MainTabParamList } from '../../navigation/types';

const OVERVIEW_TOOLTIP =
  'Equilíbrio entre as cinco áreas — quanto maior a forma, mais estável está sua órbita.';

export function OrbitScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { areas, details, hasData } = useOrbitStatus();
  const avgScore = useMemo(
    () => (areas.length ? Math.round(areas.reduce((sum, area) => sum + area.score, 0) / areas.length) : 0),
    [areas],
  );

  return (
    <ScreenWrapper tabBarOffset>
      <YStack gap="$5" pb="$14" pt="$4" px="$2">
        <Text fontSize={28} fontWeight="800" color="$text">
          Minha Órbita
        </Text>

        {!hasData ? (
          <LyraEmptyStateCard
            title="Sua órbita ainda está se formando"
            description="Converse com a Lyra para mapear descanso, energia, ritmo, nutrição e bem-estar. Os dados aparecem aqui depois do check-in."
            onPress={() => navigation.navigate('Lyra')}
          />
        ) : (
          <>
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

            <YStack gap="$3">
              {details.map((detail) => (
                <OrbitAreaDetailCard key={detail.type} detail={detail} />
              ))}
            </YStack>
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
});

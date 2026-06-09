import React, { useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Spinner, Text, YStack } from 'tamagui';
import { HomeHeader } from '../../components/mission/HomeHeader';
import { HomeStatsGrid } from '../../components/mission/HomeStatsGrid';
import { MissionDayCard } from '../../components/mission/MissionDayCard';
import { MissionStatsPlaceholder } from '../../components/mission/MissionStatsPlaceholder';
import { MissionStatusCard } from '../../components/mission/MissionStatusCard';
import { TodayChecklist } from '../../components/mission/TodayChecklist';
import { InsightCard } from '../../components/orbit';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { getMissionHeroCopy } from '../../constants/missionCopy';
import { useJourney } from '../../hooks/useJourney';
import { useOrbitStatus } from '../../hooks/useOrbitStatus';
import { MainTabParamList } from '../../navigation/types';
import { useAuth } from '../../providers/AuthProvider';
import { resolveJourneyState } from '../../services/journey';
import { getMissionNumber } from '../../utils/greeting';
import { getProfilePhotoUrl } from '../../utils/profilePhoto';

export function MissionScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { profile, user } = useAuth();
  const { loading, heroState, areas, insight, hasData } = useOrbitStatus();
  const {
    firstLyraCompleted,
    todayCheckInComplete,
    visitStreak,
    loaded: journeyLoaded,
    refresh,
    trackMissionVisit,
  } = useJourney();
  const name = profile?.full_name?.split(' ')[0] ?? 'Comandante';
  const missionNumber = getMissionNumber(profile?.created_at);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        await trackMissionVisit();
        await refresh();
      })();
    }, [refresh, trackMissionVisit]),
  );

  const journeyState = resolveJourneyState(hasData, firstLyraCompleted);
  const heroCopy = getMissionHeroCopy(journeyState, heroState);
  const checkInDone = todayCheckInComplete || hasData;

  if (loading || !journeyLoaded) {
    return (
      <ScreenWrapper scrollable={false} tabBarOffset>
        <YStack flex={1} items="center" justify="center">
          <Spinner size="large" color="$primary" />
        </YStack>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper tabBarOffset>
      <YStack gap="$6" pb="$14" pt="$4" px="$2">
        <HomeHeader name={name} photoUrl={getProfilePhotoUrl(profile, user)} />

        <MissionDayCard missionDay={missionNumber} streak={visitStreak || 1} />

        <MissionStatusCard
          title={heroCopy.title}
          description={heroCopy.description}
          onPress={() => navigation.navigate('Lyra')}
        />

        {!hasData ? (
          <TodayChecklist
            checkInDone={checkInDone}
            onPressCheckIn={() => navigation.navigate('Lyra')}
          />
        ) : null}

        {hasData ? (
          <YStack gap="$3">
            <Text fontSize={13} fontWeight="800" letterSpacing={1.2} color="$textMuted">
              RESUMO DA MINHA ÓRBITA
            </Text>
            <HomeStatsGrid areas={areas} />
          </YStack>
        ) : (
          <MissionStatsPlaceholder />
        )}

        {hasData && insight.trim() ? (
          <InsightCard insight={insight} title="Insight do dia" />
        ) : null}
      </YStack>
    </ScreenWrapper>
  );
}

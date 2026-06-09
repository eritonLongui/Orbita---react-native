import React, { useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { Spinner, Text, YStack } from 'tamagui';
import { HomeHeader } from '../../components/mission/HomeHeader';
import { HomeStatsGrid } from '../../components/mission/HomeStatsGrid';
import { MissionDayCard } from '../../components/mission/MissionDayCard';
import { MissionStatsPlaceholder } from '../../components/mission/MissionStatsPlaceholder';
import { MissionStatusCard } from '../../components/mission/MissionStatusCard';
import { SmartTaskList } from '../../components/mission/SmartTaskList';
import { InsightCard } from '../../components/orbit';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { CHECK_IN_PENDING_COPY, getMissionHeroCopy } from '../../constants/missionCopy';
import { TalkToLyraButton } from '../../components/lyra/TalkToLyraButton';
import { useDailyTasks } from '../../hooks/useDailyTasks';
import { useJourney } from '../../hooks/useJourney';
import { useOrbitStatus } from '../../hooks/useOrbitStatus';
import { MainTabParamList } from '../../navigation/types';
import { MOCK_MISSION_DAY } from '../../constants/orbitAreas';
import { useAuth } from '../../providers/AuthProvider';
import { useMockData } from '../../providers/MockDataProvider';
import { resolveJourneyState } from '../../services/journey';
import { getMissionNumber } from '../../utils/greeting';
import { getProfilePhotoUrl } from '../../utils/profilePhoto';

export function MissionScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { profile, user } = useAuth();
  const { enabled: mockDataEnabled } = useMockData();
  const { loading, heroState, areas, insight, hasData } = useOrbitStatus();
  const {
    firstLyraCompleted,
    todayCheckInComplete,
    visitStreak,
    loaded: journeyLoaded,
    refresh,
    trackMissionVisit,
  } = useJourney();
  const { tasks, refresh: refreshTasks, toggleDone } = useDailyTasks();
  const name = profile?.full_name?.split(' ')[0] ?? 'Comandante';
  const missionNumber = mockDataEnabled
    ? MOCK_MISSION_DAY
    : getMissionNumber(profile?.created_at);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        await trackMissionVisit();
        await refresh();
        await refreshTasks();
      })();
    }, [refresh, refreshTasks, trackMissionVisit]),
  );

  const journeyState = resolveJourneyState(hasData, firstLyraCompleted);
  const checkInDone = todayCheckInComplete;
  const heroCopy = checkInDone
    ? getMissionHeroCopy(journeyState, heroState)
    : CHECK_IN_PENDING_COPY;

  const openCheckIn = () => {
    navigation.navigate('Lyra', { openCheckIn: true });
  };

  const handleToggleTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      if (!task.done) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      toggleDone(taskId);
    },
    [tasks, toggleDone],
  );

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
          onPress={checkInDone ? () => navigation.navigate('Lyra') : openCheckIn}
        />

        <SmartTaskList
          tasks={tasks}
          checkInDone={checkInDone}
          onPressCheckIn={openCheckIn}
          onToggleTask={(id) => void handleToggleTask(id)}
        />

        {hasData ? (
          <YStack gap="$3">
            <SectionTitle>Resumo da minha órbita</SectionTitle>
            <HomeStatsGrid areas={areas} missionDay={missionNumber} />
            <TalkToLyraButton
              variant="outline"
              onPress={() => navigation.navigate('Lyra')}
            />
          </YStack>
        ) : (
          <MissionStatsPlaceholder onTalkToLyra={() => navigation.navigate('Lyra')} />
        )}

        {hasData && insight.trim() ? (
          <InsightCard insight={insight} title="Insight do dia" variant="banner" />
        ) : null}
      </YStack>
    </ScreenWrapper>
  );
}

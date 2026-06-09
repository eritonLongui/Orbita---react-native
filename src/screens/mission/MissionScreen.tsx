import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Spinner, Text, YStack } from 'tamagui';
import { HomeHeader } from '../../components/mission/HomeHeader';
import { HomeStatsGrid } from '../../components/mission/HomeStatsGrid';
import { MissionStatusCard } from '../../components/mission/MissionStatusCard';
import { InsightCard } from '../../components/orbit';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { MISSION_HERO_COPY } from '../../constants/orbitAreas';
import { useOrbitStatus } from '../../hooks/useOrbitStatus';
import { MainTabParamList } from '../../navigation/types';
import { useAuth } from '../../providers/AuthProvider';
import { getMissionNumber } from '../../utils/greeting';
import { getProfilePhotoUrl } from '../../utils/profilePhoto';

export function MissionScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { profile, user } = useAuth();
  const { loading, heroState, areas, insight, hasData } = useOrbitStatus();
  const name = profile?.full_name?.split(' ')[0] ?? 'Comandante';
  const missionNumber = getMissionNumber(profile?.created_at);
  const heroCopy = hasData
    ? MISSION_HERO_COPY[heroState]
    : {
        title: 'Sua missão começa hoje',
        description: 'Converse com a Lyra para mapear sua órbita e receber os primeiros insights.',
      };

  if (loading) {
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

        <MissionStatusCard
          title={heroCopy.title}
          description={heroCopy.description}
          onPress={() => navigation.navigate('Lyra')}
        />

        <HomeStatsGrid areas={areas} missionDay={missionNumber} />

        {hasData && insight.trim() ? (
          <InsightCard insight={insight} title="Insight do dia" />
        ) : null}
      </YStack>
    </ScreenWrapper>
  );
}

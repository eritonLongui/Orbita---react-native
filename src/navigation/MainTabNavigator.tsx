import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { Spinner, YStack } from 'tamagui';
import { GlassTabBar } from '../components/navigation/GlassTabBar';
import { AchievementsScreen } from '../screens/achievements/AchievementsScreen';
import { LyraScreen } from '../screens/lyra/LyraScreen';
import { MissionScreen } from '../screens/mission/MissionScreen';
import { OrbitScreen } from '../screens/orbit/OrbitScreen';
import { isFirstLyraPending } from '../services/journey';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  const [initialRoute, setInitialRoute] = useState<keyof MainTabParamList | null>(null);

  useEffect(() => {
    isFirstLyraPending().then((pending) => {
      setInitialRoute(pending ? 'Lyra' : 'Mission');
    });
  }, []);

  if (!initialRoute) {
    return (
      <YStack flex={1} items="center" justify="center">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  return (
    <Tab.Navigator
      initialRouteName={initialRoute}
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Mission" component={MissionScreen} />
      <Tab.Screen name="Orbit" component={OrbitScreen} />
      <Tab.Screen name="Lyra" component={LyraScreen} />
      <Tab.Screen name="Achievements" component={AchievementsScreen} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

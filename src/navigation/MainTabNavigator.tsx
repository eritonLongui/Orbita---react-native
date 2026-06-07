import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { GlassTabBar } from '../components/navigation/GlassTabBar';
import { EvolutionScreen } from '../screens/evolution/EvolutionScreen';
import { LyraScreen } from '../screens/lyra/LyraScreen';
import { MissionScreen } from '../screens/mission/MissionScreen';
import { OrbitScreen } from '../screens/orbit/OrbitScreen';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Mission" component={MissionScreen} />
      <Tab.Screen name="Orbit" component={OrbitScreen} />
      <Tab.Screen name="Lyra" component={LyraScreen} />
      <Tab.Screen name="Evolution" component={EvolutionScreen} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

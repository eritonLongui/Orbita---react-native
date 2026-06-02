import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MessageCircle, Activity, Globe, Settings, Mic, ShieldAlert } from 'lucide-react-native';

// Screens import (will be created next)
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { AIAssistantScreen } from '../screens/AIAssistantScreen';
import { VoiceChatScreen } from '../screens/VoiceChatScreen';
import { DailyRoutineScreen } from '../screens/DailyRoutineScreen';
import { EmotionalInsightsScreen } from '../screens/EmotionalInsightsScreen';
import { EarthConnectionScreen } from '../screens/EarthConnectionScreen';
import { PreventionCenterScreen } from '../screens/PreventionCenterScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  VoiceChat: undefined;
  PreventionCenter: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Routine: undefined;
  Assistant: undefined;
  Insights: undefined;
  Earth: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0E1525', // deep-navy
          borderTopColor: '#05070B', // space-black
        },
        tabBarActiveTintColor: '#FF9A2E', // solar-amber
        tabBarInactiveTintColor: '#AEB8C7', // text-secondary
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Routine" 
        component={DailyRoutineScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Activity color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Assistant" 
        component={AIAssistantScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={EmotionalInsightsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Activity color={color} size={size} /> // You can pick a different icon
        }}
      />
      <Tab.Screen 
        name="Earth" 
        component={EarthConnectionScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Globe color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#05070B' } }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="VoiceChat" component={VoiceChatScreen} />
      <Stack.Screen name="PreventionCenter" component={PreventionCenterScreen} />
    </Stack.Navigator>
  );
}

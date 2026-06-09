import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { WelcomeAuthScreen } from '../screens/auth/WelcomeAuthScreen';
import { OnboardingFlowScreen } from '../screens/onboarding/OnboardingFlowScreen';
import { markFirstLyraPending } from '../services/journey';
import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface AuthNavigatorProps {
  initialRoute: keyof AuthStackParamList;
  onOnboardingComplete: () => void;
}

export function AuthNavigator({ initialRoute, onOnboardingComplete }: AuthNavigatorProps) {
  const finishOnboarding = () => {
    void markFirstLyraPending().then(onOnboardingComplete);
  };

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Welcome" component={WelcomeAuthScreen} />
      <Stack.Screen name="OnboardingFlow">
        {() => <OnboardingFlowScreen onComplete={finishOnboarding} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

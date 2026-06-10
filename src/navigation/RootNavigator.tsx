import { NavigationContainer } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Spinner, YStack } from 'tamagui';
import { AppBackground } from '../components/ui/AppBackground';
import { useAuth } from '../providers/AuthProvider';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { AuthStackParamList } from './types';

export function RootNavigator() {
  const { user, profile, initializing } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);

  const authInitialRoute = useMemo<keyof AuthStackParamList>(() => {
    if (!user) return 'Welcome';
    if (profile && !profile.onboarding_completed && !onboardingDone) return 'OnboardingFlow';
    return 'Welcome';
  }, [user, profile, onboardingDone]);

  const isAuthenticated = !!user && (profile?.onboarding_completed || onboardingDone);
  // Após login, o Firebase define `user` antes do perfil carregar — sem isso o onboarding pisca.
  const isResolvingSession = initializing || (!!user && profile === null);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (isResolvingSession) {
    return (
      <AppBackground>
        <YStack flex={1} items="center" justify="center">
          <Spinner size="large" color="$primary" />
        </YStack>
      </AppBackground>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <MainTabNavigator />
      ) : (
        <AuthNavigator
          key={user?.uid ?? 'guest'}
          initialRoute={authInitialRoute}
          onOnboardingComplete={() => setOnboardingDone(true)}
        />
      )}
    </NavigationContainer>
  );
}

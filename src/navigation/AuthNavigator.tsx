import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { OnboardingPillarsScreen } from '../screens/auth/OnboardingPillarsScreen';
import { OnboardingProfileScreen } from '../screens/auth/OnboardingProfileScreen';
import { PermissionsOnboardingScreen } from '../screens/auth/PermissionsOnboardingScreen';
import { WelcomeAuthScreen } from '../screens/auth/WelcomeAuthScreen';
import { markFirstLyraPending } from '../services/journey';
import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();
const PERMISSIONS_KEY = 'orbita_permissions_prompted';

interface AuthNavigatorProps {
  initialRoute: keyof AuthStackParamList;
  onOnboardingComplete: () => void;
}

export function AuthNavigator({ initialRoute, onOnboardingComplete }: AuthNavigatorProps) {
  const [permissionsDone, setPermissionsDone] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(PERMISSIONS_KEY).then((v) => setPermissionsDone(v === 'true'));
  }, []);

  const finishPermissions = async () => {
    await AsyncStorage.setItem(PERMISSIONS_KEY, 'true');
    await markFirstLyraPending();
    onOnboardingComplete();
  };

  if (permissionsDone === null) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Welcome" component={WelcomeAuthScreen} />
      <Stack.Screen name="OnboardingPillars">
        {({ navigation }) => (
          <OnboardingPillarsScreen
            onContinue={() => navigation.navigate('OnboardingProfile')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="OnboardingProfile">
        {({ navigation }) => (
          <OnboardingProfileScreen
            onComplete={() => {
              if (permissionsDone) {
                void markFirstLyraPending().then(onOnboardingComplete);
              } else {
                navigation.navigate('Permissions');
              }
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Permissions">
        {() => <PermissionsOnboardingScreen onComplete={finishPermissions} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { OnboardingProfileScreen } from '../screens/auth/OnboardingProfileScreen';
import { PermissionMicrophoneScreen } from '../screens/auth/PermissionMicrophoneScreen';
import { PermissionNotificationsScreen } from '../screens/auth/PermissionNotificationsScreen';
import { WelcomeAuthScreen } from '../screens/auth/WelcomeAuthScreen';
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
      <Stack.Screen name="OnboardingProfile">
        {({ navigation }) => (
          <OnboardingProfileScreen
            onComplete={() => {
              if (permissionsDone) {
                onOnboardingComplete();
              } else {
                navigation.navigate('PermissionMicrophone');
              }
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="PermissionMicrophone">
        {({ navigation }) => (
          <PermissionMicrophoneScreen
            onContinue={() => navigation.navigate('PermissionNotifications')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="PermissionNotifications">
        {() => <PermissionNotificationsScreen onComplete={finishPermissions} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

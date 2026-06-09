import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { OnboardingPillarsScreen } from '../auth/OnboardingPillarsScreen';
import { OnboardingProfileScreen } from '../auth/OnboardingProfileScreen';
import { PermissionsOnboardingScreen } from '../auth/PermissionsOnboardingScreen';

type OnboardingTestStackParamList = {
  Pillars: undefined;
  Profile: undefined;
  Permissions: undefined;
};

const Stack = createNativeStackNavigator<OnboardingTestStackParamList>();

export function OnboardingTestScreen() {
  const profileNavigation = useNavigation();
  const closePreview = () => profileNavigation.goBack();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Pillars">
        {({ navigation }) => (
          <OnboardingPillarsScreen
            onClose={closePreview}
            onContinue={() => navigation.navigate('Profile')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Profile">
        {({ navigation }) => (
          <OnboardingProfileScreen
            previewMode
            onClose={closePreview}
            onComplete={() => navigation.navigate('Permissions')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Permissions">
        {() => (
          <PermissionsOnboardingScreen onClose={closePreview} onComplete={closePreview} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

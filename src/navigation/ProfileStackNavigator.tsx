import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { GeneralSettingsScreen } from '../screens/profile/GeneralSettingsScreen';
import { LyraSettingsScreen } from '../screens/profile/LyraSettingsScreen';
import { PermissionsSettingsScreen } from '../screens/profile/PermissionsSettingsScreen';
import { ProfileEditScreen } from '../screens/profile/ProfileEditScreen';
import { ProfileHomeScreen } from '../screens/profile/ProfileHomeScreen';
import { SecurityPrivacyScreen } from '../screens/profile/SecurityPrivacyScreen';
import { ProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="ProfileHome" component={ProfileHomeScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="GeneralSettings" component={GeneralSettingsScreen} />
      <Stack.Screen name="LyraSettings" component={LyraSettingsScreen} />
      <Stack.Screen name="PermissionsSettings" component={PermissionsSettingsScreen} />
      <Stack.Screen name="SecurityPrivacy" component={SecurityPrivacyScreen} />
    </Stack.Navigator>
  );
}

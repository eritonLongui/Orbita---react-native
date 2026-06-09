import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { WelcomeAuthScreen } from '../auth/WelcomeAuthScreen';

export function LoginTestScreen() {
  const profileNavigation = useNavigation();
  const closePreview = () => profileNavigation.goBack();

  return <WelcomeAuthScreen previewMode onClose={closePreview} />;
}

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useHideTabBarWhileFocused } from '../../hooks/useHideTabBarWhileFocused';
import { OnboardingFlowScreen } from '../onboarding/OnboardingFlowScreen';

export function OnboardingTestScreen() {
  const profileNavigation = useNavigation();
  useHideTabBarWhileFocused();
  const closePreview = () => profileNavigation.goBack();

  return (
    <OnboardingFlowScreen
      previewMode
      onClose={closePreview}
      onComplete={closePreview}
    />
  );
}

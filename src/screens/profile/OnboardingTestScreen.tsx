import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { OnboardingFlowScreen } from '../onboarding/OnboardingFlowScreen';

export function OnboardingTestScreen() {
  const profileNavigation = useNavigation();
  const closePreview = () => profileNavigation.goBack();

  return (
    <OnboardingFlowScreen
      previewMode
      onClose={closePreview}
      onComplete={closePreview}
    />
  );
}

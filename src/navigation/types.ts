export type AuthStackParamList = {
  Welcome: undefined;
  OnboardingPillars: undefined;
  OnboardingProfile: undefined;
  Permissions: undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  ProfileEdit: undefined;
  GeneralSettings: undefined;
  LyraSettings: undefined;
  PermissionsSettings: undefined;
  SecurityPrivacy: undefined;
  OnboardingTest: undefined;
};

export type MainTabParamList = {
  Mission: undefined;
  Orbit: undefined;
  Lyra: { openCheckIn?: boolean } | undefined;
  Achievements: undefined;
  Profile: undefined;
};

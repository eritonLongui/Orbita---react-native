import AsyncStorage from '@react-native-async-storage/async-storage';

const key = (userId: string) => `orbita_onboarding_done_${userId}`;

export async function setOnboardingDoneLocal(userId: string): Promise<void> {
  await AsyncStorage.setItem(key(userId), 'true');
}

export async function getOnboardingDoneLocal(userId: string): Promise<boolean> {
  const value = await AsyncStorage.getItem(key(userId));
  return value === 'true';
}

export async function clearOnboardingDoneLocal(userId: string): Promise<void> {
  await AsyncStorage.removeItem(key(userId));
}

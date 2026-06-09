import AsyncStorage from '@react-native-async-storage/async-storage';

const MOCK_DATA_KEY = 'orbita_mock_data_enabled';

export async function isMockDataEnabled(): Promise<boolean> {
  return (await AsyncStorage.getItem(MOCK_DATA_KEY)) === 'true';
}

export async function setMockDataEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(MOCK_DATA_KEY, enabled ? 'true' : 'false');
}

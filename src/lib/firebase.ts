import { createAsyncStorage } from '@react-native-async-storage/async-storage';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { Platform } from 'react-native';
import { getStorage } from 'firebase/storage';
import { publicEnv } from '../config/publicEnv';

const firebaseConfig = {
  apiKey: publicEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
  authDomain: publicEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: publicEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: publicEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: publicEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: publicEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

function createAuth() {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }

  try {
    const storage = createAsyncStorage('orbita-auth');
    return initializeAuth(app, {
      persistence: getReactNativePersistence(storage),
    });
  } catch {
    return getAuth(app);
  }
}

export const auth = createAuth();
export const storage = getStorage(app);

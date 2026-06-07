import 'react-native-gesture-handler';
import React from 'react';
import { TamaguiProvider } from 'tamagui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/ui/ErrorBoundary';
import { AuthProvider } from './src/providers/AuthProvider';
import { LyraStateProvider } from './src/providers/LyraStateProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import tamaguiConfig from './tamagui.config';

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <SafeAreaProvider>
        <ErrorBoundary>
          <AuthProvider>
            <LyraStateProvider>
              <RootNavigator />
            </LyraStateProvider>
          </AuthProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </TamaguiProvider>
  );
}

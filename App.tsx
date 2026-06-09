import 'react-native-gesture-handler';
import React from 'react';
import { TamaguiProvider } from 'tamagui';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/ui/ErrorBoundary';
import { useAppFonts } from './src/hooks/useAppFonts';
import { AuthProvider } from './src/providers/AuthProvider';
import { LyraStateProvider } from './src/providers/LyraStateProvider';
import { MockDataProvider } from './src/providers/MockDataProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import tamaguiConfig from './tamagui.config';

export default function App() {
  const [fontsLoaded] = useAppFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <SafeAreaProvider>
        <ErrorBoundary>
          <AuthProvider>
            <MockDataProvider>
              <LyraStateProvider>
                <RootNavigator />
              </LyraStateProvider>
            </MockDataProvider>
          </AuthProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </TamaguiProvider>
  );
}

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { ScrollView, YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_FLOATING_CLEARANCE } from '../navigation/GlassTabBar';
import { TAB_BAR_HEIGHT } from '../../constants/theme';
import { AppBackground } from './AppBackground';
import { BOTTOM_EDGE_FADE_HEIGHT, GradualBlurEdges } from './GradualBlurEdges';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  /** Reserva espaço para a tab bar flutuante */
  tabBarOffset?: boolean;
  /** Menos padding inferior — input de chat colado acima da tab bar */
  compactBottom?: boolean;
}

export function ScreenWrapper({
  children,
  scrollable = true,
  padded = true,
  tabBarOffset = false,
  compactBottom = false,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  const paddingTop = padded ? insets.top + 12 : 0;
  const baseBottom = padded ? Math.max(insets.bottom, 12) : insets.bottom;
  const tabBarSpace = tabBarOffset ? TAB_BAR_HEIGHT : padded ? 16 : 0;
  const chatInputBottomGap = 12;
  const paddingBottom = compactBottom
    ? insets.bottom +
      (tabBarOffset ? TAB_BAR_FLOATING_CLEARANCE + chatInputBottomGap : baseBottom)
    : baseBottom + tabBarSpace + BOTTOM_EDGE_FADE_HEIGHT;

  const content = (
    <YStack flex={1} px={padded ? '$4' : 0} pt={paddingTop} pb={paddingBottom}>
      {children}
    </YStack>
  );

  const bottomExtra = tabBarOffset ? TAB_BAR_HEIGHT : 0;

  return (
    <AppBackground>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        {scrollable ? (
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            {content}
          </ScrollView>
        ) : (
          content
        )}
        <GradualBlurEdges bottomExtra={bottomExtra} />
      </View>
    </AppBackground>
  );
}

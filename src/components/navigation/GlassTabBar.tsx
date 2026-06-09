import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Planet,
  RocketLaunch,
  Trophy,
  User,
} from 'phosphor-react-native';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LYRA_TAB_ORB_SIZE, LyraTabOrb } from '../lyra/LyraTabOrb';
import { themeColors } from '../../constants/theme';
import { MainTabParamList } from '../../navigation/types';

const CIRCLE_SIZE = 44;
const BAR_PADDING_V = 8;
const BAR_PADDING_H = 10;

export const TAB_BAR_VISUAL_HEIGHT = CIRCLE_SIZE + BAR_PADDING_V * 2;
export const TAB_BAR_HORIZONTAL_MARGIN = 12;
export const TAB_BAR_BOTTOM_GAP = 8;
/** Espaço total da tab bar flutuante acima do safe area (orb Lyra + labels + padding). */
export const TAB_BAR_FLOATING_CLEARANCE =
  TAB_BAR_BOTTOM_GAP + BAR_PADDING_V * 2 + LYRA_TAB_ORB_SIZE + 8 + 14 + 8;

type TabRoute = keyof MainTabParamList;
type StandardTabRoute = Exclude<TabRoute, 'Lyra'>;

const TAB_ICONS: Record<
  StandardTabRoute,
  React.ComponentType<{ size: number; color: string; weight?: 'regular' | 'fill' | 'duotone' }>
> = {
  Mission: RocketLaunch,
  Orbit: Planet,
  Achievements: Trophy,
  Profile: User,
};

const TAB_LABELS: Record<TabRoute, string> = {
  Mission: 'Missão',
  Orbit: 'Órbita',
  Lyra: 'Lyra',
  Achievements: 'Conquistas',
  Profile: 'Perfil',
};

function TabCircle({
  route,
  focused,
  onPress,
  onLongPress,
}: {
  route: TabRoute;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const isLyra = route === 'Lyra';

  const content = isLyra ? (
    <LyraTabOrb />
  ) : (
    (() => {
      const Icon = TAB_ICONS[route as StandardTabRoute];
      if (!Icon) return null;
      const iconColor = focused ? themeColors.primary : themeColors.textMuted;
      return <Icon size={22} color={iconColor} weight={focused ? 'fill' : 'regular'} />;
    })()
  );

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.tabButton, pressed && styles.tabPressed]}
      accessibilityRole="button"
      accessibilityLabel={TAB_LABELS[route]}
      accessibilityState={{ selected: focused }}
    >
      <View style={styles.tabContent}>
        {isLyra ? (
          <View style={styles.lyraTab}>{content}</View>
        ) : (
          <View style={[styles.circle, focused && styles.circleActive]}>{content}</View>
        )}
        <Text
          fontSize={9}
          fontWeight="700"
          color={focused ? '$primary' : '$textMuted'}
          numberOfLines={1}
        >
          {TAB_LABELS[route]}
        </Text>
      </View>
    </Pressable>
  );
}

export function GlassTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        {
          bottom: insets.bottom + TAB_BAR_BOTTOM_GAP,
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.bar}>
        <View style={styles.barBackground}>
          {Platform.OS !== 'web' ? (
            <BlurView intensity={72} tint="dark" style={styles.blur} />
          ) : null}
          <View style={styles.overlay} />
          <LinearGradient
            colors={[themeColors.glassBarHighlight, 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.highlight}
            pointerEvents="none"
          />
        </View>
        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const tabRoute = route.name as TabRoute;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TabCircle
                key={route.key}
                route={tabRoute}
                focused={focused}
                onPress={onPress}
                onLongPress={onLongPress}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: TAB_BAR_HORIZONTAL_MARGIN,
    right: TAB_BAR_HORIZONTAL_MARGIN,
  },
  bar: {
    position: 'relative',
    borderRadius: 14,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: themeColors.glassBarBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  barBackground: {
    ...StyleSheet.absoluteFill,
    borderRadius: 14,
    overflow: 'hidden',
  },
  blur: {
    ...StyleSheet.absoluteFill,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: themeColors.glassBar,
  },
  highlight: {
    ...StyleSheet.absoluteFill,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: BAR_PADDING_H,
    paddingVertical: BAR_PADDING_V,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tabPressed: {
    opacity: 0.85,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  circleActive: {
    backgroundColor: themeColors.primaryBg,
    borderWidth: 1,
    borderColor: 'rgba(75, 139, 255, 0.35)',
  },
  lyraTab: {
    width: LYRA_TAB_ORB_SIZE,
    height: LYRA_TAB_ORB_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { themeColors } from '../../constants/theme';

const BG = themeColors.bg;
/** Suaviza só a transição logo abaixo da status bar */
const STATUS_BAR_FADE_EXTRA = 6;
/** Altura do fade inferior — usar no padding das telas para o conteúdo não ficar por baixo */
export const BOTTOM_EDGE_FADE_HEIGHT = 72;
const BOTTOM_FADE = BOTTOM_EDGE_FADE_HEIGHT;

interface GradualBlurEdgesProps {
  /** Altura extra no rodapé (ex.: tab bar flutuante) */
  bottomExtra?: number;
  showBottom?: boolean;
}

function BlurEdge({
  position,
  height,
}: {
  position: 'top' | 'bottom';
  height: number;
}) {
  const isTop = position === 'top';

  const fadeColors = isTop
    ? ([BG, `${BG}CC`, `${BG}00`] as const)
    : ([`${BG}00`, `${BG}E6`, BG] as const);

  const locations = isTop ? ([0, 0.55, 1] as const) : ([0, 0.5, 1] as const);

  if (height <= 0) return null;

  return (
    <View
      style={[
        styles.edge,
        { height },
        isTop ? styles.edgeTop : styles.edgeBottom,
      ]}
      pointerEvents="none"
    >
      <LinearGradient
        colors={[...fadeColors]}
        locations={[...locations]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

export function GradualBlurEdges({
  bottomExtra = 0,
  showBottom = true,
}: GradualBlurEdgesProps) {
  const insets = useSafeAreaInsets();
  const statusBarFadeHeight = insets.top + STATUS_BAR_FADE_EXTRA;

  return (
    <>
      <BlurEdge position="top" height={statusBarFadeHeight} />
      {showBottom ? (
        <BlurEdge position="bottom" height={BOTTOM_FADE + bottomExtra + insets.bottom} />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  edge: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 20,
  },
  edgeTop: {
    top: 0,
  },
  edgeBottom: {
    bottom: 0,
  },
});

import React, { useCallback, useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  StyleSheet,
  View,
} from 'react-native';

/**
 * Planeta no topo da tela de login.
 *
 * Coloque o PNG exportado do Figma em:
 *   assets/images/login-planet.png
 */
const LOGIN_PLANET = require('../../../assets/images/login-planet.png');
const { width: PLANET_WIDTH, height: PLANET_HEIGHT } = Image.resolveAssetSource(LOGIN_PLANET);
const PLANET_ASPECT_RATIO = PLANET_WIDTH / PLANET_HEIGHT;

export function LoginPlanetHero() {
  const [layoutWidth, setLayoutWidth] = useState(0);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    if (nextWidth > 0) {
      setLayoutWidth(nextWidth);
    }
  }, []);

  const imageHeight =
    layoutWidth > 0 ? Math.round(layoutWidth / PLANET_ASPECT_RATIO) : 0;

  return (
    <View style={styles.container} onLayout={onLayout} pointerEvents="none">
      {layoutWidth > 0 ? (
        <Image
          source={LOGIN_PLANET}
          style={{
            width: layoutWidth,
            height: imageHeight,
          }}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'stretch',
    flexShrink: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
});

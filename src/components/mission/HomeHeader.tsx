import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { OrbitaLogoMark, ORBITA_LOGO_MARK_ASPECT } from '../ui/OrbitaLogoMark';
import { themeColors } from '../../constants/theme';
import { formatHomeDateTime } from '../../utils/greeting';

const MARK_WIDTH = 210;
const MARK_HEIGHT = MARK_WIDTH / ORBITA_LOGO_MARK_ASPECT;
const MARK_BLEED_RIGHT = 58;
/** Reserva horizontal — menor que a largura do mark; o símbolo é absolute e não empurra o texto. */
const MARK_TEXT_CLEARANCE = 92;
const AVATAR_SIZE = 52;
const MARK_BOTTOM_FADE_HEIGHT = MARK_HEIGHT * 0.42;
const BG = themeColors.bg;

interface HomeHeaderProps {
  name: string;
  photoUrl?: string | null;
}

export function HomeHeader({ name, photoUrl }: HomeHeaderProps) {
  const { datePart } = formatHomeDateTime();
  const initial = name.charAt(0).toUpperCase() || 'O';

  return (
    <View style={styles.wrapper}>
      <XStack gap="$3" items="center" style={styles.content}>
        {photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 }}
          />
        ) : (
          <YStack
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            rounded={999}
            bg="$primaryBg"
            borderWidth={1}
            borderColor="$glassBorder"
            items="center"
            justify="center"
          >
            <Text fontSize={20} fontWeight="700" color="$primary">
              {initial}
            </Text>
          </YStack>
        )}

        <YStack flex={1} gap="$1">
          <Text
            fontSize={13}
            fontWeight="600"
            letterSpacing={0.6}
            style={{ color: themeColors.textPlaceholder }}
          >
            {datePart}
          </Text>
          <Text fontFamily="$heading" fontSize={22} fontWeight="400" color="$text" numberOfLines={1}>
            Olá,{' '}
            <Text fontFamily="$heading" fontWeight="700" color="$text">
              {name}
            </Text>
          </Text>
        </YStack>
      </XStack>

      <View style={styles.markWrap} pointerEvents="none">
        <OrbitaLogoMark width={MARK_WIDTH} />
        <LinearGradient
          pointerEvents="none"
          colors={[`${BG}00`, `${BG}B3`, BG]}
          locations={[0, 0.55, 1]}
          style={styles.markBottomFade}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginHorizontal: -8,
    overflow: 'visible',
  },
  content: {
    zIndex: 2,
    paddingRight: MARK_TEXT_CLEARANCE,
  },
  markWrap: {
    position: 'absolute',
    right: -MARK_BLEED_RIGHT,
    top: AVATAR_SIZE / 2 - MARK_HEIGHT / 2,
    width: MARK_WIDTH,
    height: MARK_HEIGHT,
    zIndex: 1,
  },
  markBottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: MARK_BOTTOM_FADE_HEIGHT,
  },
});

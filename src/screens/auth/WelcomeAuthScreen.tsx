import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, Platform, StyleSheet, TextStyle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, YStack } from 'tamagui';
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton';
import { GradientText } from '../../components/ui/GradientText';
import { themeColors } from '../../constants/theme';
import { useAuth } from '../../providers/AuthProvider';
import { getWebAuthUnsupportedMessage, isGoogleWebAuthSupported } from '../../services/googleAuthWeb';

const loginHero = require('../../../assets/images/login-hero.jpg');

const descriptionStyle: TextStyle = {
  textAlign: 'center',
  textWrap: 'balance',
  color: themeColors.text,
};

export function WelcomeAuthScreen() {
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, signingIn, authError } = useAuth();
  const webAuthBlocked = Platform.OS === 'web' && !isGoogleWebAuthSupported();
  const displayError = authError ?? (webAuthBlocked ? getWebAuthUnsupportedMessage() : null);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={styles.hero}>
        <Image source={loginHero} style={styles.heroImage} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.55)', themeColors.bg]}
          locations={[0.4, 0.78, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <YStack
        flex={1.1}
        justify="space-between"
        px="$5"
        pb={Math.max(insets.bottom, 20) + 12}
      >
        <YStack flex={1} justify="center" items="center" px="$2" gap="$4">
          <YStack items="center" gap="$1.5">
            <Text
              fontSize={15}
              fontWeight="600"
              letterSpacing={1.5}
              color="$text"
              textTransform="uppercase"
            >
              Seu copiloto
            </Text>

            <GradientText fontSize={42} fontWeight="800" letterSpacing={3}>
              ORBITA
            </GradientText>
          </YStack>

          <Text fontSize={19} lineHeight={28} maxWidth={320} style={descriptionStyle}>
            Acompanhe sua órbita{'\n'}e converse com a Lyra.
          </Text>
        </YStack>

        <YStack gap="$3" pt="$2">
          <GoogleSignInButton
            onPress={signInWithGoogle}
            loading={signingIn}
            disabled={webAuthBlocked}
            variant="elevated"
          />

          {displayError ? (
            <Text fontSize={13} color="$danger" style={{ textAlign: 'center' }} lineHeight={18}>
              {displayError}
            </Text>
          ) : null}
        </YStack>
      </YStack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: themeColors.bg,
  },
  hero: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    paddingTop: 52,
  },
  heroImage: {
    width: '100%',
    height: '108%',
    transform: [{ translateY: 28 }],
  },
});

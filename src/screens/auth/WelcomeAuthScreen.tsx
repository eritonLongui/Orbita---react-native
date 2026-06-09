import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, TextStyle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, YStack } from 'tamagui';
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton';
import { LoginPlanetHero } from '../../components/auth/LoginPlanetHero';
import { OnboardingPreviewCloseButton } from '../../components/onboarding/OnboardingPreviewCloseButton';
import { OrbitaWordmark } from '../../components/ui/OrbitaWordmark';
import { StarfieldBackground } from '../../components/ui/StarfieldBackground';
import { ONBOARDING_COPY } from '../../constants/onboardingCopy';
import { themeColors } from '../../constants/theme';
import { titleFontFamily } from '../../constants/typography';
import { useAuth } from '../../providers/AuthProvider';
import { getWebAuthUnsupportedMessage, isGoogleWebAuthSupported } from '../../services/googleAuthWeb';

/** Fade abaixo da status bar — planeta some suavemente no topo */
const STATUS_BAR_FADE_EXTRA = 36;

const taglineStyle: TextStyle = {
  textAlign: 'center',
  fontFamily: titleFontFamily,
  fontWeight: '700',
  fontSize: 22,
  lineHeight: 30,
  letterSpacing: 2.6,
  textTransform: 'uppercase',
  maxWidth: 360,
};

interface WelcomeAuthScreenProps {
  previewMode?: boolean;
  onClose?: () => void;
}

export function WelcomeAuthScreen({ previewMode = false, onClose }: WelcomeAuthScreenProps = {}) {
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, signingIn, authError } = useAuth();
  const webAuthBlocked = Platform.OS === 'web' && !isGoogleWebAuthSupported();
  const displayError =
    previewMode ? null : authError ?? (webAuthBlocked ? getWebAuthUnsupportedMessage() : null);
  const copy = ONBOARDING_COPY.welcome;
  const footerBottom = Math.max(insets.bottom, 20) + 16;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <StarfieldBackground />

      <LinearGradient
        pointerEvents="none"
        colors={[themeColors.bg, `${themeColors.bg}E6`, `${themeColors.bg}00`]}
        locations={[0, 0.55, 1]}
        style={[styles.statusBarFade, { height: insets.top + STATUS_BAR_FADE_EXTRA }]}
      />

      {onClose ? (
        <View style={[styles.closeButton, { top: insets.top + 8 }]}>
          <OnboardingPreviewCloseButton onClose={onClose} />
        </View>
      ) : null}

      <YStack
        flex={1}
        width="100%"
        overflow="hidden"
        bg="transparent"
        style={styles.content}
      >
        <LoginPlanetHero />

        <YStack
          flex={1}
          justify="center"
          items="center"
          px="$6"
          gap="$6"
          width="100%"
          minHeight={0}
          bg="transparent"
        >
          <OrbitaWordmark width={300} />
          <Text color="$text" style={taglineStyle}>
            {copy.tagline}
          </Text>
        </YStack>

        <YStack gap="$3" width="100%" px="$6" pb={footerBottom} bg="transparent">
          <GoogleSignInButton
            onPress={previewMode ? () => undefined : signInWithGoogle}
            loading={previewMode ? false : signingIn}
            disabled={previewMode || webAuthBlocked}
            variant="elevated"
          />

          {previewMode ? (
            <Text fontSize={13} color="$textMuted" style={{ textAlign: 'center' }} lineHeight={18}>
              Somente visualização — o login real fica no fluxo de entrada.
            </Text>
          ) : null}

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
    backgroundColor: '#000000',
  },
  content: {
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  statusBarFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    zIndex: 3,
  },
});

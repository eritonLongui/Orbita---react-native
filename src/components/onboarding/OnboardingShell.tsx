import React from 'react';
import { Pressable, ScrollView, StyleSheet, TextStyle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';
import { GradientText } from '../ui/GradientText';
import { TitleText } from '../ui/TitleText';
import { PrimaryButton } from '../ui/PrimaryButton';
import { ScreenWrapper } from '../ui/ScreenWrapper';
import {
  ONBOARDING_HEADER_FADE_HEIGHT,
  OnboardingHeaderZone,
} from './OnboardingHeaderZone';

const welcomeSubtitleStyle: TextStyle = {
  textAlign: 'center',
  color: themeColors.textMuted,
  maxWidth: 320,
};

interface OnboardingShellProps {
  step: number;
  subtitle: string;
  ctaLabel: string;
  onCta: () => void;
  title?: string;
  eyebrow?: string;
  gradientTitle?: string;
  hero?: React.ReactNode;
  children?: React.ReactNode;
  ctaLoading?: boolean;
  ctaDisabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
  onClose?: () => void;
  scrollable?: boolean;
  /** Página dentro do pager — sem fundo/header próprios */
  embedded?: boolean;
}

function OnboardingShellContent({
  title,
  eyebrow,
  gradientTitle,
  subtitle,
  hero,
  children,
  ctaLabel,
  onCta,
  ctaLoading,
  ctaDisabled,
  secondaryLabel,
  onSecondary,
  scrollable = false,
  embedded = false,
}: OnboardingShellProps) {
  const insets = useSafeAreaInsets();
  const isWelcomeStyle = !!gradientTitle;
  const footerBottom = Math.max(insets.bottom, 12);
  const useVerticalScroll = scrollable || (!embedded && !!children);
  /** Telas só com hero + texto (ex.: passo 1) — centraliza entre header e CTA. */
  const centerBody = !children && !scrollable;

  const body = (
    <YStack gap="$4" py="$2" {...(centerBody ? {} : { flex: 1 })}>
      {hero ? (
        <YStack items="center" py="$2">
          {hero}
        </YStack>
      ) : null}

      <YStack gap="$2" items="center" px="$1">
        {isWelcomeStyle ? (
          <YStack items="center" gap="$4">
            <YStack items="center" gap="$1.5">
              {eyebrow ? (
                <Text
                  fontSize={15}
                  fontWeight="600"
                  letterSpacing={1.5}
                  color="$textSecondary"
                  textTransform="uppercase"
                >
                  {eyebrow}
                </Text>
              ) : null}
              <GradientText fontSize={42} fontWeight="800" letterSpacing={3}>
                {gradientTitle}
              </GradientText>
            </YStack>
            <Text fontSize={17} lineHeight={26} style={welcomeSubtitleStyle}>
              {subtitle}
            </Text>
          </YStack>
        ) : (
          <>
            {title ? (
              <TitleText size="screen" style={{ textAlign: 'center' }}>
                {title}
              </TitleText>
            ) : null}
            <Text
              fontSize={15}
              color="$text"
              lineHeight={22}
              style={{ textAlign: 'center', maxWidth: 340 }}
            >
              {subtitle}
            </Text>
          </>
        )}
      </YStack>

      {children ? <YStack gap="$3">{children}</YStack> : null}
    </YStack>
  );

  const bodyContainerStyle = {
    flex: 1,
    marginTop: embedded ? 0 : -ONBOARDING_HEADER_FADE_HEIGHT,
  } as const;

  const bodyContentStyle = {
    flexGrow: 1,
    paddingTop: embedded ? ONBOARDING_HEADER_FADE_HEIGHT + 8 : ONBOARDING_HEADER_FADE_HEIGHT + 4,
    paddingBottom: 8,
  } as const;

  return (
    <>
      {useVerticalScroll ? (
        <ScrollView
          style={bodyContainerStyle}
          contentContainerStyle={bodyContentStyle}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          directionalLockEnabled={embedded}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={scrollable}
        >
          {body}
        </ScrollView>
      ) : (
        <View
          style={[
            bodyContainerStyle,
            bodyContentStyle,
            centerBody ? styles.centeredBody : undefined,
          ]}
        >
          {body}
        </View>
      )}

      <YStack gap="$3" pt="$2" pb={footerBottom}>
        <PrimaryButton
          label={ctaLabel}
          onPress={onCta}
          loading={ctaLoading}
          disabled={ctaDisabled}
        />
        {secondaryLabel && onSecondary ? (
          <Pressable onPress={onSecondary} accessibilityRole="button" disabled={ctaLoading}>
            <Text
              fontSize={15}
              fontWeight="600"
              color="$textMuted"
              style={{ textAlign: 'center' }}
            >
              {secondaryLabel}
            </Text>
          </Pressable>
        ) : null}
      </YStack>
    </>
  );
}

const styles = StyleSheet.create({
  centeredBody: {
    justifyContent: 'center',
  },
  embeddedPage: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: themeColors.bg,
  },
});

export function OnboardingShell({
  embedded = false,
  step,
  onClose,
  ...contentProps
}: OnboardingShellProps) {
  if (embedded) {
    return (
      <View style={styles.embeddedPage}>
        <OnboardingShellContent {...contentProps} embedded />
      </View>
    );
  }

  return (
    <ScreenWrapper scrollable={false} padded dockedFooter>
      <YStack flex={1}>
        <OnboardingHeaderZone step={step} onClose={onClose} />
        <OnboardingShellContent {...contentProps} embedded={false} />
      </YStack>
    </ScreenWrapper>
  );
}

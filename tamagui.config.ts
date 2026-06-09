import { defaultConfig } from '@tamagui/config/v5';
import { createAnimations } from '@tamagui/animations-moti';
import { createFont, createTamagui, createTokens } from 'tamagui';
import { bodyFontFamilies, titleFontFamilies } from './src/constants/typography';
import { themeColors } from './src/constants/theme';

const interFont = createFont({
  ...defaultConfig.fonts.body,
  family: 'Inter',
  face: {
    400: { normal: bodyFontFamilies.regular },
    500: { normal: bodyFontFamilies.medium },
    600: { normal: bodyFontFamilies.semibold },
    700: { normal: bodyFontFamilies.bold },
    800: { normal: bodyFontFamilies.bold },
  },
});

const spaceGroteskFont = createFont({
  ...defaultConfig.fonts.heading,
  family: 'SpaceGrotesk',
  face: {
    400: { normal: titleFontFamilies.regular },
    500: { normal: titleFontFamilies.medium },
    600: { normal: titleFontFamilies.semibold },
    700: { normal: titleFontFamilies.bold },
    800: { normal: titleFontFamilies.bold },
  },
});

const tokens = createTokens({
  color: {
    bg: themeColors.bg,
    bgSoft: themeColors.bgSoft,
    surface: themeColors.surface,
    surfaceMuted: themeColors.surfaceMuted,
    glass: themeColors.glass,
    glassBorder: themeColors.glassBorder,
    glassBorderStrong: themeColors.glassBorderStrong,
    glassButton: themeColors.glassButton,
    glassButtonDisabled: themeColors.glassButtonDisabled,
    text: themeColors.text,
    textMuted: themeColors.textMuted,
    textSecondary: themeColors.textSecondary,
    textSubtle: themeColors.textSubtle,
    textSupport: themeColors.textSupport,
    textSupportMuted: themeColors.textSupportMuted,
    textPlaceholder: themeColors.textPlaceholder,
    primary: themeColors.primary,
    primarySoft: themeColors.primarySoft,
    primaryGlow: themeColors.primaryGlow,
    primaryBg: themeColors.primaryBg,
    border: themeColors.border,
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    success: themeColors.success,
    warning: themeColors.warning,
    danger: themeColors.danger,
    dangerSoft: themeColors.dangerSoft,
    info: themeColors.info,
  },
  radius: {
    0: 0,
    1: 2,
    2: 4,
    3: 6,
    4: 8,
    true: 10,
    5: 10,
    6: 12,
    7: 14,
    8: 16,
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
  },
  space: defaultConfig.tokens.space,
  size: defaultConfig.tokens.size,
  zIndex: defaultConfig.tokens.zIndex,
});

const textColors = {
  text: tokens.color.text,
  textMuted: tokens.color.text,
  textSecondary: tokens.color.text,
  textSubtle: tokens.color.text,
  textSupport: tokens.color.text,
  textSupportMuted: tokens.color.text,
} as const;

const darkTheme = {
  fontFamily: '$body',
  background: tokens.color.bg,
  backgroundHover: tokens.color.bgSoft,
  backgroundPress: tokens.color.surfaceMuted,
  backgroundFocus: tokens.color.bgSoft,
  color: tokens.color.text,
  colorHover: tokens.color.text,
  colorPress: tokens.color.text,
  colorFocus: tokens.color.text,
  borderColor: tokens.color.border,
  borderColorHover: tokens.color.glassBorder,
  placeholderColor: tokens.color.text,
  shadowColor: tokens.color.shadowColor,
  success: tokens.color.success,
  warning: tokens.color.warning,
  danger: tokens.color.danger,
  info: tokens.color.info,
  ...textColors,
};

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  tokens,
  fonts: {
    body: interFont,
    heading: spaceGroteskFont,
  },
  themes: {
    dark: {
      ...defaultConfig.themes.dark,
      ...darkTheme,
    },
  },
  animations: createAnimations({
    fast: {
      type: 'spring',
      damping: 20,
      mass: 1.2,
      stiffness: 250,
    },
    medium: {
      type: 'spring',
      damping: 18,
      mass: 1,
      stiffness: 180,
    },
    slow: {
      type: 'spring',
      damping: 20,
      stiffness: 60,
    },
  }),
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

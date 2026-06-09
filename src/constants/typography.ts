/** Space Grotesk — títulos, cumprimento e destaques editoriais. */
export const titleFontFamilies = {
  regular: 'SpaceGrotesk_400Regular',
  medium: 'SpaceGrotesk_500Medium',
  semibold: 'SpaceGrotesk_600SemiBold',
  bold: 'SpaceGrotesk_700Bold',
} as const;

/** Família padrão para títulos (`TitleText`, `$heading` no Tamagui). */
export const titleFontFamily = titleFontFamilies.bold;

/** Inter — corpo, descrições e labels. */
export const bodyFontFamilies = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

/** Família padrão para texto de corpo (`$body` no Tamagui). */
export const bodyFontFamily = bodyFontFamilies.regular;

/** Letter-spacing padrão dos títulos (px). */
export const titleLetterSpacing = 1;

/** Escala de tamanhos para títulos — ajuste aqui para escalar globalmente. */
export const titleSizes = {
  hero: 42,
  screen: 28,
  card: 22,
  lg: 20,
  md: 18,
  sm: 16,
  section: 14,
  caption: 12,
} as const;

export type TitleSize = keyof typeof titleSizes;

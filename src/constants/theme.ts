export const themeColors = {
  bg: '#000000',
  bgSoft: '#0A0A0A',
  surface: '#111111',
  surfaceMuted: '#1A1A1A',
  /** Gradiente base — preto neutro, sem dominante azul */
  backgroundGradient: ['#000000', '#060606', '#0A0A0A'] as const,
  glass: 'rgba(8, 8, 8, 0.82)',
  /** Tab bar — translúcido para o blur aparecer */
  glassBar: 'rgba(6, 6, 6, 0.45)',
  glassBarBorder: 'rgba(255, 255, 255, 0.24)',
  glassBarHighlight: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.22)',
  glassBorderStrong: 'rgba(255, 255, 255, 0.34)',
  glassButton: 'rgba(22, 22, 22, 0.96)',
  glassButtonDisabled: 'rgba(14, 14, 14, 0.9)',
  /** Texto principal — corpo, subtítulos e apoio usam branco puro no dark */
  text: '#FFFFFF',
  textMuted: '#FFFFFF',
  textSecondary: '#FFFFFF',
  textSubtle: '#FFFFFF',
  textSupport: '#FFFFFF',
  textSupportMuted: '#FFFFFF',
  textPlaceholder: 'rgba(255, 255, 255, 0.55)',
  /** Destaque quente — login e microcopy editorial */
  accentWarm: '#B5A48A',
  primary: '#4B8BFF',
  primarySoft: '#6BA3FF',
  primaryGlow: '#7EC8FF',
  primaryBg: 'rgba(75, 139, 255, 0.14)',
  border: 'rgba(255, 255, 255, 0.22)',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  dangerSoft: '#FCA5A5',
  info: '#60A5FA',
  gradient: ['#2F5FD4', '#4B8BFF', '#6EC4FF'] as const,
  gradientVivid: ['#1A52E8', '#3B8BFF', '#5CB4FF'] as const,
  gradientMuted: ['#1A2744', '#243B5C', '#2A4A6E'] as const,
  radarGrid: 'rgba(255, 255, 255, 0.12)',
  radarFill: 'rgba(75, 139, 255, 0.28)',
  radarStroke: '#4B8BFF',
} as const;

/** Espaço extra no rodapé para a tab bar flutuante (barra + gap, sem safe area) */
export const TAB_BAR_HEIGHT = 68;

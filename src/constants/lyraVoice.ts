import { LyraVoiceAccent, LyraVoiceStyle, LyraVoiceTone, Profile } from '../types';

export interface LyraVoiceStylePreset {
  key: LyraVoiceStyle;
  label: string;
  description: string;
  openAiVoice: string;
  instructions: string;
  speechRate: number;
}

export interface LyraVoiceAccentPreset {
  key: LyraVoiceAccent;
  label: string;
  description: string;
  instructions: string;
}

export interface LyraVoiceConfig {
  style: LyraVoiceStyle;
  accent: LyraVoiceAccent;
  openAiVoice: string;
  instructions: string;
  speechRate: number;
}

export const LYRA_VOICE_STYLE_PRESETS: LyraVoiceStylePreset[] = [
  {
    key: 'calm',
    label: 'Calma',
    description: 'Suave e acolhedora',
    openAiVoice: 'nova',
    instructions: 'Fale em português brasileiro com tom calmo, claro e acolhedor.',
    speechRate: 0.92,
  },
  {
    key: 'neutral',
    label: 'Neutra',
    description: 'Equilibrada e direta',
    openAiVoice: 'alloy',
    instructions: 'Fale em português brasileiro com tom neutro, claro e objetivo.',
    speechRate: 0.96,
  },
  {
    key: 'energetic',
    label: 'Energética',
    description: 'Animada e motivadora',
    openAiVoice: 'shimmer',
    instructions: 'Fale em português brasileiro com energia leve e tom motivador.',
    speechRate: 1.02,
  },
  {
    key: 'young',
    label: 'Jovem',
    description: 'Leve e contemporânea',
    openAiVoice: 'coral',
    instructions:
      'Fale em português brasileiro com tom jovem, leve e amigável, como uma assistente moderna.',
    speechRate: 1.04,
  },
  {
    key: 'formal',
    label: 'Formal',
    description: 'Profissional e precisa',
    openAiVoice: 'onyx',
    instructions:
      'Fale em português brasileiro com tom formal, profissional e bem articulado.',
    speechRate: 0.9,
  },
  {
    key: 'mature',
    label: 'Madura',
    description: 'Experiente e serena',
    openAiVoice: 'sage',
    instructions:
      'Fale em português brasileiro com tom maduro, sereno e confiável, sem pressa.',
    speechRate: 0.88,
  },
];

export const LYRA_VOICE_ACCENT_PRESETS: LyraVoiceAccentPreset[] = [
  {
    key: 'none',
    label: 'Padrão',
    description: 'Sem coloração regional',
    instructions: '',
  },
  {
    key: 'paulista',
    label: 'Paulista',
    description: 'Sotaque de São Paulo',
    instructions:
      'Aplique sotaque paulista leve: entonação urbana de São Paulo, "r" suave e ritmo ágil, sem caricatura.',
  },
  {
    key: 'carioca',
    label: 'Carioca',
    description: 'Sotaque do Rio de Janeiro',
    instructions:
      'Aplique sotaque carioca leve: entonação descontraída do Rio, vogais abertas e tom caloroso, sem caricatura.',
  },
  {
    key: 'nordestino',
    label: 'Nordestino',
    description: 'Sotaque do Nordeste',
    instructions:
      'Aplique sotaque nordestino brasileiro perceptível: cadência melodiosa do Nordeste, vogais mais abertas (ex.: "o" virando "ô"), entonação calorosa e expressiva típica de Pernambuco/Bahia, ritmo levemente mais cantado. Mantenha clareza e naturalidade, sem exagero cômico.',
  },
  {
    key: 'sulista',
    label: 'Sulista',
    description: 'Sotaque do Sul',
    instructions:
      'Aplique sotaque sulista leve: entonação pausada do Sul, vogais mais fechadas e tom acolhedor, sem caricatura.',
  },
  {
    key: 'mineira',
    label: 'Mineira',
    description: 'Sotaque de Minas Gerais',
    instructions:
      'Aplique sotaque mineiro leve: entonação gentil de Minas, ritmo tranquilo e proximidade no tom, sem caricatura.',
  },
];

const STYLE_KEYS = new Set(LYRA_VOICE_STYLE_PRESETS.map((preset) => preset.key));
const ACCENT_KEYS = new Set(
  LYRA_VOICE_ACCENT_PRESETS.filter((preset) => preset.key !== 'none').map((preset) => preset.key)
);

function resolveFromLegacyTone(tone?: LyraVoiceTone | string | null): {
  style: LyraVoiceStyle;
  accent: LyraVoiceAccent;
} {
  if (!tone) {
    return { style: 'calm', accent: 'none' };
  }

  if (STYLE_KEYS.has(tone as LyraVoiceStyle)) {
    return { style: tone as LyraVoiceStyle, accent: 'none' };
  }

  if (ACCENT_KEYS.has(tone as LyraVoiceAccent)) {
    return { style: 'calm', accent: tone as LyraVoiceAccent };
  }

  return { style: 'calm', accent: 'none' };
}

function isValidStyle(value?: string | null): value is LyraVoiceStyle {
  return !!value && STYLE_KEYS.has(value as LyraVoiceStyle);
}

function isValidAccent(value?: string | null): value is LyraVoiceAccent {
  return value === 'none' || (!!value && ACCENT_KEYS.has(value as LyraVoiceAccent));
}

export function getLyraVoiceConfig(
  style?: LyraVoiceStyle | string | null,
  accent?: LyraVoiceAccent | string | null,
  legacyTone?: LyraVoiceTone | string | null
): LyraVoiceConfig {
  let resolvedStyle = isValidStyle(style) ? style : null;
  let resolvedAccent = isValidAccent(accent) ? accent : null;

  if (!resolvedStyle && !resolvedAccent) {
    const legacy = resolveFromLegacyTone(legacyTone);
    resolvedStyle = legacy.style;
    resolvedAccent = legacy.accent;
  }

  const stylePreset =
    LYRA_VOICE_STYLE_PRESETS.find((preset) => preset.key === (resolvedStyle ?? 'calm')) ??
    LYRA_VOICE_STYLE_PRESETS[0];

  const accentKey = resolvedAccent ?? 'none';
  const accentPreset =
    accentKey === 'none'
      ? null
      : (LYRA_VOICE_ACCENT_PRESETS.find((preset) => preset.key === accentKey) ?? null);

  const instructions = accentPreset?.instructions
    ? `${stylePreset.instructions} ${accentPreset.instructions}`
    : stylePreset.instructions;

  return {
    style: stylePreset.key,
    accent: accentPreset?.key ?? 'none',
    openAiVoice: stylePreset.openAiVoice,
    instructions,
    speechRate: stylePreset.speechRate,
  };
}

/** Lê estilo/sotaque do profile (preferences tem prioridade sobre colunas). */
export function getLyraVoiceConfigFromProfile(profile?: Profile | null): LyraVoiceConfig {
  const prefs = (profile?.preferences ?? {}) as Record<string, unknown>;
  const style =
    (prefs.lyra_voice_style as LyraVoiceStyle | undefined) ?? profile?.lyra_voice_style;
  const accent =
    (prefs.lyra_voice_accent as LyraVoiceAccent | undefined) ?? profile?.lyra_voice_accent;

  return getLyraVoiceConfig(style, accent, profile?.lyra_voice_tone);
}

/** @deprecated Use getLyraVoiceConfig */
export function getLyraVoicePreset(tone?: LyraVoiceTone | string | null) {
  const config = getLyraVoiceConfig(null, null, tone);
  const stylePreset = LYRA_VOICE_STYLE_PRESETS.find((preset) => preset.key === config.style)!;
  return {
    key: tone ?? config.style,
    label: stylePreset.label,
    description: stylePreset.description,
    group: 'estilo' as const,
    openAiVoice: config.openAiVoice,
    instructions: config.instructions,
    speechRate: config.speechRate,
  };
}

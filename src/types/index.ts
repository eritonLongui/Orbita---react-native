export type PillarType = 'sleep' | 'movement' | 'routine' | 'nutrition' | 'leisure';

export type OrbitAreaStatus = 'excellent' | 'balanced' | 'oscillating' | 'attention';

export type MissionHeroState = 'excellent' | 'stable' | 'attention' | 'critical';

/** @deprecated Use LyraVoiceStyle + LyraVoiceAccent */
export type LyraVoiceTone =
  | 'calm'
  | 'neutral'
  | 'energetic'
  | 'young'
  | 'formal'
  | 'mature'
  | 'paulista'
  | 'carioca'
  | 'nordestino'
  | 'sulista'
  | 'mineira';

export type LyraVoiceStyle =
  | 'calm'
  | 'neutral'
  | 'energetic'
  | 'young'
  | 'formal'
  | 'mature';

export type LyraVoiceAccent =
  | 'none'
  | 'paulista'
  | 'carioca'
  | 'nordestino'
  | 'sulista'
  | 'mineira';

export type EvolutionPeriod = '7d' | '30d' | '90d' | '12m';

export type StabilityTrend = 'stable' | 'improving' | 'attention';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  voice_enabled: boolean;
  notification_enabled: boolean;
  lyra_voice_tone?: LyraVoiceTone;
  lyra_voice_style?: LyraVoiceStyle;
  lyra_voice_accent?: LyraVoiceAccent;
  preferences?: Record<string, unknown>;
  created_at: string;
}

export interface OrbitAreaSummary {
  type: PillarType;
  label: string;
  score: number;
  status: OrbitAreaStatus;
}

export interface OrbitAreaDetail extends OrbitAreaSummary {
  description: string;
  summary: string;
  recommendation: string;
  history: number[];
}

export interface PillarSummary {
  type: PillarType;
  label: string;
  score: number;
  status: OrbitAreaStatus;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  channel: 'voice' | 'text';
  created_at: string;
}

export interface LyraChatResponse {
  transcript: string;
  reply: string;
  audioBase64?: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
}

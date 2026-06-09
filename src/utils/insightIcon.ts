import {
  Clock,
  Drop,
  GameController,
  Heart,
  type Icon as PhosphorIcon,
  Lightbulb,
  Moon,
  PersonSimpleRun,
  TrendUp,
  Warning,
} from 'phosphor-react-native';

const ICON_RULES: { keywords: string[]; icon: PhosphorIcon }[] = [
  { keywords: ['sono', 'descanso', 'dormir', 'noite', 'cama'], icon: Moon },
  { keywords: ['energia', 'movimento', 'caminh', 'exerc', 'ativo'], icon: PersonSimpleRun },
  { keywords: ['rotina', 'ritmo', 'consist', 'horário', 'pausa'], icon: Clock },
  { keywords: ['nutri', 'aliment', 'hidrata', 'água', 'refei'], icon: Drop },
  { keywords: ['bem-estar', 'lazer', 'mental', 'hobby'], icon: GameController },
  { keywords: ['melhor', 'evolui', 'subiu', 'progresso', 'tendência'], icon: TrendUp },
  { keywords: ['atenção', 'cuidado', 'oscil', 'caiu', 'pior'], icon: Warning },
  { keywords: ['equilíbrio', 'correlacion', 'padrão'], icon: Heart },
];

const FALLBACK_ICONS: PhosphorIcon[] = [Lightbulb, TrendUp, Heart, Moon, Clock];

export function getInsightIcon(text: string, index = 0): PhosphorIcon {
  const lower = text.toLowerCase();
  for (const rule of ICON_RULES) {
    if (rule.keywords.some((keyword) => lower.includes(keyword))) {
      return rule.icon;
    }
  }
  return FALLBACK_ICONS[index % FALLBACK_ICONS.length];
}

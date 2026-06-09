export const ONBOARDING_TOTAL_STEPS = 4;

/** Metáfora central do produto — reforçada no onboarding */
export const ORBITA_TRIPULACAO_LABEL = 'Sua tripulação';

export const ONBOARDING_VALUE_PROPOSITION =
  'A Órbita é um espaço dedicado ao seu bem-estar emocional — onde cada tripulante representa uma dimensão importante da sua vida.';

export const ONBOARDING_COPY = {
  welcome: {
    eyebrow: ORBITA_TRIPULACAO_LABEL,
    title: 'ORBITA',
    tagline: 'SEU CENTRO DE COMANDO EMOCIONAL',
    subtitle: ONBOARDING_VALUE_PROPOSITION,
    cta: 'Continuar',
  },
  loop: {
    step: 1,
    title: 'Toda jornada precisa de uma tripulação',
    subtitle:
      'A Órbita é um espaço dedicado ao seu bem-estar emocional, onde cada tripulante representa uma dimensão importante da sua vida. Juntos, eles ajudam você a desenvolver mais consciência, equilíbrio e qualidade de vida.',
    cta: 'Continuar',
  },
  areas: {
    step: 2,
    title: 'Sua tripulação',
    subtitle:
      'Cinco dimensões da sua vida na mesma órbita. Juntas, desenvolvem consciência, equilíbrio e qualidade de vida.',
    cta: 'Próximo',
  },
  lyra: {
    step: 3,
    title: 'Lyra, a inteligência da nave',
    subtitle:
      'Ao seu lado está Lyra, a inteligência da nave, pronta para acompanhar sua trajetória, registrar seus progressos e oferecer suporte personalizado durante a missão.',
    cta: 'Continuar',
    bullets: [
      'Acompanha sua trajetória em cada dia da missão',
      'Registra seus progressos ao longo da viagem',
      'Conversa por voz ou texto — no seu ritmo',
    ],
  },
  setup: {
    step: 4,
    title: 'Conecte-se à sua tripulação',
    subtitle: 'Confirme seus dados para personalizar sua missão e seguir viagem.',
    focusLabel: 'Quais dimensões quer acompanhar com mais atenção? (opcional)',
    terms:
      'Concordo com os termos e entendo que a Orbita não substitui apoio profissional.',
    cta: 'Siga viagem',
  },
} as const;

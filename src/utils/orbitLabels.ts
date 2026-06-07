import { OrbitAreaStatus } from '../types';

export function orbitScoreToHeadline(score: number): string {
  if (score >= 80) return 'Ótima forma';
  if (score >= 65) return 'Estável';
  if (score >= 45) return 'Oscilando';
  return 'Precisa de cuidado';
}

export function orbitStatusDescription(status: OrbitAreaStatus): string {
  switch (status) {
    case 'excellent':
      return 'Continue no mesmo ritmo.';
    case 'balanced':
      return 'Ritmo consistente, sem grandes quedas.';
    case 'oscillating':
      return 'Houve altos e baixos nos últimos dias.';
    case 'attention':
      return 'Priorize pequenas ações nesta área hoje.';
  }
}

export function weeklyTrendLabel(delta: number): string {
  if (delta > 5) return 'Melhorou esta semana';
  if (delta > 0) return 'Leve melhora';
  if (delta < -5) return 'Caiu esta semana';
  if (delta < 0) return 'Leve queda';
  return 'Manteve o ritmo';
}

export function weeklyTrendDetail(delta: number): string {
  if (delta === 0) return 'Sem mudanças relevantes';
  const dir = delta > 0 ? 'acima' : 'abaixo';
  return `${Math.abs(delta)}% ${dir} da semana passada`;
}

/** Título do card "Foco de hoje" — frase direta, sem template quebrado tipo "X está atenção". */
export function areaStatusPhrase(label: string, status: OrbitAreaStatus): string {
  switch (status) {
    case 'excellent':
      return `${label} em ótima forma`;
    case 'balanced':
      return `${label} em equilíbrio`;
    case 'oscillating':
      return `${label} oscilando`;
    case 'attention':
      return `${label} precisa de atenção`;
  }
}

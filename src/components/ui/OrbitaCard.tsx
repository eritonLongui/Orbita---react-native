import React from 'react';
import { GlassCard } from './GlassCard';

interface OrbitaCardProps {
  children: React.ReactNode;
  highlighted?: boolean;
  subtle?: boolean;
}

export function OrbitaCard({ children, highlighted = false, subtle = false }: OrbitaCardProps) {
  return <GlassCard highlighted={highlighted} subtle={subtle} padding>{children}</GlassCard>;
}

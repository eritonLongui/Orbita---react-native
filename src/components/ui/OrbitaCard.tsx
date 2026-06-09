import React from 'react';
import { GlassCard } from './GlassCard';

interface OrbitaCardProps {
  children: React.ReactNode;
  highlighted?: boolean;
  subtle?: boolean;
  relaxed?: boolean;
}

export function OrbitaCard({
  children,
  highlighted = false,
  subtle = false,
  relaxed = false,
}: OrbitaCardProps) {
  return (
    <GlassCard highlighted={highlighted} subtle={subtle} padding={relaxed ? 'relaxed' : true}>
      {children}
    </GlassCard>
  );
}

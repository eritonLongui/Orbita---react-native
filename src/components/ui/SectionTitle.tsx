import React from 'react';
import { TitleText } from './TitleText';

interface SectionTitleProps {
  children: string;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <TitleText size="section">
      {children.toUpperCase()}
    </TitleText>
  );
}

import React from 'react';
import { Text } from 'tamagui';

interface SectionTitleProps {
  children: string;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <Text fontSize={14} fontWeight="800" letterSpacing={1.2} color="$text">
      {children.toUpperCase()}
    </Text>
  );
}

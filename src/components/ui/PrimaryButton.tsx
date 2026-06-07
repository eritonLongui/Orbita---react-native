import React from 'react';
import { GlassButton } from './GlassButton';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
}

export function PrimaryButton(props: PrimaryButtonProps) {
  return <GlassButton {...props} />;
}

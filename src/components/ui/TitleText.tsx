import React from 'react';
import { Text, type TextProps } from 'tamagui';
import { titleLetterSpacing, titleSizes, type TitleSize } from '../../constants/typography';

type TitleWeight = '400' | '500' | '600' | '700' | '800';

interface TitleTextProps extends TextProps {
  children: React.ReactNode;
  /** Token da escala — ver `titleSizes` em typography.ts */
  size?: TitleSize;
  weight?: TitleWeight;
}

const weightMap: Record<TitleWeight, TitleWeight> = {
  '400': '400',
  '500': '500',
  '600': '600',
  '700': '700',
  '800': '800',
};

export function TitleText({
  children,
  size = 'md',
  weight = '700',
  fontSize,
  letterSpacing,
  ...props
}: TitleTextProps) {
  return (
    <Text
      fontFamily="$heading"
      fontWeight={weightMap[weight]}
      fontSize={fontSize ?? titleSizes[size]}
      letterSpacing={letterSpacing ?? titleLetterSpacing}
      color="$text"
      {...props}
    >
      {children}
    </Text>
  );
}

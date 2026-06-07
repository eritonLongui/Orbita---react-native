import React from 'react';
import { Spinner, Button, Text, XStack } from 'tamagui';
import { themeColors } from '../../constants/theme';
import { GoogleGIcon } from './GoogleGIcon';

type Props = {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'expedition' | 'elevated';
};

export function GoogleSignInButton({
  onPress,
  disabled,
  loading,
  variant = 'default',
}: Props) {
  const isExpedition = variant === 'expedition';
  const isElevated = variant === 'elevated';

  return (
    <Button
      height={isExpedition || isElevated ? 54 : 52}
      rounded="$md"
      bg={isElevated ? themeColors.surfaceMuted : isExpedition ? themeColors.surfaceMuted : '$glass'}
      borderWidth={1}
      borderColor={
        isElevated ? 'rgba(255, 255, 255, 0.2)' : isExpedition ? 'rgba(255, 255, 255, 0.1)' : '$glassBorder'
      }
      pressStyle={{ opacity: 0.9, scale: 0.98 }}
      onPress={onPress}
      disabled={disabled || loading}
      width="100%"
      px="$5"
    >
      <XStack items="center" justify="center" gap="$2.5">
        {loading ? (
          <Spinner size="small" color="$text" />
        ) : isExpedition ? null : (
          <GoogleGIcon size={22} />
        )}
        <Text
          color="$text"
          fontWeight={isExpedition ? '500' : '600'}
          fontSize={isExpedition ? 14 : 16}
          letterSpacing={isExpedition ? 2 : 0}
          textTransform={isExpedition ? 'uppercase' : 'none'}
        >
          {isExpedition ? 'Iniciar expedição' : 'Continuar com Google'}
        </Text>
        {!loading && isExpedition ? <GoogleGIcon size={18} /> : null}
      </XStack>
    </Button>
  );
}

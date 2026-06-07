import React from 'react';
import { Modal, Pressable } from 'react-native';
import { Text, YStack } from 'tamagui';
import { PrimaryButton } from '../ui/PrimaryButton';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancelar',
  destructive = false,
  onConfirm,
  onCancel,
  loading,
  children,
}: ConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(19, 18, 23, 0.45)',
          justifyContent: 'center',
          padding: 24,
        }}
        onPress={onCancel}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <YStack bg="$surface" rounded="$lg" p="$5" gap="$4" borderWidth={1} borderColor="$border">
            <Text fontSize={20} fontWeight="800" color="$text">
              {title}
            </Text>
            <Text fontSize={15} color="$textMuted" lineHeight={22}>
              {message}
            </Text>
            {children}
            <YStack gap="$2">
              <PrimaryButton
                label={confirmLabel}
                onPress={onConfirm}
                loading={loading}
                variant={destructive ? 'primary' : 'primary'}
              />
              <PrimaryButton label={cancelLabel} onPress={onCancel} variant="outline" />
            </YStack>
          </YStack>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

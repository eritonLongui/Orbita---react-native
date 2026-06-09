import { Bell, Microphone } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { OnboardingPreviewCloseButton } from '../../components/onboarding/OnboardingPreviewCloseButton';
import { OrbitaCard } from '../../components/ui/OrbitaCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { themeColors } from '../../constants/theme';
import {
  requestMicrophonePermissionIfNeeded,
  requestNotificationPermissionIfNeeded,
  requestOnboardingPermissions,
} from '../../services/permissions';

interface PermissionsOnboardingScreenProps {
  onComplete: () => void;
  onClose?: () => void;
}

interface PermissionItemProps {
  icon: React.ComponentType<{ size: number; color: string; weight?: 'regular' | 'duotone' }>;
  title: string;
  description: string;
  onPress: () => void;
  loading?: boolean;
}

function PermissionItem({ icon: Icon, title, description, onPress, loading }: PermissionItemProps) {
  return (
    <Pressable onPress={onPress} disabled={loading} accessibilityRole="button">
      <OrbitaCard>
        <XStack gap="$3" items="center">
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: themeColors.glassButton,
              borderWidth: 1,
              borderColor: themeColors.glassBorder,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={24} color={themeColors.text} weight="regular" />
          </View>
          <YStack flex={1} gap="$1">
            <Text fontSize={15} fontWeight="700" color="$text">
              {title}
            </Text>
            <Text fontSize={13} color="$textMuted" lineHeight={18}>
              {description}
            </Text>
            <Text fontSize={12} fontWeight="600" color="$primary" mt="$1">
              Toque para abrir permissão do sistema
            </Text>
          </YStack>
        </XStack>
      </OrbitaCard>
    </Pressable>
  );
}

export function PermissionsOnboardingScreen({
  onComplete,
  onClose,
}: PermissionsOnboardingScreenProps) {
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingMic, setLoadingMic] = useState(false);
  const [loadingNotif, setLoadingNotif] = useState(false);

  const busy = loadingAll || loadingMic || loadingNotif;

  const handleAllowAll = async () => {
    setLoadingAll(true);
    try {
      await requestOnboardingPermissions();
      onComplete();
    } finally {
      setLoadingAll(false);
    }
  };

  const handleMic = async () => {
    setLoadingMic(true);
    try {
      await requestMicrophonePermissionIfNeeded();
    } finally {
      setLoadingMic(false);
    }
  };

  const handleNotifications = async () => {
    setLoadingNotif(true);
    try {
      await requestNotificationPermissionIfNeeded();
    } finally {
      setLoadingNotif(false);
    }
  };

  return (
    <ScreenWrapper scrollable={false}>
      <YStack flex={1} justify="center" gap="$5" py="$4">
        {onClose ? <OnboardingPreviewCloseButton onClose={onClose} /> : null}
        <YStack gap="$2" items="center" px="$2">
          <Text fontSize={28} fontWeight="800" color="$text" style={{ textAlign: 'center' }}>
            Permissões
          </Text>
          <Text
            fontSize={15}
            color="$textMuted"
            lineHeight={22}
            style={{ textAlign: 'center', maxWidth: 320 }}
          >
            Toque em cada item ou use o botão abaixo — o celular abrirá o pedido oficial de
            permissão.
          </Text>
        </YStack>

        <YStack gap="$3" width="100%">
          <PermissionItem
            icon={Microphone}
            title="Fale com a Lyra"
            description="Conte como foi seu dia em voz alta. O modo texto continua disponível."
            onPress={() => void handleMic()}
            loading={busy}
          />
          <PermissionItem
            icon={Bell}
            title="Lembrete do check-in"
            description="Um aviso no horário certo para manter sua órbita em dia."
            onPress={() => void handleNotifications()}
            loading={busy}
          />
        </YStack>

        <YStack gap="$3" width="100%">
          <PrimaryButton
            label="Permitir e continuar"
            onPress={() => void handleAllowAll()}
            loading={loadingAll}
            disabled={busy && !loadingAll}
          />
          <Pressable onPress={onComplete} accessibilityRole="button" disabled={busy}>
            <Text fontSize={15} fontWeight="600" color="$textMuted" style={{ textAlign: 'center' }}>
              Agora não
            </Text>
          </Pressable>
        </YStack>
      </YStack>
    </ScreenWrapper>
  );
}

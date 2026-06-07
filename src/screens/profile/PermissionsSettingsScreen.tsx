import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { OrbitaSwitch } from '../../components/ui/OrbitaSwitch';
import { SettingsBackHeader } from '../../components/settings/SettingsBackHeader';
import { OrbitaCard } from '../../components/ui/OrbitaCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useAuth } from '../../providers/AuthProvider';
import { updatePreferences } from '../../services/profile';
import {
  getMicrophonePermissionStatus,
  requestMicrophonePermission,
} from '../../services/voice';

function statusLabel(status: string): string {
  switch (status) {
    case 'granted':
      return 'Permitido';
    case 'denied':
      return 'Negado';
    default:
      return 'Não definido';
  }
}

export function PermissionsSettingsScreen() {
  const { profile, user, refreshProfile } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    profile?.notification_enabled ?? true
  );
  const [micStatus, setMicStatus] = useState('undetermined');
  const [notifStatus, setNotifStatus] = useState('undetermined');

  const refreshStatuses = useCallback(async () => {
    setMicStatus(await getMicrophonePermissionStatus());
    const { status } = await Notifications.getPermissionsAsync();
    setNotifStatus(status);
  }, []);

  useEffect(() => {
    refreshStatuses();
  }, [refreshStatuses]);

  const handleNotifToggle = async (checked: boolean) => {
    setNotificationsEnabled(checked);
    if (!user) return;
    await updatePreferences(user.uid, { notification_enabled: checked });
    await refreshProfile();
    if (checked) {
      await Notifications.requestPermissionsAsync();
      await refreshStatuses();
    }
  };

  const handleMicRequest = async () => {
    await requestMicrophonePermission();
    await refreshStatuses();
  };

  const openSystemSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  return (
    <ScreenWrapper tabBarOffset>
      <SettingsBackHeader title="Permissões" />

      <YStack gap="$4">
        <OrbitaCard>
          <YStack gap="$3">
            <XStack justify="space-between" items="center">
              <Text fontSize={15} fontWeight="700" color="$text">
                Microfone
              </Text>
              <Text fontSize={14} fontWeight="600" color="$textMuted">
                {statusLabel(micStatus)}
              </Text>
            </XStack>
            <Text fontSize={13} color="$textMuted" lineHeight={18}>
              Necessário para conversar com a Lyra por voz.
            </Text>
            {micStatus !== 'granted' ? (
              <PrimaryButton label="Permitir microfone" onPress={handleMicRequest} />
            ) : null}
          </YStack>
        </OrbitaCard>

        <OrbitaCard>
          <YStack gap="$3">
            <XStack justify="space-between" items="center">
              <Text fontSize={15} fontWeight="700" color="$text">
                Notificações
              </Text>
              <Text fontSize={14} fontWeight="600" color="$textMuted">
                {statusLabel(notifStatus)}
              </Text>
            </XStack>
            <Text fontSize={13} color="$textMuted" lineHeight={18}>
              Lembretes, check-ins e insights da sua missão.
            </Text>
            <XStack justify="space-between" items="center">
              <Text fontSize={14} color="$textMuted">
                Receber notificações
              </Text>
              <OrbitaSwitch
                checked={notificationsEnabled}
                onCheckedChange={handleNotifToggle}
              />
            </XStack>
          </YStack>
        </OrbitaCard>

        <PrimaryButton label="Abrir ajustes do sistema" onPress={openSystemSettings} variant="outline" />
      </YStack>
    </ScreenWrapper>
  );
}

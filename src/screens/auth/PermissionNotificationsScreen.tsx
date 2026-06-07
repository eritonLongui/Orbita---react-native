import * as Notifications from 'expo-notifications';
import React, { useState } from 'react';
import { PermissionCard } from '../../components/orbit';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

interface PermissionNotificationsScreenProps {
  onComplete: () => void;
}

export function PermissionNotificationsScreen({ onComplete }: PermissionNotificationsScreenProps) {
  const [loading, setLoading] = useState(false);

  const handleAllow = async () => {
    setLoading(true);
    await Notifications.requestPermissionsAsync();
    setLoading(false);
    onComplete();
  };

  return (
    <ScreenWrapper scrollable={false}>
      <PermissionCard
        title="Notificações"
        message="Lembretes e insights da sua missão."
        onAllow={handleAllow}
        loading={loading}
      />
    </ScreenWrapper>
  );
}

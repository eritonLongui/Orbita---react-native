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
        title="Lembrete gentil"
        context="Um ritmo leve funciona melhor com um pequeno empurrão no horário certo."
        message="Notificações avisam na hora do seu check-in com a Lyra. Você pode mudar isso depois no perfil."
        onAllow={handleAllow}
        onSkip={onComplete}
        skipLabel="Agora não"
        loading={loading}
      />
    </ScreenWrapper>
  );
}

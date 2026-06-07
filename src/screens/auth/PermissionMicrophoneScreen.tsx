import React, { useState } from 'react';
import { PermissionCard } from '../../components/orbit';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { requestMicrophonePermission } from '../../services/voice';

interface PermissionMicrophoneScreenProps {
  onContinue: () => void;
}

export function PermissionMicrophoneScreen({ onContinue }: PermissionMicrophoneScreenProps) {
  const [loading, setLoading] = useState(false);

  const handleAllow = async () => {
    setLoading(true);
    await requestMicrophonePermission();
    setLoading(false);
    onContinue();
  };

  return (
    <ScreenWrapper scrollable={false}>
      <PermissionCard
        title="Microfone"
        message="Necessário para conversar com a Lyra por voz."
        onAllow={handleAllow}
        loading={loading}
      />
    </ScreenWrapper>
  );
}

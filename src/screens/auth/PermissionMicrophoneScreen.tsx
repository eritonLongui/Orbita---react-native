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
        title="Fale com a Lyra"
        context="A voz torna o check-in mais natural — como conversar com uma coach."
        message="O microfone permite contar como foi seu dia em voz alta. Você também pode usar o modo texto depois."
        onAllow={handleAllow}
        onSkip={onContinue}
        skipLabel="Continuar sem voz"
        loading={loading}
      />
    </ScreenWrapper>
  );
}

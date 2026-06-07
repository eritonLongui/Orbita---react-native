import React, { useState } from 'react';
import { Text, YStack } from 'tamagui';
import { LyraChatInput } from '../../components/lyra/LyraChatInput';
import { LyraMode, LyraModeTabs } from '../../components/lyra/LyraModeTabs';
import { LyraOrb } from '../../components/lyra/LyraOrb';
import { LyraTextChat } from '../../components/lyra/LyraTextChat';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useLyraAssistant } from '../../hooks/useLyraAssistant';
import { useLyraTextChat } from '../../hooks/useLyraTextChat';

function StatusTitle({ state }: { state: string }) {
  return <>Como posso ajudar?</>;
}

function VoiceStatusHint({ state }: { state: string }) {
  if (state === 'recording') return null;
  
  let text = '';
  if (state === 'processing') text = 'Processando...';
  if (state === 'responding') text = 'Respondendo...';
  
  if (!text) return null;

  return (
    <Text
      fontSize={13}
      fontWeight="500"
      color="$textMuted"
      style={{ textAlign: 'center' }}
      mt="$2"
    >
      {text}
    </Text>
  );
}

function VoiceHint({ state, busy }: { state: string; busy: boolean }) {
  if (busy || state === 'recording') return null;

  return (
    <Text
      fontSize={11}
      fontWeight="700"
      color="$textMuted"
      style={{ textAlign: 'center', letterSpacing: 1.4 }}
      mt="$4"
    >
      TOQUE PARA FALAR
    </Text>
  );
}

export function LyraScreen() {
  const [mode, setMode] = useState<LyraMode>('voice');
  const [textInput, setTextInput] = useState('');
  const [pendingImage, setPendingImage] = useState<{
    uri: string;
    base64: string;
    mimeType: string;
  } | null>(null);
  const { state, error, toggleRecording, cancelSession } = useLyraAssistant();
  const {
    messages,
    isLoading: isTextLoading,
    error: textError,
    sendMessage: sendTextMessage,
    pickImage,
  } = useLyraTextChat();

  const isLyraBusy = state === 'processing' || state === 'responding';
  const canTapVoice = mode === 'voice' && !isLyraBusy;
  const isTextBusy = mode === 'text' && isTextLoading;

  const handleModeChange = (next: LyraMode) => {
    if (next === mode) return;
    if (state === 'recording' || state === 'processing' || state === 'responding') {
      cancelSession();
    }
    setMode(next);
  };

  const canSendText = !!textInput.trim() || !!pendingImage;

  const handleSendText = async () => {
    if (!canSendText || isTextBusy) return;
    const text = textInput;
    const image = pendingImage ?? undefined;
    setTextInput('');
    setPendingImage(null);
    await sendTextMessage(text, image);
  };

  const handlePickImage = async () => {
    if (isTextBusy) return;
    const image = await pickImage();
    if (image) setPendingImage(image);
  };

  return (
    <ScreenWrapper scrollable={false} tabBarOffset>
      <YStack flex={1}>
        <YStack items="center" gap="$2" mb="$6">
          <Text fontSize={14} color="$textMuted">
            Lyra
          </Text>
          <Text fontSize={22} fontWeight="800" color="$text" style={{ textAlign: 'center' }}>
            <StatusTitle state={state} />
          </Text>
        </YStack>

        <LyraModeTabs mode={mode} onModeChange={handleModeChange} />

        {mode === 'voice' ? (
          <>
            {error ? (
              <Text fontSize={13} color="$danger" style={{ textAlign: 'center' }} mt="$3">
                {error}
              </Text>
            ) : null}

            <YStack flex={1} justify="center" items="center" gap="$1" mt="$4">
              <LyraOrb
                state={state}
                pressable={canTapVoice}
                onPress={canTapVoice ? toggleRecording : undefined}
              />
              <VoiceStatusHint state={state} />
              <VoiceHint state={state} busy={isLyraBusy} />
            </YStack>
          </>
        ) : (
          <>
            {textError ? (
              <Text fontSize={13} color="$danger" style={{ textAlign: 'center' }} mt="$3">
                {textError}
              </Text>
            ) : null}

            <LyraTextChat messages={messages} isLoading={isTextLoading} />

            <LyraChatInput
              value={textInput}
              onChangeText={setTextInput}
              onSend={handleSendText}
              onPickImage={handlePickImage}
              pendingImageUri={pendingImage?.uri}
              onClearImage={() => setPendingImage(null)}
              disabled={isTextBusy}
              canSend={canSendText}
            />
          </>
        )}
      </YStack>
    </ScreenWrapper>
  );
}


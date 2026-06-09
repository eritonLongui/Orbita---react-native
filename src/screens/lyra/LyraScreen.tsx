import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Text, YStack } from 'tamagui';
import { ConfirmationModal } from '../../components/orbit';
import { LyraChatInput } from '../../components/lyra/LyraChatInput';
import { LyraFirstSessionBanner } from '../../components/lyra/LyraFirstSessionBanner';
import { LyraMode, LyraModeTabs } from '../../components/lyra/LyraModeTabs';
import { LyraOrb } from '../../components/lyra/LyraOrb';
import { LyraTextChat } from '../../components/lyra/LyraTextChat';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { CHECK_IN_AREA_IDS, getCheckInAreasCovered } from '../../services/checkIn';
import { useJourney } from '../../hooks/useJourney';
import { useLyraAssistant } from '../../hooks/useLyraAssistant';
import { useLyraTextChat } from '../../hooks/useLyraTextChat';
import { MainTabParamList } from '../../navigation/types';

function VoiceStatusHint({ state }: { state: string }) {
  if (state === 'recording' || state === 'responding') return null;

  const text = state === 'processing' ? 'Pensando...' : '';

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

function VoiceHint({
  state,
  busy,
  needsCheckIn,
  checkInOpened,
}: {
  state: string;
  busy: boolean;
  needsCheckIn: boolean;
  checkInOpened: boolean;
}) {
  if (busy || state === 'recording' || state === 'responding') return null;

  const hint =
    needsCheckIn && !checkInOpened ? 'TOQUE PARA INICIAR' : 'TOQUE PARA FALAR';

  return (
    <Text
      fontSize={11}
      fontWeight="700"
      color="$textMuted"
      style={{ textAlign: 'center', letterSpacing: 1.4 }}
      mt="$4"
    >
      {hint}
    </Text>
  );
}

export function LyraScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const [mode, setMode] = useState<LyraMode>('voice');
  const [textInput, setTextInput] = useState('');
  const [showCheckInDone, setShowCheckInDone] = useState(false);
  const [areasDone, setAreasDone] = useState(0);
  const [pendingImage, setPendingImage] = useState<{
    uri: string;
    base64: string;
    mimeType: string;
  } | null>(null);

  const {
    firstLyraCompleted,
    firstLyraPending,
    todayCheckInComplete,
    loaded,
    refresh,
  } = useJourney();

  const needsCheckIn = loaded && !todayCheckInComplete;
  const showFirstSessionGuide = loaded && firstLyraPending && !firstLyraCompleted;

  const refreshAreasProgress = useCallback(async () => {
    const areas = await getCheckInAreasCovered();
    setAreasDone(areas.length);
  }, []);

  const handleCheckInComplete = useCallback(() => {
    setShowCheckInDone(true);
    void refresh();
    void refreshAreasProgress();
  }, [refresh, refreshAreasProgress]);

  const isVoiceMode = mode === 'voice';

  const {
    state,
    error,
    toggleRecording,
    cancelSession,
    initiateCheckIn: initiateVoiceCheckIn,
  } = useLyraAssistant({
      checkInMode: needsCheckIn,
      syncLyraState: isVoiceMode,
      onCheckInComplete: handleCheckInComplete,
    });
  const {
    messages,
    isLoading: isTextLoading,
    error: textError,
    sendMessage: sendTextMessage,
    initiateCheckIn: initiateTextCheckIn,
    pickImage,
  } = useLyraTextChat({
    checkInMode: needsCheckIn,
    syncLyraState: !isVoiceMode,
    onCheckInComplete: handleCheckInComplete,
  });

  const [checkInOpened, setCheckInOpened] = useState(false);
  const textCheckInStartedRef = React.useRef(false);

  useFocusEffect(
    useCallback(() => {
      void refresh();
      void refreshAreasProgress();

      return () => {
        cancelSession();
      };
    }, [refresh, refreshAreasProgress, cancelSession]),
  );

  const isLyraBusy = state === 'processing' || state === 'responding';
  const canTapVoice = mode === 'voice' && !isLyraBusy;
  const isTextBusy = mode === 'text' && isTextLoading;
  const statusTitle = needsCheckIn
    ? showFirstSessionGuide
      ? 'Vamos começar?'
      : 'Hora do check-in'
    : 'Como posso ajudar?';

  React.useEffect(() => {
    if (!needsCheckIn) {
      setCheckInOpened(false);
      textCheckInStartedRef.current = false;
    }
  }, [needsCheckIn]);

  React.useEffect(() => {
    if (
      mode !== 'text' ||
      !needsCheckIn ||
      textCheckInStartedRef.current ||
      isTextLoading ||
      messages.length > 0
    ) {
      return;
    }

    textCheckInStartedRef.current = true;
    void initiateTextCheckIn().then((ok) => {
      if (ok) void refreshAreasProgress();
    });
  }, [
    mode,
    needsCheckIn,
    isTextLoading,
    messages.length,
    initiateTextCheckIn,
    refreshAreasProgress,
  ]);

  React.useEffect(() => {
    if (areasDone > 0) {
      setCheckInOpened(true);
    }
  }, [areasDone]);

  const handleVoiceOrbPress = () => {
    if (needsCheckIn && !checkInOpened && state === 'idle') {
      setCheckInOpened(true);
      void initiateVoiceCheckIn().then((ok) => {
        if (ok) void refreshAreasProgress();
      });
      return;
    }
    void toggleRecording();
  };

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
    await refreshAreasProgress();
  };

  const handlePickImage = async () => {
    if (isTextBusy) return;
    const image = await pickImage();
    if (image) setPendingImage(image);
  };

  const goToMission = () => {
    setShowCheckInDone(false);
    void refresh();
    navigation.navigate('Mission');
  };

  return (
    <ScreenWrapper scrollable={false} tabBarOffset>
      <YStack flex={1} pt="$4" px="$2">
        {showFirstSessionGuide ? (
          <YStack mb="$4">
            <LyraFirstSessionBanner isTextMode={mode === 'text'} />
          </YStack>
        ) : null}

        <YStack items="center" gap="$2" mb="$6">
          <Text fontSize={14} color="$textMuted">
            Check-in com sua coach
          </Text>
          <Text fontSize={22} fontWeight="800" color="$text" style={{ textAlign: 'center' }}>
            {statusTitle}
          </Text>
          {needsCheckIn && areasDone > 0 ? (
            <Text fontSize={13} color="$textSupport">
              {areasDone} de {CHECK_IN_AREA_IDS.length} áreas registradas
            </Text>
          ) : null}
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
                onPress={canTapVoice ? handleVoiceOrbPress : undefined}
              />
              <VoiceStatusHint state={state} />
              <VoiceHint
                state={state}
                busy={isLyraBusy}
                needsCheckIn={needsCheckIn}
                checkInOpened={checkInOpened}
              />
            </YStack>
          </>
        ) : (
          <>
            {textError ? (
              <Text fontSize={13} color="$danger" style={{ textAlign: 'center' }} mt="$3">
                {textError}
              </Text>
            ) : null}

            <LyraTextChat
              messages={messages}
              isLoading={isTextLoading}
              needsCheckIn={needsCheckIn}
            />

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

      <ConfirmationModal
        visible={showCheckInDone}
        title="Check-in feito"
        message="Sua órbita começou a tomar forma. Veja sua Missão para o resumo do dia ou explore a Orbita quando quiser."
        confirmLabel="Ver minha Missão"
        cancelLabel="Ficar na Lyra"
        onConfirm={goToMission}
        onCancel={() => {
          setShowCheckInDone(false);
          void refresh();
        }}
      />
    </ScreenWrapper>
  );
}

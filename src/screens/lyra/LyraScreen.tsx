import { FlagBannerFold } from 'phosphor-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Text, YStack } from 'tamagui';
import { LyraChatInput } from '../../components/lyra/LyraChatInput';
import { LyraFirstSessionBanner } from '../../components/lyra/LyraFirstSessionBanner';
import { LyraMode, LyraModeTabs } from '../../components/lyra/LyraModeTabs';
import { LyraOrb } from '../../components/lyra/LyraOrb';
import { LyraTextChat } from '../../components/lyra/LyraTextChat';
import { PermissionCard } from '../../components/orbit/PermissionCard';
import { OrbitaCard } from '../../components/ui/OrbitaCard';
import { PERMISSION_COPY } from '../../constants/permissionCopy';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { themeColors } from '../../constants/theme';
import { useJourney } from '../../hooks/useJourney';
import { useLyraAssistant } from '../../hooks/useLyraAssistant';
import { useLyraTextChat } from '../../hooks/useLyraTextChat';
import { MainTabParamList } from '../../navigation/types';
import {
  markMicrophonePromptShown,
  requestMicrophonePermissionIfNeeded,
  shouldShowMicrophonePrompt,
} from '../../services/permissions';
import { LyraChatResponse } from '../../types';
import { CheckInScreen } from './CheckInScreen';

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

function VoiceHint({ state, busy }: { state: string; busy: boolean }) {
  if (busy || state === 'recording' || state === 'responding') return null;

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
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const route = useRoute<RouteProp<MainTabParamList, 'Lyra'>>();
  const [mode, setMode] = useState<LyraMode>('voice');
  const [textInput, setTextInput] = useState('');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [pendingImage, setPendingImage] = useState<{
    uri: string;
    base64: string;
    mimeType: string;
  } | null>(null);
  const [showMicPrompt, setShowMicPrompt] = useState(false);
  const [micPromptLoading, setMicPromptLoading] = useState(false);

  const {
    firstLyraCompleted,
    firstLyraPending,
    todayCheckInComplete,
    loaded,
    refresh,
  } = useJourney();

  const needsCheckIn = loaded && !todayCheckInComplete;
  const showFirstSessionGuide = loaded && firstLyraPending && !firstLyraCompleted;
  const isVoiceMode = mode === 'voice';

  const {
    state,
    error,
    toggleRecording,
    deliverReply,
    cancelSession,
  } = useLyraAssistant({
    checkInMode: false,
    continuousVoice: true,
    syncLyraState: isVoiceMode,
  });

  const {
    messages,
    isLoading: isTextLoading,
    error: textError,
    sendMessage: sendTextMessage,
    appendLyraMessage,
    pickImage,
  } = useLyraTextChat({
    checkInMode: false,
    syncLyraState: !isVoiceMode,
  });

  const cancelSessionRef = useRef(cancelSession);
  cancelSessionRef.current = cancelSession;

  useFocusEffect(
    useCallback(() => {
      void refresh();
      return () => {
        cancelSessionRef.current();
      };
    }, [refresh]),
  );

  useEffect(() => {
    if (route.params?.openCheckIn && needsCheckIn) {
      setShowCheckInModal(true);
      navigation.setParams({ openCheckIn: undefined });
    }
  }, [route.params?.openCheckIn, needsCheckIn, navigation]);

  const isLyraBusy = state === 'processing' || state === 'responding';
  const canTapVoice = mode === 'voice' && !isLyraBusy && !needsCheckIn;
  const isTextBusy = mode === 'text' && isTextLoading;

  const statusTitle = needsCheckIn
    ? showFirstSessionGuide
      ? 'Vamos começar?'
      : 'Hora do check-in'
    : 'Como posso ajudar?';

  const handleModeChange = (next: LyraMode) => {
    if (next === mode) return;
    if (state === 'recording' || state === 'processing' || state === 'responding') {
      cancelSession();
    }
    setMode(next);
  };

  const canSendText = !!textInput.trim() || !!pendingImage;

  const handleSendText = async () => {
    if (!canSendText || isTextBusy || needsCheckIn) return;
    const text = textInput;
    const image = pendingImage ?? undefined;
    setTextInput('');
    setPendingImage(null);
    await sendTextMessage(text, image);
  };

  const handlePickImage = async () => {
    if (isTextBusy || needsCheckIn) return;
    const image = await pickImage();
    if (image) setPendingImage(image);
  };

  const handleCheckInComplete = useCallback(
    async (response: LyraChatResponse) => {
      setMode('voice');
      appendLyraMessage(response.reply);
      await refresh();
      setShowCheckInModal(false);
      await deliverReply(response.reply, response.audioBase64);
    },
    [refresh, deliverReply, appendLyraMessage],
  );

  const isTextChat = mode === 'text' && !needsCheckIn;

  const handleVoicePress = useCallback(async () => {
    if (!canTapVoice) return;

    if (await shouldShowMicrophonePrompt()) {
      setShowMicPrompt(true);
      return;
    }

    void toggleRecording();
  }, [canTapVoice, toggleRecording]);

  const handleMicAllow = useCallback(async () => {
    setMicPromptLoading(true);
    try {
      await requestMicrophonePermissionIfNeeded();
      await markMicrophonePromptShown();
      setShowMicPrompt(false);
      void toggleRecording();
    } finally {
      setMicPromptLoading(false);
    }
  }, [toggleRecording]);

  const handleMicSkip = useCallback(async () => {
    await markMicrophonePromptShown();
    setShowMicPrompt(false);
  }, []);

  return (
    <ScreenWrapper scrollable={false} tabBarOffset compactBottom={isTextChat}>
      <YStack flex={1} pt="$4" px="$2">
        {showFirstSessionGuide ? (
          <YStack mb="$4">
            <LyraFirstSessionBanner isTextMode={mode === 'text'} />
          </YStack>
        ) : null}

        <YStack items="center" gap="$2" mb="$6">
          <Text fontSize={14} color="$textMuted">
            {needsCheckIn ? 'Check-in do dia' : 'Conversa com a Lyra'}
          </Text>
          <Text fontSize={22} fontWeight="800" color="$text" style={{ textAlign: 'center' }}>
            {statusTitle}
          </Text>
        </YStack>

        {needsCheckIn ? (
          <YStack flex={1} gap="$4" justify="center" items="center">
            <OrbitaCard>
              <YStack gap="$4" p="$1" items="center">
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: themeColors.surfaceMuted,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FlagBannerFold size={28} color={themeColors.primary} weight="regular" />
                </View>
                <Text fontSize={16} fontWeight="700" color="$text" text="center">
                  Check-in diário
                </Text>
                <Text fontSize={14} color="$textMuted" lineHeight={20} text="center">
                  Entenda como está sua órbita hoje e receba ações personalizadas para evoluir no
                  que mais importa.
                </Text>
                <YStack width="100%" mt="$1">
                  <PrimaryButton
                    label="Iniciar check-in"
                    onPress={() => setShowCheckInModal(true)}
                  />
                </YStack>
              </YStack>
            </OrbitaCard>
          </YStack>
        ) : (
          <>
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
                    onPress={canTapVoice ? () => void handleVoicePress() : undefined}
                  />
                  <VoiceStatusHint state={state} />
                  <VoiceHint state={state} busy={isLyraBusy} />
                </YStack>
              </>
            ) : (
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
              >
                {textError ? (
                  <Text fontSize={13} color="$danger" style={{ textAlign: 'center' }} mt="$3">
                    {textError}
                  </Text>
                ) : null}

                <LyraTextChat messages={messages} isLoading={isTextLoading} needsCheckIn={false} />

                <LyraChatInput
                  value={textInput}
                  onChangeText={setTextInput}
                  onSend={() => void handleSendText()}
                  onPickImage={() => void handlePickImage()}
                  pendingImageUri={pendingImage?.uri}
                  onClearImage={() => setPendingImage(null)}
                  disabled={isTextBusy}
                  canSend={canSendText}
                />
              </KeyboardAvoidingView>
            )}
          </>
        )}
      </YStack>

      <CheckInScreen
        visible={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        onComplete={(response) => void handleCheckInComplete(response)}
      />

      <Modal visible={showMicPrompt} animationType="fade" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.85)',
            justifyContent: 'center',
            paddingHorizontal: 20,
          }}
        >
          <PermissionCard
            title={PERMISSION_COPY.microphone.title}
            context={PERMISSION_COPY.microphone.context}
            message={PERMISSION_COPY.microphone.message}
            onAllow={() => void handleMicAllow()}
            onSkip={() => void handleMicSkip()}
            loading={micPromptLoading}
          />
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

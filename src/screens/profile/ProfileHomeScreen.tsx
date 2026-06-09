import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import React, { useState } from 'react';
import { Image } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { themeColors } from '../../constants/theme';
import { ConfirmationModal } from '../../components/orbit';
import { LogoutButton } from '../../components/settings/LogoutButton';
import { SettingsMenuRow } from '../../components/settings/SettingsMenuRow';
import { OrbitaCard } from '../../components/ui/OrbitaCard';
import { OrbitaWordmark } from '../../components/ui/OrbitaWordmark';
import { TitleText } from '../../components/ui/TitleText';
import { OrbitaSwitch } from '../../components/ui/OrbitaSwitch';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { ProfileStackParamList } from '../../navigation/types';
import { useJourney } from '../../hooks/useJourney';
import { useAuth } from '../../providers/AuthProvider';
import { useMockData } from '../../providers/MockDataProvider';
import { resetTodayCheckIn } from '../../services/checkIn';
import { requestLyraTextChatClear } from '../../services/lyraTextChatSession';
import { getProfileInitial, getProfilePhotoUrl } from '../../utils/profilePhoto';

export function ProfileHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { profile, user, signOutUser } = useAuth();
  const { enabled: mockDataEnabled, ready: mockDataReady, setEnabled: setMockDataEnabled } =
    useMockData();
  const { refresh: refreshJourney } = useJourney();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const photoUrl = getProfilePhotoUrl(profile, user);
  const initial = getProfileInitial(profile, user);

  const menuItems = [
    {
      title: 'Editar perfil',
      subtitle: 'Nome e foto',
      onPress: () => navigation.navigate('ProfileEdit'),
    },
    {
      title: 'Configurações gerais',
      subtitle: 'Idioma e fuso horário',
      onPress: () => navigation.navigate('GeneralSettings'),
    },
    {
      title: 'Configurar Lyra',
      subtitle: 'Tom de voz e respostas por áudio',
      onPress: () => navigation.navigate('LyraSettings'),
    },
    {
      title: 'Permissões',
      subtitle: 'Microfone e notificações',
      onPress: () => navigation.navigate('PermissionsSettings'),
    },
    {
      title: 'Segurança e privacidade',
      subtitle: 'Dados, histórico e conta',
      onPress: () => navigation.navigate('SecurityPrivacy'),
    },
  ];

  return (
    <ScreenWrapper tabBarOffset>
      <YStack gap="$5" pt="$4" px="$2" pb="$14">
        <TitleText size="screen">Minha conta</TitleText>

        <XStack gap="$3" items="center">
          {photoUrl ? (
            <Image
              source={{ uri: photoUrl }}
              style={{ width: 56, height: 56, borderRadius: 28 }}
            />
          ) : (
            <YStack
              width={56}
              height={56}
              rounded={999}
              bg="$primaryBg"
              items="center"
              justify="center"
            >
              <Text fontSize={22} fontWeight="700" color="$primary">
                {initial}
              </Text>
            </YStack>
          )}
          <YStack gap="$1" flex={1}>
            <Text fontSize={17} fontWeight="700" color="$text">
              {profile?.full_name ?? user?.displayName ?? 'Usuário'}
            </Text>
            <Text fontSize={14} color="$textMuted">
              {profile?.email ?? user?.email}
            </Text>
          </YStack>
        </XStack>

        <YStack gap="$2">
          {menuItems.map((item) => (
            <SettingsMenuRow
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
              onPress={item.onPress}
            />
          ))}
        </YStack>

        <YStack gap="$2">
          <Text fontSize={13} fontWeight="800" letterSpacing={1.2} color="$textMuted">
            ÁREA DE TESTES
          </Text>
          <OrbitaCard>
            <XStack items="center" justify="space-between" gap="$3">
              <YStack flex={1} gap="$1">
                <Text fontSize={15} fontWeight="600" color="$text">
                  Dados mockados
                </Text>
                <Text fontSize={13} color="$textMuted" lineHeight={18}>
                  Exibe órbita, resumo e evolução simulados na Orbita.
                </Text>
              </YStack>
              <OrbitaSwitch
                checked={mockDataEnabled}
                disabled={!mockDataReady}
                onCheckedChange={(checked) => {
                  void setMockDataEnabled(checked);
                }}
              />
            </XStack>
          </OrbitaCard>
          <OrbitaCard>
            <YStack gap="$2">
              <Text fontSize={15} fontWeight="600" color="$text">
                Abrir onboarding
              </Text>
              <Text fontSize={13} color="$textMuted" lineHeight={18}>
                Percorre o fluxo de boas-vindas (pilares, perfil e permissões) sem alterar sua
                conta.
              </Text>
              <Text
                fontSize={14}
                fontWeight="600"
                color="$primary"
                onPress={() => navigation.navigate('OnboardingTest')}
              >
                Iniciar preview
              </Text>
            </YStack>
          </OrbitaCard>
          <OrbitaCard>
            <YStack gap="$2">
              <Text fontSize={15} fontWeight="600" color="$text">
                Abrir login
              </Text>
              <Text fontSize={13} color="$textMuted" lineHeight={18}>
                Visualiza a tela de entrada (planeta, partículas e wordmark) sem iniciar sessão.
              </Text>
              <Text
                fontSize={14}
                fontWeight="600"
                color="$primary"
                onPress={() => navigation.navigate('LoginTest')}
              >
                Iniciar preview
              </Text>
            </YStack>
          </OrbitaCard>
          <OrbitaCard>
            <YStack gap="$2">
              <Text fontSize={15} fontWeight="600" color="$text">
                Limpar chat de texto
              </Text>
              <Text fontSize={13} color="$textMuted" lineHeight={18}>
                Apaga as mensagens do modo texto na Lyra (útil para testar do zero).
              </Text>
              <Text
                fontSize={14}
                fontWeight="600"
                color="$primary"
                onPress={() => requestLyraTextChatClear()}
              >
                Limpar conversa
              </Text>
            </YStack>
          </OrbitaCard>
          <OrbitaCard>
            <YStack gap="$2">
              <Text fontSize={15} fontWeight="600" color="$text">
                Reiniciar check-in de hoje
              </Text>
              <Text fontSize={13} color="$textMuted" lineHeight={18}>
                Limpa o check-in do dia para testar o fluxo guiado com a Lyra.
              </Text>
              <Text
                fontSize={14}
                fontWeight="600"
                color="$primary"
                onPress={() => {
                  void (async () => {
                    await resetTodayCheckIn();
                    await refreshJourney();
                  })();
                }}
              >
                Reiniciar
              </Text>
            </YStack>
          </OrbitaCard>
        </YStack>

        <LogoutButton onPress={() => setLogoutVisible(true)} />

        <YStack gap="$2.5" items="center" pt="$4" pb="$2">
          <OrbitaWordmark width={222} />
          <Text
            fontSize={12}
            text="center"
            lineHeight={18}
            style={{ color: themeColors.textSubtle }}
          >
            Versão {Constants.expoConfig?.version ?? '1.0.0'}
          </Text>
          <Text
            fontSize={12}
            text="center"
            lineHeight={18}
            style={{ color: themeColors.textSubtle }}
          >
            Construído pela FIAP
          </Text>
        </YStack>
      </YStack>

      <ConfirmationModal
        visible={logoutVisible}
        title="Sair da conta?"
        message="Você será redirecionado para a tela de login."
        confirmLabel="Sair"
        destructive
        onConfirm={() => {
          setLogoutVisible(false);
          signOutUser();
        }}
        onCancel={() => setLogoutVisible(false)}
      />
    </ScreenWrapper>
  );
}

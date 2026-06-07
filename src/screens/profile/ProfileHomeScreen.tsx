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
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { ProfileStackParamList } from '../../navigation/types';
import { useAuth } from '../../providers/AuthProvider';
import { getProfileInitial, getProfilePhotoUrl } from '../../utils/profilePhoto';

export function ProfileHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { profile, user, signOutUser } = useAuth();
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
      <YStack gap="$5">
        <Text fontSize={28} fontWeight="800" color="$text">
          Minha conta
        </Text>

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

        <LogoutButton onPress={() => setLogoutVisible(true)} />

        <YStack gap="$1.5" items="center" pt="$2">
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

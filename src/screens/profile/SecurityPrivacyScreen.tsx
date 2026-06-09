import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Text, YStack } from 'tamagui';
import { ConfirmationModal } from '../../components/orbit';
import { SettingsBackHeader } from '../../components/settings/SettingsBackHeader';
import { GlassInput } from '../../components/ui/GlassInput';
import { OrbitaCard } from '../../components/ui/OrbitaCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useAuth } from '../../providers/AuthProvider';
import { deleteAccount, deleteConversationHistory } from '../../services/profile';

type DeleteStep = 0 | 1 | 2 | 3;

export function SecurityPrivacyScreen() {
  const { user } = useAuth();
  const [deleteStep, setDeleteStep] = useState<DeleteStep>(0);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDeleteHistory = async () => {
    if (!user) return;
    const ok = await deleteConversationHistory(user.uid);
    Alert.alert(ok ? 'Histórico excluído' : 'Erro', ok ? 'Conversas removidas.' : 'Tente novamente.');
  };

  const handleExportData = () => {
    Alert.alert('Exportar dados', 'Em breve você poderá exportar seus dados.');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    const result = await deleteAccount(user.uid);
    setDeleting(false);
    if (!result.ok) {
      Alert.alert('Erro', result.error ?? 'Não foi possível excluir a conta.');
      return;
    }
    setDeleteStep(0);
    setDeleteConfirmText('');
  };

  return (
    <ScreenWrapper tabBarOffset>
      <SettingsBackHeader title="Segurança" />

      <YStack gap="$4" pt="$4" px="$2">
        <OrbitaCard>
          <YStack gap="$2">
            <Text fontSize={15} fontWeight="700" color="$text">
              Login
            </Text>
            <Text fontSize={14} color="$textMuted" lineHeight={20}>
              Você entrou com Google. Alterar senha não está disponível neste método.
            </Text>
          </YStack>
        </OrbitaCard>

        <OrbitaCard>
          <YStack gap="$3">
            <Text fontSize={15} fontWeight="700" color="$text">
              Privacidade
            </Text>
            <Text fontSize={13} color="$textMuted" lineHeight={18}>
              Gerencie seus dados e histórico de conversas.
            </Text>
            <PrimaryButton label="Exportar dados" onPress={handleExportData} variant="outline" />
            <PrimaryButton label="Excluir histórico" onPress={handleDeleteHistory} variant="outline" />
          </YStack>
        </OrbitaCard>

        <OrbitaCard>
          <YStack gap="$3">
            <Text fontSize={15} fontWeight="700" color="$text">
              Conta
            </Text>
            <PrimaryButton label="Excluir conta" onPress={() => setDeleteStep(1)} variant="outline" />
          </YStack>
        </OrbitaCard>
      </YStack>

      <ConfirmationModal
        visible={deleteStep === 1}
        title="Excluir conta?"
        message="Tem certeza que deseja excluir sua conta?"
        confirmLabel="Continuar"
        onConfirm={() => setDeleteStep(2)}
        onCancel={() => setDeleteStep(0)}
      />

      <ConfirmationModal
        visible={deleteStep === 2}
        title="Aviso"
        message="Todos os dados serão removidos permanentemente."
        confirmLabel="Entendi"
        onConfirm={() => setDeleteStep(3)}
        onCancel={() => setDeleteStep(0)}
      />

      {deleteStep === 3 ? (
        <ConfirmationModal
          visible
          title="Confirmar exclusão"
          message="Digite EXCLUIR para confirmar a exclusão permanente da conta."
          confirmLabel="Excluir Conta"
          destructive
          loading={deleting}
          onConfirm={() => {
            if (deleteConfirmText === 'EXCLUIR') {
              handleDeleteAccount();
            } else {
              Alert.alert('Confirmação', 'Digite EXCLUIR para confirmar.');
            }
          }}
          onCancel={() => {
            setDeleteStep(0);
            setDeleteConfirmText('');
          }}
        >
          <GlassInput
            value={deleteConfirmText}
            onChangeText={setDeleteConfirmText}
            placeholder="Digite EXCLUIR"
            autoCapitalize="characters"
          />
        </ConfirmationModal>
      ) : null}
    </ScreenWrapper>
  );
}

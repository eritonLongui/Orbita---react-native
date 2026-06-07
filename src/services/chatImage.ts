import { readAsStringAsync } from 'expo-file-system/legacy';
import { Platform } from 'react-native';

export interface PickedChatImage {
  uri: string;
  base64: string;
  mimeType: string;
}

function mimeFromUri(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.heic') || lower.endsWith('.heif')) return 'image/heic';
  return 'image/jpeg';
}

type ImagePickerModule = typeof import('expo-image-picker');

function loadImagePicker(): ImagePickerModule {
  try {
    // Carrega só ao enviar foto — evita crash na abertura do app
    return require('expo-image-picker') as ImagePickerModule;
  } catch (e) {
    console.warn('expo-image-picker unavailable:', e);
    throw new Error(
      'Envio de fotos não disponível neste build. Rode prebuild e abra o dev build atualizado.'
    );
  }
}

export async function pickChatImage(): Promise<PickedChatImage | null> {
  const ImagePicker = loadImagePicker();

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Permissão da galeria necessária para enviar fotos.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.7,
    base64: true,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];
  const uri = asset.uri;
  const mimeType = asset.mimeType ?? mimeFromUri(uri);

  let base64 = asset.base64 ?? null;
  if (!base64 && Platform.OS !== 'web') {
    base64 = await readAsStringAsync(uri, { encoding: 'base64' });
  }

  if (!base64) {
    throw new Error('Não foi possível processar a imagem.');
  }

  return { uri, base64, mimeType };
}

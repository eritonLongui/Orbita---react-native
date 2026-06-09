import { readAsStringAsync } from 'expo-file-system/legacy';
import { Platform } from 'react-native';

export interface PickedChatImage {
  uri: string;
  base64: string;
  mimeType: string;
}

const MAX_IMAGE_WIDTH = 1600;

function mimeFromUri(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.heic') || lower.endsWith('.heif')) return 'image/heic';
  return 'image/jpeg';
}

type ImagePickerModule = typeof import('expo-image-picker');
type ImageManipulatorModule = typeof import('expo-image-manipulator');

function loadImagePicker(): ImagePickerModule {
  try {
    return require('expo-image-picker') as ImagePickerModule;
  } catch (e) {
    console.warn('expo-image-picker unavailable:', e);
    throw new Error(
      'Envio de fotos não disponível neste build. Rode prebuild e abra o dev build atualizado.',
    );
  }
}

function loadImageManipulator(): ImageManipulatorModule | null {
  try {
    return require('expo-image-manipulator') as ImageManipulatorModule;
  } catch (e) {
    console.warn('expo-image-manipulator unavailable:', e);
    return null;
  }
}

async function readOriginalBase64(
  uri: string,
  sourceMime?: string | null,
): Promise<{ base64: string; mimeType: string; displayUri: string }> {
  const normalized = (sourceMime ?? mimeFromUri(uri)).toLowerCase().split(';')[0].trim();
  const mimeType = normalized.startsWith('image/') ? normalized : mimeFromUri(uri);
  const base64 = await readAsStringAsync(uri, { encoding: 'base64' });

  return {
    base64,
    mimeType,
    displayUri: `data:${mimeType};base64,${base64}`,
  };
}

async function encodeForLyraChat(
  uri: string,
  sourceMime?: string | null,
): Promise<{ base64: string; mimeType: string; displayUri: string }> {
  const normalized = (sourceMime ?? mimeFromUri(uri)).toLowerCase().split(';')[0].trim();
  const usePng = normalized === 'image/png' || normalized === 'image/gif';
  const manipulator = loadImageManipulator();

  if (manipulator) {
    try {
      const { manipulateAsync, SaveFormat } = manipulator;
      const result = await manipulateAsync(
        uri,
        [{ resize: { width: MAX_IMAGE_WIDTH } }],
        {
          compress: usePng ? 1 : 0.82,
          format: usePng ? SaveFormat.PNG : SaveFormat.JPEG,
          base64: true,
        },
      );

      let base64 = result.base64 ?? null;
      if (!base64 && Platform.OS !== 'web') {
        base64 = await readAsStringAsync(result.uri, { encoding: 'base64' });
      }

      if (base64) {
        const mimeType = usePng ? 'image/png' : 'image/jpeg';
        return {
          base64,
          mimeType,
          displayUri: `data:${mimeType};base64,${base64}`,
        };
      }
    } catch (e) {
      console.warn('Image manipulator failed, using original file:', e);
    }
  }

  return readOriginalBase64(uri, sourceMime);
}

export async function pickChatImage(): Promise<PickedChatImage | null> {
  const ImagePicker = loadImagePicker();

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Permissão da galeria necessária para enviar fotos.');
  }

  const pickerOptions: Parameters<ImagePickerModule['launchImageLibraryAsync']>[0] = {
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 1,
  };

  if (Platform.OS === 'ios' && 'UIImagePickerPreferredAssetRepresentationMode' in ImagePicker) {
    pickerOptions.preferredAssetRepresentationMode =
      ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible;
  }

  const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];
  const encoded = await encodeForLyraChat(asset.uri, asset.mimeType ?? mimeFromUri(asset.uri));

  return {
    uri: encoded.displayUri,
    base64: encoded.base64,
    mimeType: encoded.mimeType,
  };
}

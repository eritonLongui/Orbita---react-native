import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { auth, storage } from '../lib/firebase';
import { PickedProfileImage } from './avatarImage';

function fileExtension(mimeType: string): string {
  if (mimeType.includes('png')) return 'png';
  if (mimeType.includes('webp')) return 'webp';
  return 'jpg';
}

export async function uploadProfileAvatar(
  userId: string,
  image: PickedProfileImage,
): Promise<string> {
  const extension = fileExtension(image.mimeType);
  const objectRef = ref(storage, `avatars/${userId}/profile.${extension}`);

  await uploadString(objectRef, image.base64, 'base64', {
    contentType: image.mimeType,
  });

  return getDownloadURL(objectRef);
}

export async function syncFirebaseUserPhoto(photoURL: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  await updateProfile(user, { photoURL });
}

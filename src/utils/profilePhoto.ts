import { User } from 'firebase/auth';
import { Profile } from '../types';

export function getProfilePhotoUrl(
  profile: Profile | null | undefined,
  user: User | null | undefined,
): string | null {
  return profile?.avatar_url ?? user?.photoURL ?? null;
}

export function getProfileInitial(
  profile: Profile | null | undefined,
  user: User | null | undefined,
): string {
  const name = profile?.full_name ?? user?.displayName ?? 'O';
  return name.charAt(0).toUpperCase();
}

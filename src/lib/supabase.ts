import { createClient } from '@supabase/supabase-js';
import { publicEnv } from '../config/publicEnv';
import { auth } from './firebase';

export const supabase = createClient(
  publicEnv('EXPO_PUBLIC_SUPABASE_URL'),
  publicEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
  {
    accessToken: async () => {
      const user = auth.currentUser;
      if (!user) return null;
      return user.getIdToken(false);
    },
  },
);

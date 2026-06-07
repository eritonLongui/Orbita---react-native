alter table public.profiles
  drop constraint if exists profiles_lyra_voice_tone_check;

alter table public.profiles
  add constraint profiles_lyra_voice_tone_check
  check (
    lyra_voice_tone in (
      'calm',
      'neutral',
      'energetic',
      'young',
      'formal',
      'mature',
      'paulista',
      'carioca',
      'nordestino',
      'sulista',
      'mineira'
    )
  );

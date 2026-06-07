alter table public.profiles
  add column if not exists lyra_voice_tone text default 'calm'
    check (lyra_voice_tone in ('calm', 'neutral', 'energetic'));

alter table public.profiles
  add column if not exists preferences jsonb default '{}';

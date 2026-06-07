alter table public.profiles
  add column if not exists lyra_voice_style text default 'calm'
    check (
      lyra_voice_style in (
        'calm',
        'neutral',
        'energetic',
        'young',
        'formal',
        'mature'
      )
    );

alter table public.profiles
  add column if not exists lyra_voice_accent text default 'none'
    check (
      lyra_voice_accent in (
        'none',
        'paulista',
        'carioca',
        'nordestino',
        'sulista',
        'mineira'
      )
    );

update public.profiles
set
  lyra_voice_style = case
    when lyra_voice_tone in ('calm', 'neutral', 'energetic', 'young', 'formal', 'mature')
      then lyra_voice_tone
    else coalesce(lyra_voice_style, 'calm')
  end,
  lyra_voice_accent = case
    when lyra_voice_tone in ('paulista', 'carioca', 'nordestino', 'sulista', 'mineira')
      then lyra_voice_tone
    else coalesce(lyra_voice_accent, 'none')
  end
where lyra_voice_tone is not null;

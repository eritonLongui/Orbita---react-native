-- Orbita initial schema
-- Run in Supabase SQL Editor

create table if not exists public.profiles (
  id text primary key,
  email text,
  full_name text,
  avatar_url text,
  onboarding_completed boolean default false,
  voice_enabled boolean default true,
  notification_enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.daily_status (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  date date not null,
  overall_score smallint,
  stability_trend text check (stability_trend in ('stable', 'improving', 'attention')),
  notes text,
  created_at timestamptz default now(),
  unique (user_id, date)
);

create table if not exists public.pillar_records (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  pillar text not null check (pillar in ('sleep', 'movement', 'routine', 'nutrition', 'leisure')),
  date date not null,
  value jsonb default '{}',
  source text default 'manual',
  created_at timestamptz default now()
);

create table if not exists public.weekly_insights (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  week_start date not null,
  summary text,
  pillar_scores jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists public.conversation_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  channel text default 'text' check (channel in ('voice', 'text')),
  created_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  type text,
  title text,
  body text,
  scheduled_at timestamptz,
  sent boolean default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.daily_status enable row level security;
alter table public.pillar_records enable row level security;
alter table public.weekly_insights enable row level security;
alter table public.conversation_logs enable row level security;
alter table public.notifications enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid()::text = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid()::text = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid()::text = id);

create policy "daily_status_own" on public.daily_status
  for all using (auth.uid()::text = user_id);

create policy "pillar_records_own" on public.pillar_records
  for all using (auth.uid()::text = user_id);

create policy "weekly_insights_own" on public.weekly_insights
  for all using (auth.uid()::text = user_id);

create policy "conversation_logs_own" on public.conversation_logs
  for all using (auth.uid()::text = user_id);

create policy "notifications_own" on public.notifications
  for all using (auth.uid()::text = user_id);

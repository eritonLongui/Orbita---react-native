-- Firebase Auth: UIDs não são UUID (ex.: cxisuSJ9V5gmcBuwqnyPS7cok2F2).
-- auth.uid() falha com "invalid input syntax for type uuid".
-- Usar o claim "sub" do JWT (Firebase) nas policies.

create or replace function public.requesting_user_id()
returns text
language sql
stable
set search_path = public
as $$
  select auth.jwt() ->> 'sub';
$$;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own" on public.profiles
  for select using (public.requesting_user_id() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (public.requesting_user_id() = id);

create policy "profiles_update_own" on public.profiles
  for update using (public.requesting_user_id() = id);

drop policy if exists "daily_status_own" on public.daily_status;
create policy "daily_status_own" on public.daily_status
  for all using (public.requesting_user_id() = user_id);

drop policy if exists "pillar_records_own" on public.pillar_records;
create policy "pillar_records_own" on public.pillar_records
  for all using (public.requesting_user_id() = user_id);

drop policy if exists "weekly_insights_own" on public.weekly_insights;
create policy "weekly_insights_own" on public.weekly_insights
  for all using (public.requesting_user_id() = user_id);

drop policy if exists "conversation_logs_own" on public.conversation_logs;
create policy "conversation_logs_own" on public.conversation_logs
  for all using (public.requesting_user_id() = user_id);

drop policy if exists "notifications_own" on public.notifications;
create policy "notifications_own" on public.notifications
  for all using (public.requesting_user_id() = user_id);

-- Reforça RLS para Firebase JWT e garante WITH CHECK no update.

create or replace function public.requesting_user_id()
returns text
language sql
stable
set search_path = public
as $$
  select nullif(
    trim(
      coalesce(
        auth.jwt() ->> 'sub',
        auth.jwt() ->> 'user_id'
      )
    ),
    ''
  );
$$;

drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_update_own" on public.profiles
  for update
  using (public.requesting_user_id() = id)
  with check (public.requesting_user_id() = id);

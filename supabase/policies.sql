-- Row Level Security for myhighschool.club.
-- Run after schema.sql. Safe to re-run: existing policies are dropped and recreated.

-- Assumes sign-in is Google OAuth only, so the JWT email is verified.
-- If you ever enable email/password signup without confirmation,
-- do NOT authorize on email; switch school_managers to a user_id column.
-- ---------------------------------------------------------------------
begin;

-- school_managers: read-your-own-rows only; writes only via dashboard/service role
alter table public.school_managers enable row level security;

do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname = 'public' and tablename = 'school_managers'
  loop
    execute format('drop policy %I on public.school_managers', p.policyname);
  end loop;
end $$;

revoke insert, update, delete, truncate on public.school_managers from anon, authenticated;
revoke all on public.school_managers from anon;

create policy "Managers can read their own rows"
  on public.school_managers for select to authenticated
  using (lower(manager_email) = lower(auth.jwt() ->> 'email'));

-- Helper used by schools policies
create or replace function public.is_school_manager(slug text)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.school_managers m
    where m.high_school_slug = slug
      and lower(m.manager_email) = lower(auth.jwt() ->> 'email')
  );
$$;
-- anon needs EXECUTE because the public SELECT policy below calls it
-- (it simply returns false when there is no signed-in email)
revoke execute on function public.is_school_manager(text) from public;
grant  execute on function public.is_school_manager(text) to anon, authenticated;

-- schools
alter table public.schools enable row level security;
alter table public.schools alter column status set default 'pending';

do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname = 'public' and tablename = 'schools'
  loop
    execute format('drop policy %I on public.schools', p.policyname);
  end loop;
end $$;

create policy "Approved clubs are public; owners and managers see their own"
  on public.schools for select
  using (
    status = 'approved'
    or auth.uid() = user_id
    or public.is_school_manager(high_school_slug)
  );

create policy "Owners create pending clubs"
  on public.schools for insert to authenticated
  with check (auth.uid() = user_id and status = 'pending');

create policy "Owners update their clubs"
  on public.schools for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Managers update clubs at their school"
  on public.schools for update to authenticated
  using (public.is_school_manager(high_school_slug))
  with check (public.is_school_manager(high_school_slug));

create policy "Owners and managers delete clubs"
  on public.schools for delete to authenticated
  using (auth.uid() = user_id or public.is_school_manager(high_school_slug));

-- RLS can't compare old vs new values, so a trigger stops owners from
-- self-approving and stops anyone moving a club between schools/owners.
create or replace function public.schools_guard_update()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  if auth.role() = 'service_role' then
    return new;
  end if;
  if new.user_id is distinct from old.user_id
     or new.high_school_slug is distinct from old.high_school_slug
     or new.club_slug is distinct from old.club_slug then
    raise exception 'owner, school and slug cannot be changed';
  end if;
  if new.status is distinct from old.status
     and not public.is_school_manager(old.high_school_slug) then
    raise exception 'only a school manager can change status';
  end if;
  return new;
end;
$$;

drop trigger if exists schools_guard_update on public.schools;
create trigger schools_guard_update
  before update on public.schools
  for each row execute function public.schools_guard_update();

-- templates: public read, no client writes
alter table public.templates enable row level security;
drop policy if exists "Public can view templates" on public.templates;
create policy "Public can view templates" on public.templates for select using (true);
revoke insert, update, delete, truncate on public.templates from anon, authenticated;

commit;

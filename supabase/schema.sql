-- Database schema for myhighschool.club.
-- Run in the Supabase SQL editor, then seed.sql, then policies.sql.

-- Template catalog
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  preview_image text,
  default_config jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- One row per club website. (The table is named "schools" for historical
-- reasons; each row is a club at a high school.)
create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  high_school_slug text not null,
  club_slug text not null,
  template_id uuid not null references public.templates (id),
  config jsonb not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (high_school_slug, club_slug)
);

-- Who may approve and remove clubs for a given high school.
-- Managed from the Supabase dashboard only (see docs/ADMIN.md).
create table if not exists public.school_managers (
  id uuid primary key default gen_random_uuid(),
  high_school_slug text not null,
  manager_email text not null,
  created_at timestamptz not null default now(),
  unique (high_school_slug, manager_email)
);

-- ============================================================
-- MetacogAI Auth + Profiles Migration
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- Safe to run multiple times (uses IF NOT EXISTS / ON CONFLICT)
-- ============================================================

-- 1. Profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  mxp integer default 0,
  created_at timestamptz default now()
);

-- If profiles already existed without mxp, add the column safely
alter table public.profiles
  add column if not exists mxp integer default 0;

-- 2. Enable Row Level Security on profiles
alter table public.profiles enable row level security;

-- Allow users to read their own profile
do $$ begin
  if not exists (
    select 1 from pg_policies where tablename='profiles' and policyname='Users can read own profile'
  ) then
    create policy "Users can read own profile"
      on public.profiles for select
      using (auth.uid() = id);
  end if;
end $$;

-- Allow users to update their own profile
do $$ begin
  if not exists (
    select 1 from pg_policies where tablename='profiles' and policyname='Users can update own profile'
  ) then
    create policy "Users can update own profile"
      on public.profiles for update
      using (auth.uid() = id);
  end if;
end $$;

-- Allow insert only from the trigger (service role)
do $$ begin
  if not exists (
    select 1 from pg_policies where tablename='profiles' and policyname='Service role can insert profile'
  ) then
    create policy "Service role can insert profile"
      on public.profiles for insert
      with check (true);
  end if;
end $$;

-- 3. Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Questions table — caches AI-generated questions for dashboard lookups
create table if not exists public.questions (
  id text primary key,
  subject text,
  topic text,
  "questionText" text,
  options jsonb,
  "correctAnswerIndex" integer,
  "socraticHint" text,
  created_at timestamptz default now()
);

-- Allow any authenticated user to upsert questions
alter table public.questions enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename='questions' and policyname='Authenticated can upsert questions'
  ) then
    create policy "Authenticated can upsert questions"
      on public.questions for all
      to authenticated
      using (true)
      with check (true);
  end if;
end $$;

-- 5. user_responses table
create table if not exists public.user_responses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  subject text,
  question_id text references public.questions(id),
  selected_answer_index integer,
  confidence_level text,
  is_correct boolean,
  created_at timestamptz default now()
);

alter table public.user_responses enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename='user_responses' and policyname='Users can insert own responses'
  ) then
    create policy "Users can insert own responses"
      on public.user_responses for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename='user_responses' and policyname='Users can read own responses'
  ) then
    create policy "Users can read own responses"
      on public.user_responses for select
      using (auth.uid() = user_id);
  end if;
end $$;

-- 6. Supabase Storage bucket for avatars
insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict (id) do nothing;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename='objects' and schemaname='storage' and policyname='Authenticated users can upload avatars'
  ) then
    create policy "Authenticated users can upload avatars"
      on storage.objects for insert
      to authenticated
      with check (bucket_id = 'avatars');
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename='objects' and schemaname='storage' and policyname='Public avatar read'
  ) then
    create policy "Public avatar read"
      on storage.objects for select
      using (bucket_id = 'avatars');
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename='objects' and schemaname='storage' and policyname='Users can update their avatar'
  ) then
    create policy "Users can update their avatar"
      on storage.objects for update
      to authenticated
      using (bucket_id = 'avatars');
  end if;
end $$;

-- ============================================================
-- MetacogAI Auth + Profiles Migration
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
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

-- 2. Enable Row Level Security on profiles
alter table public.profiles enable row level security;

-- Allow users to read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Allow insert only from the trigger (service role)
create policy "Service role can insert profile"
  on public.profiles for insert
  with check (true);

-- 3. Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Drop if exists then recreate (idempotent)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Add user_id column to user_responses (if table already exists)
alter table public.user_responses
  add column if not exists user_id uuid references auth.users(id);

-- 5. Create Supabase Storage bucket for avatars
insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict (id) do nothing;

-- Allow any authenticated user to upload to avatars bucket
create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars');

-- Allow public read of avatars
create policy "Public avatar read"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Allow users to update/replace their own avatar
create policy "Users can update their avatar"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars');

-- Run this entire file in Supabase SQL Editor
-- Go to: supabase.com → your project → SQL Editor → New Query → paste this → Run

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── LEADS ──────────────────────────────────────────────────────────────────
create table if not exists leads (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text,
  company text,
  email text,
  phone text,
  status text default 'New',
  source text,
  value numeric default 0,
  assignee text,
  tags text,
  website text,
  notes text,
  created_at timestamp with time zone default now()
);
alter table leads enable row level security;
create policy "Users manage own leads" on leads for all using (auth.uid() = user_id);

-- ── MEETINGS ───────────────────────────────────────────────────────────────
create table if not exists meetings (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  contact text,
  company text,
  date text,
  time text,
  duration integer default 30,
  type text default 'Video',
  status text default 'Confirmed',
  notes text,
  lead_id text,
  created_at timestamp with time zone default now()
);
alter table meetings enable row level security;
create policy "Users manage own meetings" on meetings for all using (auth.uid() = user_id);

-- ── FOLLOW-UPS ─────────────────────────────────────────────────────────────
create table if not exists follow_ups (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete cascade not null,
  contact text,
  company text,
  note text,
  date text,
  due_date text,
  priority text default 'Medium',
  done boolean default false,
  lead_id text,
  created_at timestamp with time zone default now()
);
alter table follow_ups enable row level security;
create policy "Users manage own follow_ups" on follow_ups for all using (auth.uid() = user_id);

-- ── DEALS ──────────────────────────────────────────────────────────────────
create table if not exists deals (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text,
  contact text,
  value numeric default 0,
  stage text default 'Contacted',
  probability integer default 20,
  close_date text,
  lead_id text,
  created_at timestamp with time zone default now()
);
alter table deals enable row level security;
create policy "Users manage own deals" on deals for all using (auth.uid() = user_id);

-- ── AGENCY SETTINGS ────────────────────────────────────────────────────────
create table if not exists agency_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb default '{}'::jsonb,
  updated_at timestamp with time zone default now()
);
alter table agency_settings enable row level security;
create policy "Users manage own settings" on agency_settings for all using (auth.uid() = user_id);

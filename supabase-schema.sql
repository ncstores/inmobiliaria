create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.properties (
  id bigint primary key,
  title text not null,
  type text not null,
  price integer not null default 0,
  expenses integer not null default 0,
  location text not null,
  address text not null,
  map_url text not null default '',
  bedrooms integer not null default 0,
  bathrooms numeric not null default 1,
  surface integer not null default 0,
  operation text not null default 'Alquiler',
  description text not null default '',
  amenities text[] not null default '{}',
  images text[] not null default '{}',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;
alter table public.properties enable row level security;

drop policy if exists "Public read settings" on public.app_settings;
drop policy if exists "Public write settings" on public.app_settings;
drop policy if exists "Public read properties" on public.properties;
drop policy if exists "Public write properties" on public.properties;

create policy "Public read settings"
on public.app_settings for select
using (true);

create policy "Public write settings"
on public.app_settings for all
using (true)
with check (true);

create policy "Public read properties"
on public.properties for select
using (true);

create policy "Public write properties"
on public.properties for all
using (true)
with check (true);

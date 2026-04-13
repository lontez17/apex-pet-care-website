-- Ensure base tables exist first
do $$ begin
  if not exists (select 1 from pg_type where typname = 'care_type') then
    create type care_type as enum ('dog_walking', 'pet_sitting', 'drop_in');
  end if;
  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type booking_status as enum ('pending', 'active', 'cancelled', 'payment_failed');
  end if;
end $$;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  pet_name text not null,
  pet_type text not null default 'dog',
  pet_breed text,
  pet_age text,
  owner_name text not null,
  email text not null,
  phone text not null,
  care_type care_type not null,
  days_per_week int,
  selected_days text[],
  start_date date not null,
  notes text,
  monthly_rate numeric(10, 2) not null,
  registration_fee numeric(10, 2) not null default 25.00,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_session_id text,
  status booking_status not null default 'pending'
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  responded boolean not null default false
);

create index if not exists idx_bookings_email on bookings (email);
create index if not exists idx_bookings_status on bookings (status);
create index if not exists idx_bookings_created_at on bookings (created_at desc);
create index if not exists idx_contact_responded on contact_submissions (responded);

-- RLS on base tables
alter table bookings enable row level security;
alter table contact_submissions enable row level security;

-- Base policies (idempotent with do blocks)
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Public can insert bookings') then
    create policy "Public can insert bookings" on bookings for insert to anon with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Public can insert contact submissions') then
    create policy "Public can insert contact submissions" on contact_submissions for insert to anon with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Service role full access on bookings') then
    create policy "Service role full access on bookings" on bookings for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Service role full access on contact_submissions') then
    create policy "Service role full access on contact_submissions" on contact_submissions for all to service_role using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Authenticated users can read bookings') then
    create policy "Authenticated users can read bookings" on bookings for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Authenticated users can update bookings') then
    create policy "Authenticated users can update bookings" on bookings for update to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Authenticated users can read contact submissions') then
    create policy "Authenticated users can read contact submissions" on contact_submissions for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Authenticated users can update contact submissions') then
    create policy "Authenticated users can update contact submissions" on contact_submissions for update to authenticated using (true) with check (true);
  end if;
end $$;

-- ========================================
-- Client Portal: Profiles + Pets
-- ========================================

-- Profiles table (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  phone text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Pets table
create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text not null default 'dog',
  breed text,
  age text,
  weight text,
  aggression_level text not null default 'none' check (aggression_level in ('none', 'mild', 'aggressive')),
  spayed_neutered boolean not null default false,
  vaccinations_current boolean not null default false,
  special_notes text,
  created_at timestamptz default now() not null
);

-- Add user_id to bookings (nullable for legacy rows)
alter table public.bookings add column if not exists user_id uuid references public.profiles(id) on delete set null;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  );
  -- Link any existing bookings by email
  update public.bookings set user_id = new.id where email = new.email and user_id is null;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS on new tables
alter table public.profiles enable row level security;
alter table public.pets enable row level security;

-- Profile policies
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own profile') then
    create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own profile') then
    create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
  end if;
end $$;

-- Pet policies
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own pets') then
    create policy "Users can view own pets" on public.pets for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can insert own pets') then
    create policy "Users can insert own pets" on public.pets for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own pets') then
    create policy "Users can update own pets" on public.pets for update using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can delete own pets') then
    create policy "Users can delete own pets" on public.pets for delete using (auth.uid() = user_id);
  end if;
end $$;

-- Booking policy for portal users
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own bookings') then
    create policy "Users can view own bookings" on public.bookings for select using (auth.uid() = user_id);
  end if;
end $$;

-- Service role full access on new tables
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Service role full access profiles') then
    create policy "Service role full access profiles" on public.profiles for all using (auth.role() = 'service_role');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Service role full access pets') then
    create policy "Service role full access pets" on public.pets for all using (auth.role() = 'service_role');
  end if;
end $$;

-- Updated_at trigger for profiles
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

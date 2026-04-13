-- =============================================
-- Admin Portal: service_packs, service_logs, admin_users
-- =============================================

-- Service Packs (tracks pack purchases and remaining sessions)
create table if not exists public.service_packs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  service_type text not null,
  pack_type text not null,
  pack_label text not null,
  total_sessions int not null,
  used_sessions int not null default 0,
  remaining_sessions int generated always as (total_sessions - used_sessions) stored,
  unit_duration_minutes int,
  price_paid numeric(10,2) not null,
  stripe_session_id text,
  stripe_customer_id text,
  status text not null default 'active' check (status in ('active', 'exhausted', 'expired', 'refunded')),
  purchased_at timestamptz not null default now()
);

-- Service Logs (records each completed walk/visit)
create table if not exists public.service_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  service_pack_id uuid references public.service_packs(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  pet_name text not null,
  service_type text not null,
  service_date date not null,
  start_time time,
  duration_minutes int,
  walker_name text,
  notes text,
  status text not null default 'completed' check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  logged_by text
);

-- Admin Users (whitelist of admin emails)
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  role text not null default 'admin' check (role in ('admin', 'owner', 'walker')),
  created_at timestamptz not null default now()
);

-- Add columns to bookings
alter table public.bookings add column if not exists booking_type text default 'subscription' check (booking_type in ('subscription', 'pack', 'one_time'));
alter table public.bookings add column if not exists service_pack_id uuid references public.service_packs(id) on delete set null;
alter table public.bookings add column if not exists plan_label text;

-- Add admin_notes to contact_submissions
alter table public.contact_submissions add column if not exists admin_notes text;

-- Indexes
create index if not exists idx_service_packs_user on public.service_packs (user_id);
create index if not exists idx_service_packs_email on public.service_packs (customer_email);
create index if not exists idx_service_packs_status on public.service_packs (status);
create index if not exists idx_service_logs_pack on public.service_logs (service_pack_id);
create index if not exists idx_service_logs_date on public.service_logs (service_date desc);
create index if not exists idx_service_logs_user on public.service_logs (user_id);

-- RLS
alter table public.service_packs enable row level security;
alter table public.service_logs enable row level security;
alter table public.admin_users enable row level security;

-- Service packs policies
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Service role full access service_packs') then
    create policy "Service role full access service_packs" on public.service_packs for all using (auth.role() = 'service_role');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Authenticated can manage service_packs') then
    create policy "Authenticated can manage service_packs" on public.service_packs for all to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can view own packs') then
    create policy "Users can view own packs" on public.service_packs for select using (auth.uid() = user_id);
  end if;
end $$;

-- Service logs policies
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Service role full access service_logs') then
    create policy "Service role full access service_logs" on public.service_logs for all using (auth.role() = 'service_role');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Authenticated can manage service_logs') then
    create policy "Authenticated can manage service_logs" on public.service_logs for all to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can view own logs') then
    create policy "Users can view own logs" on public.service_logs for select using (auth.uid() = user_id);
  end if;
end $$;

-- Admin users policies
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Service role full access admin_users') then
    create policy "Service role full access admin_users" on public.admin_users for all using (auth.role() = 'service_role');
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Authenticated can read admin_users') then
    create policy "Authenticated can read admin_users" on public.admin_users for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Authenticated can manage admin_users') then
    create policy "Authenticated can manage admin_users" on public.admin_users for all to authenticated using (true) with check (true);
  end if;
end $$;

-- Atomic function: log a service and deduct from pack
create or replace function public.log_service_and_deduct(
  p_pack_id uuid,
  p_user_id uuid,
  p_pet_name text,
  p_service_date date,
  p_start_time time,
  p_duration int,
  p_walker text,
  p_notes text,
  p_logged_by text
) returns uuid as $$
declare
  v_log_id uuid;
  v_pack record;
begin
  -- Lock the pack row
  select * into v_pack from public.service_packs where id = p_pack_id for update;

  if v_pack is null then
    raise exception 'Pack not found';
  end if;

  if v_pack.status != 'active' then
    raise exception 'Pack is not active (status: %)', v_pack.status;
  end if;

  if v_pack.used_sessions >= v_pack.total_sessions then
    raise exception 'Pack is exhausted';
  end if;

  -- Insert service log
  insert into public.service_logs (
    service_pack_id, user_id, pet_name, service_type,
    service_date, start_time, duration_minutes,
    walker_name, notes, status, logged_by
  ) values (
    p_pack_id, p_user_id, p_pet_name, v_pack.service_type,
    p_service_date, p_start_time, coalesce(p_duration, v_pack.unit_duration_minutes),
    p_walker, p_notes, 'completed', p_logged_by
  ) returning id into v_log_id;

  -- Increment used_sessions and check exhaustion
  update public.service_packs
  set used_sessions = used_sessions + 1,
      status = case when used_sessions + 1 >= total_sessions then 'exhausted' else status end
  where id = p_pack_id;

  return v_log_id;
end;
$$ language plpgsql security definer;

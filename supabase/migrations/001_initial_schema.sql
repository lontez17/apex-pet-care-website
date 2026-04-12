-- Apex Pet Care: Initial Schema
-- Run this in your Supabase SQL editor or via CLI

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Enum types
create type care_type as enum ('dog_walking', 'pet_sitting', 'drop_in');
create type booking_status as enum ('pending', 'active', 'cancelled', 'payment_failed');

-- Bookings table
create table bookings (
  id uuid primary key default uuid_generate_v4(),
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

-- Contact form submissions
create table contact_submissions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  responded boolean not null default false
);

-- Indexes
create index idx_bookings_email on bookings (email);
create index idx_bookings_status on bookings (status);
create index idx_bookings_created_at on bookings (created_at desc);
create index idx_contact_responded on contact_submissions (responded);

-- Row Level Security
alter table bookings enable row level security;
alter table contact_submissions enable row level security;

-- Public can insert bookings (from the quote form)
create policy "Public can insert bookings"
  on bookings for insert
  to anon
  with check (true);

-- Public can insert contact submissions
create policy "Public can insert contact submissions"
  on contact_submissions for insert
  to anon
  with check (true);

-- Service role (admin) can do everything
create policy "Service role full access on bookings"
  on bookings for all
  to service_role
  using (true)
  with check (true);

create policy "Service role full access on contact_submissions"
  on contact_submissions for all
  to service_role
  using (true)
  with check (true);

-- Authenticated users (admin dashboard) can read all
create policy "Authenticated users can read bookings"
  on bookings for select
  to authenticated
  using (true);

create policy "Authenticated users can update bookings"
  on bookings for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can read contact submissions"
  on contact_submissions for select
  to authenticated
  using (true);

create policy "Authenticated users can update contact submissions"
  on contact_submissions for update
  to authenticated
  using (true)
  with check (true);

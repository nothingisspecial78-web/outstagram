-- ====================================================================
-- HEREABOUTS: DATABASE MIGRATION 0002_P1.SQL
-- P1 Features: Maker Shelf (Create & Earn), Group Meetups, Local Offers
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. F9: CREATE & EARN (MAKER SHELF)
-- --------------------------------------------------------------------
create table if not exists creations (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 60),
  medium text not null check (medium in ('art','writing','music','code','craft','other')),
  note text not null check (char_length(note) between 8 and 140),
  image_path text,
  created_at timestamptz not null default now(),
  created_on date not null default current_date,
  unique (author_id, created_on)
);

create table if not exists creation_notes (
  id uuid primary key default gen_random_uuid(),
  creation_id uuid not null references creations(id) on delete cascade,
  from_id uuid not null references profiles(id) on delete cascade,
  note text not null check (char_length(note) between 1 and 280),
  card_style text check (card_style in ('plain','postmark','leaf','sun')),
  created_at timestamptz not null default now(),
  unique (creation_id, from_id)
);

-- Trigger to award 1 Craft stamp per creation
create or replace function after_creation_insert() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into stamps (user_id, kind, label) values (new.author_id, 'craft', 'Craft logged: ' || new.title);
  return new;
end $$;

drop trigger if exists creation_stamp_after on creations;
create trigger creation_stamp_after after insert on creations
  for each row execute function after_creation_insert();

-- --------------------------------------------------------------------
-- 2. F10: GROUP MEETUPS
-- --------------------------------------------------------------------
create table if not exists group_meetups (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references profiles(id) on delete cascade,
  code_hash text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists group_members (
  group_id uuid references group_meetups(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

-- --------------------------------------------------------------------
-- 3. PROFILES ROLE & EXTENDED STAMP KINDS
-- --------------------------------------------------------------------
alter table profiles add column if not exists role text not null default 'member' check (role in ('member','partner'));

alter table stamps drop constraint if exists stamps_kind_check;
alter table stamps add constraint stamps_kind_check check (kind in ('place','meetup','quest','craft','group'));

-- --------------------------------------------------------------------
-- 4. F11: OFFERS (PARTNER ROLE)
-- --------------------------------------------------------------------
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references profiles(id) on delete cascade,
  place_id uuid not null references places(id),
  title text not null check (char_length(title) between 1 and 80),
  terms text not null check (char_length(terms) between 1 and 200),
  active boolean not null default true
);

-- --------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) FOR P1
-- --------------------------------------------------------------------
alter table creations enable row level security;
alter table creation_notes enable row level security;
alter table group_meetups enable row level security;
alter table group_members enable row level security;
alter table offers enable row level security;

-- creations: insert by author only; read by author and friends
create policy creations_insert on creations for insert with check (author_id = auth.uid());
create policy creations_read on creations for select
  using (author_id = auth.uid() or are_friends(auth.uid(), author_id));

-- creation_notes: insert by friend; read by creator and sender
create policy creation_notes_insert on creation_notes for insert with check (
  from_id = auth.uid()
  and exists (select 1 from creations c where c.id = creation_id and c.author_id <> auth.uid() and are_friends(auth.uid(), c.author_id))
);
create policy creation_notes_read on creation_notes for select using (
  from_id = auth.uid()
  or exists (select 1 from creations c where c.id = creation_id and c.author_id = auth.uid())
);

-- group_meetups & group_members: writes via service role; read by participants
create policy group_meetups_read on group_meetups for select
  using (host_id = auth.uid() or exists (select 1 from group_members m where m.group_id = id and m.user_id = auth.uid()));

create policy group_members_read on group_members for select
  using (user_id = auth.uid() or exists (select 1 from group_meetups g where g.id = group_id and g.host_id = auth.uid()));

-- offers: read by all authenticated; write by Partner owner
create policy offers_read on offers for select using (auth.role() = 'authenticated');
create policy offers_write on offers for all
  using (partner_id = auth.uid() and exists (select 1 from profiles where id = auth.uid() and role = 'partner'))
  with check (partner_id = auth.uid() and exists (select 1 from profiles where id = auth.uid() and role = 'partner'));

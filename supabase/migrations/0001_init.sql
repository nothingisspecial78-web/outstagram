-- ====================================================================
-- HEREABOUTS: DATABASE MIGRATION 0001_INIT.SQL
-- Architecture: Supabase Postgres + RLS + Triggers + RPCs
-- ====================================================================

create extension if not exists pgcrypto;

-- --------------------------------------------------------------------
-- 1. PROFILES
-- --------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  friend_code text not null unique default substr(md5(random()::text), 1, 6),
  hours_reclaimed numeric(7,2) not null default 0,
  created_at timestamptz not null default now()
);

-- Trigger to auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, friend_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    substr(md5(random()::text), 1, 6)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------------------------------------------------
-- 2. FRIENDSHIPS (Stored as two rows, one per direction)
-- --------------------------------------------------------------------
create table if not exists friendships (
  user_id uuid references profiles(id) on delete cascade,
  friend_id uuid references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id),
  check (user_id <> friend_id)
);

create or replace function are_friends(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from friendships where user_id = a and friend_id = b);
$$;

-- --------------------------------------------------------------------
-- 3. PLACES
-- --------------------------------------------------------------------
create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  lat double precision not null,
  lng double precision not null,
  radius_m integer not null default 150 check (radius_m between 30 and 1000)
);

-- --------------------------------------------------------------------
-- 4. POSTCARDS (Inserted only by Edge Function / Service Role)
-- --------------------------------------------------------------------
create table if not exists postcards (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  place_id uuid not null references places(id),
  image_path text not null,
  caption text not null check (char_length(caption) between 8 and 140),
  taken_at timestamptz not null default now(),
  is_demo boolean not null default false
);

create unique index if not exists one_postcard_per_day 
  on postcards (author_id, ((taken_at at time zone 'UTC')::date));

-- --------------------------------------------------------------------
-- 5. PRIVATE APPRECIATION
-- --------------------------------------------------------------------
create table if not exists appreciations (
  id uuid primary key default gen_random_uuid(),
  postcard_id uuid not null references postcards(id) on delete cascade,
  from_id uuid not null references profiles(id) on delete cascade,
  note text not null check (char_length(note) between 1 and 280),
  created_at timestamptz not null default now(),
  unique (postcard_id, from_id)
);

-- --------------------------------------------------------------------
-- 6. RACK TRACKING (Daily finite rack limit of 10)
-- --------------------------------------------------------------------
create table if not exists rack_seen (
  user_id uuid not null references profiles(id) on delete cascade,
  postcard_id uuid not null references postcards(id) on delete cascade,
  seen_on date not null default current_date,
  primary key (user_id, postcard_id)
);

-- --------------------------------------------------------------------
-- 7. QUESTS & QUEST LOGS
-- --------------------------------------------------------------------
create table if not exists quests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  kind text not null check (kind in ('walk','read','call','help','create','explore'))
);

create table if not exists quest_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  quest_id uuid not null references quests(id),
  log_date date not null default current_date,
  reflection text not null check (char_length(reflection) between 8 and 140),
  minutes integer not null check (minutes between 1 and 240),
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

-- --------------------------------------------------------------------
-- 8. CHATS & MESSAGES (With 20-message wall)
-- --------------------------------------------------------------------
create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references profiles(id) on delete cascade,
  user_b uuid not null references profiles(id) on delete cascade,
  message_count integer not null default 0,
  message_cap integer not null default 20,
  created_at timestamptz not null default now(),
  check (user_a < user_b),
  unique (user_a, user_b)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references chats(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

-- Enforce the 20-message wall inside the database atomically
create or replace function enforce_message_cap() returns trigger
language plpgsql security definer set search_path = public as $$
declare c chats%rowtype;
begin
  select * into c from chats where id = new.chat_id for update;
  if c.message_count >= c.message_cap then
    raise exception 'chat_locked' using errcode = 'P0001';
  end if;
  update chats set message_count = message_count + 1 where id = new.chat_id;
  return new;
end $$;

drop trigger if exists messages_cap on messages;
create trigger messages_cap before insert on messages
  for each row execute function enforce_message_cap();

-- --------------------------------------------------------------------
-- 9. MEETUPS & STAMPS (WOW factor)
-- --------------------------------------------------------------------
create table if not exists meetup_tokens (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references chats(id) on delete cascade,
  created_by uuid not null references profiles(id) on delete cascade,
  token_hash text not null,
  attempts integer not null default 0,
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by uuid references profiles(id)
);

create table if not exists meetups (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references chats(id) on delete cascade,
  met_at timestamptz not null default now()
);

create table if not exists stamps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  kind text not null check (kind in ('place','meetup','quest')),
  label text not null,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------------
-- 10. AI COACH
-- --------------------------------------------------------------------
create table if not exists coach_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  source text not null default 'ai' check (source in ('ai','fallback')),
  created_at timestamptz not null default now()
);

create table if not exists coach_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  week_start date not null,
  summary text not null,
  unique (user_id, week_start)
);

-- --------------------------------------------------------------------
-- 11. RPC FUNCTIONS
-- --------------------------------------------------------------------

-- Today's rack: cards already seen today plus new ones, max 10 total
create or replace function get_rack() returns setof postcards language sql stable as $$
  with today as (
    select postcard_id from rack_seen where user_id = auth.uid() and seen_on = current_date
  ),
  fresh as (
    select p.id from postcards p
    where p.author_id <> auth.uid()
      and not exists (select 1 from rack_seen s where s.user_id = auth.uid() and s.postcard_id = p.id)
    order by p.taken_at desc
    limit greatest(0, 10 - (select count(*) from today))
  )
  select p.* from postcards p
  where p.id in (select postcard_id from today union select id from fresh)
  order by p.taken_at desc;
$$;

-- Add a friend by friend code (creates both directions atomically)
create or replace function add_friend(code text) returns void
language plpgsql security definer set search_path = public as $$
declare f uuid;
begin
  select id into f from profiles where friend_code = lower(code);
  if f is null or f = auth.uid() then raise exception 'invalid_code'; end if;
  insert into friendships (user_id, friend_id) values (auth.uid(), f), (f, auth.uid())
    on conflict do nothing;
end $$;

-- Start or fetch a chat with a friend
create or replace function start_chat(friend uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare a uuid := least(auth.uid(), friend); b uuid := greatest(auth.uid(), friend); cid uuid;
begin
  if not are_friends(auth.uid(), friend) then raise exception 'not_friends'; end if;
  insert into chats (user_a, user_b) values (a, b) on conflict (user_a, user_b) do nothing;
  select id into cid from chats where user_a = a and user_b = b;
  return cid;
end $$;

-- Trigger: Hours Reclaimed + quest stamp after a quest log
create or replace function after_quest_log() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update profiles set hours_reclaimed = hours_reclaimed + (new.minutes / 60.0) where id = new.user_id;
  insert into stamps (user_id, kind, label) values (new.user_id, 'quest', 'Quest completed');
  return new;
end $$;

drop trigger if exists quest_log_after on quest_logs;
create trigger quest_log_after after insert on quest_logs
  for each row execute function after_quest_log();

-- --------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
alter table profiles enable row level security;
alter table friendships enable row level security;
alter table places enable row level security;
alter table postcards enable row level security;
alter table appreciations enable row level security;
alter table rack_seen enable row level security;
alter table quests enable row level security;
alter table quest_logs enable row level security;
alter table chats enable row level security;
alter table messages enable row level security;
alter table meetup_tokens enable row level security;   -- Service role only! No policies for client.
alter table meetups enable row level security;
alter table stamps enable row level security;
alter table coach_messages enable row level security;
alter table coach_summaries enable row level security;

-- profiles
create policy profiles_read on profiles for select using (id = auth.uid() or are_friends(auth.uid(), id));
create policy profiles_update on profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_insert on profiles for insert with check (id = auth.uid());

-- Prevent client updating sensitive counters directly
revoke update (hours_reclaimed, friend_code) on profiles from authenticated;

-- friendships
create policy friendships_read on friendships for select using (user_id = auth.uid());

-- places & quests
create policy places_read on places for select using (auth.role() = 'authenticated');
create policy quests_read on quests for select using (auth.role() = 'authenticated');

-- postcards: author and friends read; NO client direct insert policy (service role only)
create policy postcards_read on postcards for select
  using (author_id = auth.uid() or are_friends(auth.uid(), author_id));

-- appreciations: friend inserts; only author and sender read
create policy appreciations_insert on appreciations for insert with check (
  from_id = auth.uid()
  and exists (select 1 from postcards p where p.id = postcard_id
              and p.author_id <> auth.uid() and are_friends(auth.uid(), p.author_id))
);
create policy appreciations_read on appreciations for select using (
  from_id = auth.uid()
  or exists (select 1 from postcards p where p.id = postcard_id and p.author_id = auth.uid())
);

-- rack_seen
create policy rack_seen_rw on rack_seen for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- quest_logs
create policy quest_logs_read on quest_logs for select using (user_id = auth.uid());
create policy quest_logs_insert on quest_logs for insert with check (user_id = auth.uid());

-- chats & messages
create policy chats_read on chats for select using (auth.uid() in (user_a, user_b));
create policy messages_read on messages for select using (
  exists (select 1 from chats c where c.id = chat_id and auth.uid() in (c.user_a, c.user_b)));
create policy messages_insert on messages for insert with check (
  sender_id = auth.uid()
  and exists (select 1 from chats c where c.id = chat_id and auth.uid() in (c.user_a, c.user_b)));

-- meetups & stamps
create policy meetups_read on meetups for select using (
  exists (select 1 from chats c where c.id = chat_id and auth.uid() in (c.user_a, c.user_b)));
create policy stamps_read on stamps for select using (user_id = auth.uid());

-- coach
create policy coach_messages_read on coach_messages for select using (user_id = auth.uid());
create policy coach_summaries_read on coach_summaries for select using (user_id = auth.uid());

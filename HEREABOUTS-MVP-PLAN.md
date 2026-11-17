# HEREABOUTS: COMPLETE SPECIFICATION PACK
### The Anti-Instagram · K6 Buildathon · Theme: The Anti-App · Build window: 3 hours

This single file contains the eight specification documents. To use them separately, split at each `# FILE:` heading and save with the filename shown.

| # | Filename | Section |
|---|---|---|
| 1 | `01-PROJECT-OVERVIEW.md` | Problem, scope, WOW, success criteria |
| 2 | `02-FEATURES-AND-ROLES.md` | P0/P1/P2, roles, journeys, acceptance criteria |
| 3 | `03-DATABASE-AND-BACKEND.md` | Schema, RLS, Edge Functions, env vars |
| 4 | `04-UI-UX-SPEC.md` | "Slow Post" design system and screens |
| 5 | `05-AI-DEVELOPMENT-PROMPT.md` | Copy-paste prompt for the coding agent |
| 6 | `06-TESTING-DEPLOYMENT-DEMO.md` | Tests, deployment, demo script |
| 7 | `SECURITY.md` | Security controls and checklist |
| 8 | `AGENTS.md` | Agent operating manual |

**Status:** these are specifications only. Nothing has been built, tested or deployed. No URLs, credentials or test results are claimed anywhere in this pack.

---

# FILE: 01-PROJECT-OVERVIEW.md

## Product
**Hereabouts**, the Anti-Instagram. Tagline: *Post less. Go somewhere. Meet someone.*

## Problem
Instagram maximises time in the app: an infinite feed, public like counts, filtered gallery uploads, an engagement algorithm, unlimited DMs and tracking ads. People scroll, compare and perform instead of doing and meeting.

## Solution
A web app that rewards doing and meeting, and sends people outside. It changes the structure of the product instead of adding timers.

| Instagram | Hereabouts |
|---|---|
| Infinite vertical feed | Finite sideways postcard rack (max 10 per day, then an end card) |
| Public likes, followers | Private appreciation only the creator sees |
| Gallery uploads, filters | Live-camera-only posts, stamped with place and time |
| Engagement algorithm | AI Life Coach that recommends offline activities, never content |
| Unlimited DMs | 20-message wall; unlock by meeting in person |
| Tracking ads | (P1) Local offline offers, no tracking |
| Passive consuming | Daily quests, creative work, meetup stamps |

## Target users
Students and young adults (16 to 30) tired of scrolling who want real friendships and real habits.

## Roles
One role: **Member**. (P1: **Partner**, a local shop posting offers.)

## MVP scope (P0)
1. Auth. 2. Sideways postcard rack with daily end card. 3. Live-camera post with place check. 4. Daily quest with reflection and Hours Reclaimed. 5. Private appreciation. 6. Chat with 20-message wall. 7. Meet-to-Unlock handshake (WOW). 8. AI Life Coach with rule-based fallback.

## WOW factor: "Meet to Unlock"
Two friends reach message 20. The chat locks behind a sealed envelope. They meet; one phone shows a 6-digit code and QR, the other redeems it; the envelope opens on both phones and each passport gains a stamp. Full spec in `06`.

## Success criteria
- All P0 acceptance criteria in `02` pass on the deployed URL.
- Demo script in `06` completes in under 90 seconds, twice in a row.
- Anti-Theme Check (below) passes.

## Anti-Theme Check (definition of done)
- [ ] No infinite scroll anywhere.
- [ ] No public like counts, streaks, rankings or follower counts.
- [ ] A session can be finished in under 3 minutes.
- [ ] At least two core actions happen outside the app (go to a place, meet someone, read, call, help).
- [ ] The AI never recommends content to consume.

## Technology decisions (identical across all files)
React + Vite, Tailwind CSS + shadcn/ui, Supabase (Postgres, Auth, Storage, Realtime, Edge Functions), Vercel. English only.

## 3-hour schedule
| Time | Phase | Output |
|---|---|---|
| 0:00 to 0:20 | Plan | Roles assigned, specs read, accounts and keys ready |
| 0:20 to 0:35 | Setup | Repo, Supabase schema, Vercel project, hello-world live |
| 0:35 to 1:35 | Build P0 (parallel) | Auth, rack, capture, quests, appreciation, chat |
| 1:35 to 2:15 | Integrate and WOW | Meet-to-Unlock, AI coach function |
| 2:15 to 2:40 | Polish and P1 | Visual pass; cut unfinished P1 at 2:15 |
| 2:40 to 3:00 | Test, deploy, rehearse | Live smoke tests, demo data, two rehearsals |

Deploy early and often. Never trade deployment for polish.

## Deviations from the earlier MVP plan (kept consistent here)
- Chat unlock uses `chats.message_cap` (+20 per meetup) instead of `unlocked_until`.
- One postcard per member per day; AI coach limited to 3 user messages per day.

## Honest limits
- Camera and location checks are hard to fake, not impossible.
- Real Bluetooth proximity is not reliable in browsers, so meet-ups use a code or QR handshake.
- Hours Reclaimed is self-reported.
- A web page cannot read a step count, so "walk 100 steps" is self-reported with a reflection.
- The coach has no screen-time data. Habit spotting uses only what the user tells it and what they log in the app. The app never claims to read phone usage.
- Camera-only and GPS stop casual cheating but can still be faked (mock GPS, photographing a screen). Say "hard to fake", never "impossible".
- Face verification is not built. Any face check would be optional, on-device and never stored (P2).

## Coverage map: every idea and where it is specified
| Your idea / feature | Priority | Where |
|---|---|---|
| Live-camera-only, place-stamped posts, map of moments | P0 (map P1) | `02` F3, `03` create-postcard, `04` Capture |
| Daily quests: walk 100 steps, read 10 pages, call an old friend, help someone anonymously | P0 | `02` F4, `03` seed data |
| Create & Earn: reward for own creative work and projects | P1 | `02` F9, `03` P1 addendum |
| Private appreciation, no public likes (note P0; thank-you card P1; voice note P2) | P0 / P1 / P2 | `02` F5, F12 |
| 20-message wall, then meet (code or QR; optional on-device face check is P2) | P0 | `02` F6, F7, `06` |
| Group meetup rewards (3+ people) | P1 | `02` F10, `03` P1 addendum |
| Ethical local ads and offers | P1 | `02` F11, `03` P1 addendum, business model below |
| AI Life Coach: experiments, habit spotting, realistic adjustments, weekly letter | P0 | `02` F8, `03` coach, `05` |
| Sideways postcard rack (finite, one card per screen) | P0 | `02` F2, `04` Rack |
| Hours Reclaimed counter, Passport stamps | P0 | `02` F4, F7, `04` Passport |
| Critical analysis vs Instagram, weak spots, pitch | Reference | this file (below), `06` Judge Q&A |

## Critical analysis: how anti-Instagram is each feature?
| # | Feature | Instagram does | Hereabouts does | Anti rating |
|---|---|---|---|---|
| 1 | Live-camera-only, place-stamped post | Gallery uploads, filters, any location | Live camera only, stamped with place and time | Strong |
| 2 | Daily Do-Something quests | Pulls you into the app | Sends you out | Strong |
| 3 | Create & Earn | Rewards popularity | Rewards the work itself | Partial (anti only if reward never depends on appreciation volume) |
| 4 | Private appreciation | Public like counts | Only the creator sees a private note | Strong (Instagram has tested hiding likes, so less unique) |
| 5 | 20-message wall | Unlimited DMs | Chat locks until you meet | Strong (most original) |
| 6 | Group meetup stamps | Keeps people together online | Needs 3+ people physically together | Strong |
| 7 | Ethical local offers | Tracking-based ads | Non-tracking offers that send you to a shop | Partial (pay-to-be-seen can drift toward ads) |
| 8 | AI Life Coach | AI maximises watch time | AI proposes offline activities and tries to be needed less | Strong if rules hold |
| 9 | Sideways finite rack | Infinite vertical feed | One card per screen, 10 per day, end card | Strong only because of the finite limit and friction |

**Score: 7 strong, 2 partial.**
**Claim for judges:** "Direction is cosmetic. Finiteness and friction slow you down." Do not claim that left-to-right scrolling alone reduces screen time; Instagram carousels already swipe sideways.

## Weak spots a judge may attack, and the answers
1. **Posts, profiles and a map still look like social media.** Nothing is ranked, counted or infinite.
2. **Stamps and Hours Reclaimed can become streak-chasing.** They are personal only, with no comparison, streaks or leaderboards.
3. **Camera and GPS can be faked.** We say "hard to fake", and Demo Mode is always visibly labelled.
4. **Face verification is a privacy risk.** We use a code or QR handshake; any face check is optional, on-device and never stored.
5. **Local offers need a business model.** See below.

## Business model (local offers, P1)
Local shops, cafes and libraries pay a small flat monthly fee to list an offline offer such as "show your Hereabouts stamp for a free chai". Offers are shown only on the place page and the Passport, never inside the rack, never ranked by spend and never targeted from user data. Shops get foot traffic, not attention.

## Pitch line
*"Instagram asks you to show your life. Hereabouts asks you to live it."* Lead the demo with live-camera posts, the 20-message wall and the AI Life Coach.

---

# FILE: 02-FEATURES-AND-ROLES.md

## Roles and permissions

| Capability | Member | Partner (P1) |
|---|---|---|
| Sign in, edit own profile | Yes | Yes |
| Add friends by friend code | Yes | No |
| Post a postcard (live camera, at a place) | Yes | No |
| View friends' postcards on the rack | Yes | No |
| Send private appreciation on a friend's postcard | Yes | No |
| Read appreciation sent to own postcards | Yes | No |
| Complete daily quest | Yes | No |
| Chat with a friend (20-message wall) | Yes | No |
| Use AI Life Coach | Yes | No |
| Create offers for a place | No | Yes |

## Features

### P0: required for the live demo
| ID | Feature | Acceptance criteria |
|---|---|---|
| F1 | Auth | User can sign up, sign in and sign out; unauthenticated users see only `/login`; profile row created on sign-up |
| F2 | Sideways rack | Up to 10 friends' postcards per day, one per screen, snap-aligned, left-to-right only; arrow keys, Previous/Next buttons and desktop wheel mapping work; the last slide is the end card "You've seen everything. Go outside."; no pull-to-refresh, no infinite load |
| F3 | Live-camera post | Camera opens through `getUserMedia`; no file picker and no gallery access anywhere in the UI; photo is stamped with place and time; server rejects posts outside the place radius; max one postcard per day; caption 8 to 140 characters |
| F4 | Daily quest | Today shows one quest; completing it requires a reflection (8 to 140 characters) and self-reported minutes; Hours Reclaimed updates and persists; only one completion per day |
| F5 | Private appreciation | Friend can send one note (1 to 280 characters) per postcard; only the postcard's author (and the sender) can read it; no counts shown anywhere |
| F6 | Chat with 20-message wall | Two friends can chat in realtime; message 21 is rejected by the database; the UI shows the sealed envelope at the cap |
| F7 | Meet-to-Unlock (WOW) | See `06`. Wrong, expired, reused or self-redeemed codes are rejected; success adds 20 to the cap and a stamp for both users; persists after refresh |
| F8 | AI Life Coach | User can send up to 3 messages per day; reply is short and proposes one small offline experiment; if the AI call fails, a rule-based fallback reply is returned; weekly private summary can be generated; reply never recommends content to consume; the server passes the coach a count of days completed in the last 7 so a user who missed 4 or more of 7 days is offered a smaller goal, never a scolding; the coach sends no notifications and never ranks the user against anyone; weekly summary covers what you did, what you made, who you met and one suggestion for next week |

### P1: only if time permits (cut at 2:15)
| ID | Feature | Acceptance criteria |
|---|---|---|
| F9 | Create & Earn (Maker Shelf) | A member logs a creative project (art, writing, music, code, craft) with title, medium, a short note (8 to 140 chars) and an optional live-camera photo (no gallery). Each logged project earns one **Craft stamp** in the Passport (max one per day). The reward never depends on how many appreciations the project receives. Friends can send a private note; only the creator sees it. No counts anywhere |
| F10 | Group meetup stamp | A host starts a group code; 3 or more members join with it within 10 minutes while the host is present; every member gets a shared **Group stamp** and a group quest (photo walk, book swap, picnic). Wrong, expired or duplicate joins are rejected. QR or code only, no Bluetooth |
| F11 | Local offers (Partner role) | A Partner creates an offer tied to a place. A member sees offers only on that place's page and in the Passport, never in the rack. Claiming needs a stamp for that place. No tracking, no ranking by spend, no targeting from user data |
| F12 | Thank-you card | When sending private appreciation, the member can pick a handwritten-style card template. Same privacy rules as F5 |
| F13 | Map of moments | The member's own postcards shown as pins on a map. Nothing public, nothing counted |
| F14 | Dwell gate toggle | Next card unlocks after about 3 seconds; can be turned off in Settings |
| F15 | Printable weekly summary | The weekly coach letter in a print-friendly layout |

### P2: excluded
- Real Bluetooth, face verification (any future check would be optional, on-device and not stored), payments, push notifications, voice-note appreciation, monthly partner Maker Challenges, multi-language, offline service worker, public profiles, search.

## Core user journeys
1. **Daily loop:** open Today, read the quest, go somewhere, take a live postcard, flip the rack to the end card, close the app.
2. **Appreciate:** on the rack, tap "Send a thank-you", write a note, only the creator sees it.
3. **Meet to unlock:** chat hits 20, envelope appears, one friend taps "We're together" to get a code, the other enters or scans it, chat reopens.
4. **Coach check-in:** tell the coach what you want to change, get one small experiment for seven days, see a weekly private summary.

## Routes
| Route | Screen | Auth |
|---|---|---|
| `/login` | Sign in and sign up | Public |
| `/` | Today (quest, rack entry, coach entry) | Member |
| `/rack` | Sideways postcard rack | Member |
| `/capture` | Live camera post | Member |
| `/chats` | Chat list | Member |
| `/chats/:id` | Chat | Member |
| `/meet` | Redeem code or scan QR | Member |
| `/passport` | Stamps and Hours Reclaimed | Member |
| `/coach` | AI Life Coach | Member |
| `/settings` | Friend code, add friend, demo mode (if enabled), sign out | Member |

## Seeded content
- 8 quests (see `03`), 3 to 4 places (see `03`), 2 demo members who are already friends.

---

# FILE: 03-DATABASE-AND-BACKEND.md

## Architecture
React SPA on Vercel talks to Supabase directly (Auth, Postgres with RLS, Storage, Realtime) and to four Edge Functions for anything that must be trusted: `create-postcard`, `create-meetup-token`, `redeem-meetup-token`, `coach`.

## Schema (first migration, `supabase/migrations/0001_init.sql`)

```sql
create extension if not exists pgcrypto;

-- PROFILES
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  friend_code text not null unique default substr(md5(random()::text), 1, 6),
  hours_reclaimed numeric(7,2) not null default 0,
  created_at timestamptz not null default now()
);

-- FRIENDSHIPS (stored as two rows, one per direction)
create table friendships (
  user_id uuid references profiles(id) on delete cascade,
  friend_id uuid references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id),
  check (user_id <> friend_id)
);

create function are_friends(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from friendships where user_id = a and friend_id = b);
$$;

-- PLACES
create table places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  lat double precision not null,
  lng double precision not null,
  radius_m integer not null default 150 check (radius_m between 30 and 1000)
);

-- POSTCARDS (inserted only by the create-postcard Edge Function)
create table postcards (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  place_id uuid not null references places(id),
  image_path text not null,
  caption text not null check (char_length(caption) between 8 and 140),
  taken_at timestamptz not null default now(),
  is_demo boolean not null default false
);
create unique index one_postcard_per_day on postcards (author_id, ((taken_at at time zone 'UTC')::date));

-- PRIVATE APPRECIATION
create table appreciations (
  id uuid primary key default gen_random_uuid(),
  postcard_id uuid not null references postcards(id) on delete cascade,
  from_id uuid not null references profiles(id) on delete cascade,
  note text not null check (char_length(note) between 1 and 280),
  created_at timestamptz not null default now(),
  unique (postcard_id, from_id)
);

-- RACK TRACKING (daily limit of 10)
create table rack_seen (
  user_id uuid not null references profiles(id) on delete cascade,
  postcard_id uuid not null references postcards(id) on delete cascade,
  seen_on date not null default current_date,
  primary key (user_id, postcard_id)
);

-- QUESTS
create table quests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  kind text not null check (kind in ('walk','read','call','help','create','explore'))
);
create table quest_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  quest_id uuid not null references quests(id),
  log_date date not null default current_date,
  reflection text not null check (char_length(reflection) between 8 and 140),
  minutes integer not null check (minutes between 1 and 240),
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

-- CHATS
create table chats (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references profiles(id) on delete cascade,
  user_b uuid not null references profiles(id) on delete cascade,
  message_count integer not null default 0,
  message_cap integer not null default 20,
  created_at timestamptz not null default now(),
  check (user_a < user_b),
  unique (user_a, user_b)
);
create table messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references chats(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

-- Enforce the 20-message wall inside the database
create function enforce_message_cap() returns trigger
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
create trigger messages_cap before insert on messages
  for each row execute function enforce_message_cap();

-- MEETUPS
create table meetup_tokens (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references chats(id) on delete cascade,
  created_by uuid not null references profiles(id) on delete cascade,
  token_hash text not null,
  attempts integer not null default 0,
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by uuid references profiles(id)
);
create table meetups (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references chats(id) on delete cascade,
  met_at timestamptz not null default now()
);
create table stamps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  kind text not null check (kind in ('place','meetup','quest')),
  label text not null,
  created_at timestamptz not null default now()
);

-- AI COACH
create table coach_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  source text not null default 'ai' check (source in ('ai','fallback')),
  created_at timestamptz not null default now()
);
create table coach_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  week_start date not null,
  summary text not null,
  unique (user_id, week_start)
);
```

## Functions (RPC)

```sql
-- Today's rack: cards already seen today plus new ones, max 10 total (RLS applies, invoker rights)
create function get_rack() returns setof postcards language sql stable as $$
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

-- Add a friend by friend code (creates both directions)
create function add_friend(code text) returns void
language plpgsql security definer set search_path = public as $$
declare f uuid;
begin
  select id into f from profiles where friend_code = lower(code);
  if f is null or f = auth.uid() then raise exception 'invalid_code'; end if;
  insert into friendships (user_id, friend_id) values (auth.uid(), f), (f, auth.uid())
    on conflict do nothing;
end $$;

-- Start or fetch a chat with a friend
create function start_chat(friend uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare a uuid := least(auth.uid(), friend); b uuid := greatest(auth.uid(), friend); cid uuid;
begin
  if not are_friends(auth.uid(), friend) then raise exception 'not_friends'; end if;
  insert into chats (user_a, user_b) values (a, b) on conflict (user_a, user_b) do nothing;
  select id into cid from chats where user_a = a and user_b = b;
  return cid;
end $$;

-- Hours Reclaimed + quest stamp after a quest log
create function after_quest_log() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update profiles set hours_reclaimed = hours_reclaimed + (new.minutes / 60.0) where id = new.user_id;
  insert into stamps (user_id, kind, label) values (new.user_id, 'quest', 'Quest completed');
  return new;
end $$;
create trigger quest_log_after after insert on quest_logs
  for each row execute function after_quest_log();
```

## Row Level Security (enable on every table)

```sql
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
alter table meetup_tokens enable row level security;   -- no policies: service role only
alter table meetups enable row level security;
alter table stamps enable row level security;
alter table coach_messages enable row level security;
alter table coach_summaries enable row level security;

-- profiles: read self and friends; update self (not hours_reclaimed, see note)
create policy profiles_read on profiles for select using (id = auth.uid() or are_friends(auth.uid(), id));
create policy profiles_update on profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_insert on profiles for insert with check (id = auth.uid());

create policy friendships_read on friendships for select using (user_id = auth.uid());
create policy places_read on places for select using (auth.role() = 'authenticated');
create policy quests_read on quests for select using (auth.role() = 'authenticated');

-- postcards: author and friends read; NO client insert/update/delete policy
create policy postcards_read on postcards for select
  using (author_id = auth.uid() or are_friends(auth.uid(), author_id));

-- appreciation: friend (not author) may insert; only author and sender may read
create policy appreciations_insert on appreciations for insert with check (
  from_id = auth.uid()
  and exists (select 1 from postcards p where p.id = postcard_id
              and p.author_id <> auth.uid() and are_friends(auth.uid(), p.author_id))
);
create policy appreciations_read on appreciations for select using (
  from_id = auth.uid()
  or exists (select 1 from postcards p where p.id = postcard_id and p.author_id = auth.uid())
);

create policy rack_seen_rw on rack_seen for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy quest_logs_read on quest_logs for select using (user_id = auth.uid());
create policy quest_logs_insert on quest_logs for insert with check (user_id = auth.uid());

create policy chats_read on chats for select using (auth.uid() in (user_a, user_b));
create policy messages_read on messages for select using (
  exists (select 1 from chats c where c.id = chat_id and auth.uid() in (c.user_a, c.user_b)));
create policy messages_insert on messages for insert with check (
  sender_id = auth.uid()
  and exists (select 1 from chats c where c.id = chat_id and auth.uid() in (c.user_a, c.user_b)));

create policy meetups_read on meetups for select using (
  exists (select 1 from chats c where c.id = chat_id and auth.uid() in (c.user_a, c.user_b)));
create policy stamps_read on stamps for select using (user_id = auth.uid());
create policy coach_messages_read on coach_messages for select using (user_id = auth.uid());
create policy coach_summaries_read on coach_summaries for select using (user_id = auth.uid());
```

**Notes**
- `hours_reclaimed` is changed only by the `after_quest_log` trigger. Use a column-level `revoke update (hours_reclaimed, friend_code) on profiles from authenticated;` to stop clients editing it.
- `stamps`, `coach_*`, `meetups` and `meetup_tokens` receive inserts only from Edge Functions or security-definer functions.
- A trigger that creates a `profiles` row on sign-up (`on auth.users insert`) is required; the display name comes from sign-up metadata.
- Add `messages` and `chats` to the `supabase_realtime` publication.

## P1 schema addendum (only if time permits; migration `0002_p1.sql`)
```sql
-- F9 Create & Earn
create table creations (
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
create table creation_notes (
  id uuid primary key default gen_random_uuid(),
  creation_id uuid not null references creations(id) on delete cascade,
  from_id uuid not null references profiles(id) on delete cascade,
  note text not null check (char_length(note) between 1 and 280),
  card_style text check (card_style in ('plain','postmark','leaf','sun')),
  created_at timestamptz not null default now(),
  unique (creation_id, from_id)
);
-- F10 Group meetups
create table group_meetups (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references profiles(id) on delete cascade,
  code_hash text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create table group_members (
  group_id uuid references group_meetups(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
-- Partner role and new stamp kinds
alter table profiles add column role text not null default 'member' check (role in ('member','partner'));
alter table stamps drop constraint stamps_kind_check;
alter table stamps add constraint stamps_kind_check check (kind in ('place','meetup','quest','craft','group'));
-- F11 Offers
create table offers (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references profiles(id) on delete cascade,
  place_id uuid not null references places(id),
  title text not null check (char_length(title) between 1 and 80),
  terms text not null check (char_length(terms) between 1 and 200),
  active boolean not null default true
);
```
**RLS for the addendum (enable on every table):** `creations` insert by author only; read by author and friends. `creation_notes` insert by a friend of the creation's author; select only by the creation's author and the sender. `group_meetups` and `group_members` writes only through Edge Functions; members read their own group. `offers` select for any authenticated user, insert and update only by the Partner who owns it. The Partner role is stored in `profiles.role` (`member` default, `partner`), settable only by service role.
**Group rules:** `create-group-code` (host, expiry 10 minutes) and `join-group-code` (reject expired, duplicate or host-self joins) are Edge Functions; when `count(group_members) + host >= 3`, each member gets a `group` stamp and the group quest. Craft stamps use the existing `stamps` table with kind `craft`; its allowed kinds are extended by the `alter table` statements above.

## Storage
- Private bucket `postcards`, object path `{user_id}/{uuid}.jpg`.
- Clients never upload directly; `create-postcard` uploads with the service role.
- Clients read through short-lived signed URLs (60 minutes), generated after the RLS-protected `postcards` row is fetched.

## Edge Function contracts (JSON over HTTPS, JWT required)

### `create-postcard`
Request: `{ place_id, caption, lat, lng, accuracy_m, image_base64, demo_mode }`
Checks: valid JWT; caption 8 to 140 characters; image is JPEG, 1.5 MB or less (decoded and re-encoded server-side to strip EXIF); one postcard today; distance to place is within `radius_m` plus `min(accuracy_m, 50)`; `demo_mode` honoured only if `ALLOW_DEMO_MODE=true`.
Success: `{ postcard_id }` (also inserts a `place` stamp).
Errors: `not_at_place {distance_m, radius_m}`, `already_posted_today`, `caption_invalid`, `image_invalid`, `unauthorized`.

### `create-meetup-token`
Request: `{ chat_id }`
Checks: caller is a member; chat is locked (`message_count >= message_cap`); at most 5 tokens per chat per hour.
Action: generate 6-digit code, store `sha256(code || chat_id)`, expiry 5 minutes.
Success: `{ code, expires_at }`. Errors: `not_member`, `not_locked`, `rate_limited`.

### `redeem-meetup-token`
Request: `{ code }`
Checks: caller is a member of the chat but not the creator; token unexpired and unused; at most 5 attempts per token.
Action: set `used_at`, `used_by`; `chats.message_cap += 20`; insert `meetups` row; insert a `meetup` stamp for both members.
Success: `{ chat_id, new_cap }`. Errors: `invalid_code`, `expired`, `already_used`, `self_redeem`, `too_many_attempts`.

### `coach`
Request: `{ action: "chat" | "summary", message? }`
Checks: JWT; for `chat`, at most 3 user messages per day; message 1 to 500 characters.
Action: call the Claude API with the system prompt below; on any error or timeout (8 seconds), return a rule-based fallback.
Success: `{ reply, experiment?: { title, days }, source: "ai" | "fallback" }`.
`summary` builds a private weekly note from `quest_logs`, `stamps`, `postcards` and `meetups` and saves it to `coach_summaries`.

**Coach system prompt**
```
You are the Hereabouts Life Coach, a calm, kind guide. Rules:
- Reply in 3 sentences or fewer.
- Propose ONE small offline experiment lasting up to 7 days.
- Never recommend content to consume (no videos, accounts, apps, shows, feeds).
- Never shame the user. If they missed days, make the goal smaller.
- Do not ask more than one question.
- If the user seems in distress, be gentle and suggest talking to someone they trust.
- Stay private: never suggest posting or sharing the experiment.
```
**Coach context (built server-side, never from the client):** `days_done_last_7` (count of `quest_logs`), `stamps_last_7`, `creations_last_7` and `meetups_last_7`. If `days_done_last_7` is 3 or fewer, the prompt adds: "The user completed few days. Make the experiment smaller than usual." Habit spotting uses only what the user typed (for example late-night scrolling) and these in-app counts. The coach says plainly that it cannot see screen time.
Extra rules in the system prompt: the goal is to make the coach less needed over time (end replies by encouraging the user to do the experiment without the app); never send or suggest engagement-style reminders.

**Rule-based fallback:** keyword match (`scroll`, `read`, `friend`, `lonely`, `bored`, default) returns a preset experiment, for example for `read`: "Let's try a small experiment. Read five pages every evening for seven days. You don't need to share it with anyone."

## Environment variables

| Name | Where | Secret |
|---|---|---|
| `VITE_SUPABASE_URL` | Vercel (frontend) | No |
| `VITE_SUPABASE_ANON_KEY` | Vercel (frontend) | No (RLS protects data) |
| `VITE_ENABLE_DEMO_MODE` | Vercel (frontend) | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase function secrets only | **Yes** |
| `ANTHROPIC_API_KEY` | Supabase function secrets only | **Yes** |
| `COACH_MODEL` | Supabase function secrets (default `claude-haiku-5-5`) | No |
| `ALLOW_DEMO_MODE` | Supabase function secrets | No |

## Seed data
- **Quests (8):** walk 100 steps and notice three things; read 10 pages of a book; call an old friend; help someone without telling anyone; make something with your hands; visit a place you have never been; write a postcard to your future self; sit outside for ten minutes without your phone.
- **Places:** 3 real places near the demo venue (names, coordinates and radius **to be filled in by the team**) plus one `Demo Spot` used only for demo mode.
- **Members:** 2 demo accounts created by the team in Supabase Auth and linked as friends. Credentials are chosen by the team and never committed to the repo.

---

# FILE: 04-UI-UX-SPEC.md

## Visual identity: "Slow Post"
Paper, ink and postmarks. Every post is a postcard; every achievement is a stamp. The app should feel calm, tactile and unhurried: nothing blinks, nothing is ranked.

## Design tokens

**Colours**
| Token | Hex | Use |
|---|---|---|
| `paper` | `#F6F1E7` | App background |
| `paper-raised` | `#FBF8F1` | Cards, sheets |
| `sand` | `#D9CDB4` | Borders, dividers, disabled |
| `line` | `#E4DAC4` | Subtle rules |
| `ink` | `#1F2A37` | Primary text |
| `ink-muted` | `#5B6676` | Secondary text |
| `stamp` | `#C8452D` | Icons, large accents, postmarks |
| `stamp-ink` | `#A93822` | Red text on paper (meets contrast) |
| `moss` | `#4F6F52` | Success, completed quest |

**Typography**
- Display and headings: Fraunces (600). Body and UI: Inter. Handwritten captions only: Caveat (500). Load via `@fontsource` packages (no external CDN dependency) with serif/sans system fallbacks.
- Scale (px): display 40/44, h1 28/34, h2 22/28, body 16/24, small 13/18, label 12/16 uppercase with 0.08em tracking.

**Spacing and shape**
- 4 px base grid (4, 8, 12, 16, 24, 32, 48, 64). Page padding 16 (mobile), 32 (desktop).
- Radius: postcard 4, buttons and inputs 10, chips and stamps 999.
- Shadow (card): `0 1px 0 #E4DAC4, 0 10px 24px -14px rgba(31,42,55,0.35)`.
- Motion: 180 to 320 ms ease-out; postcard turn 450 ms; respect `prefers-reduced-motion` (replace with a fade).

## Application shell
- **Mobile (primary, 390 px wide):** top bar with product wordmark and a small Hours Reclaimed chip; bottom tab bar with Today, Rack, Capture (raised centre button), Chats, Passport.
- **Desktop (1024 px and wider):** left rail with the same five destinations plus Coach and Settings; content max width 960 px, centred.
- Coach is reached from a card on Today and from the desktop rail.

## Components and states
| Component | Spec |
|---|---|
| **Postcard** | 3:2 photo with 4 px radius and a thin paper border; below it caption in Caveat; top-right circular **Postmark** (place name, date) in `stamp`, rotated -8 degrees; bottom row has a single button "Send a thank-you". No counts, ever |
| **Postmark** | SVG circle with dashed ring, place text around the arc, date in the centre |
| **Button** | Primary: ink background, paper text. Secondary: outlined sand. Stamp: red fill for the single most important action per screen. States: default, hover, pressed, focus ring (2 px `stamp`, 2 px offset), disabled, loading (spinner replaces label) |
| **QuestCard** | Title in Fraunces, description, minutes input, reflection textarea with live character counter (8 to 140), "Mark done" button; done state shows a moss stamp |
| **ChatBubble** | Mine: ink on sand, right. Theirs: paper-raised, left. Small counter "14 of 20" in the header |
| **EnvelopeLock** | Sealed envelope illustration with a red wax seal; text "You've said a lot. Say the rest in person." and a primary button "We're together" |
| **CodeSheet** | Bottom sheet with a large 6-digit code, QR, a 5-minute countdown, and "Cancel" |
| **PassportPage** | Grid of stamps (place, meetup, quest) with dates; Hours Reclaimed total at the top; no comparison UI |
| **CoachBubble** | Soft sand bubble, "3 left today" indicator, experiment shown as a card with title and number of days |
| **Toast** | Bottom-centre, paper-raised, 4 s; success uses moss icon; errors use `stamp-ink` text and say what to do |
| **Empty states** | Illustrated, kind copy, one action (e.g. rack empty: "Nothing new today. Go make something worth sending.") |
| **Loading** | Skeleton shapes in `sand` at 40 percent opacity; no spinners longer than 400 ms without a skeleton |

## Screen-by-screen

1. **Login:** wordmark, one-sentence promise, email and password fields, "Create account" toggle. Error text inline.
2. **Today (`/`):** greeting, today's quest card (primary), "Open today's rack (N postcards)" card, coach card. No feed.
3. **Rack (`/rack`)** *(polish this first)*:
   - Container: horizontal scroller, `scroll-snap-type: x mandatory`, each slide `flex: 0 0 100%`, `scroll-snap-align: center`, `overscroll-behavior-x: contain`. Vertical page scroll is disabled on this screen.
   - Progress shown as small dots plus "3 of 10"; never as a count of likes.
   - Controls: Previous/Next buttons, Left/Right arrow keys, vertical wheel mapped to horizontal on desktop, swipe on mobile.
   - Final slide: end card, "You've seen everything. Go outside." with a button back to Today.
   - Pull-to-refresh is disabled.
   - Optional (P1): the Next button stays disabled for about 3 seconds so the caption can be read.
4. **Capture (`/capture`):** full-screen live camera view; top shows the detected place and distance ("You're at Riverside Cafe"); shutter button disabled until the place check passes; after the shot show preview with caption field (counter 8 to 140), "Post postcard" and "Retake". No gallery button anywhere.
5. **Chats / Chat:** list of friends with counters; chat view with realtime messages; at the cap show the EnvelopeLock and disable the input.
6. **Meet (`/meet`):** code entry with six boxes and a camera QR option; success plays the envelope-open animation.
7. **Passport:** stamps grid and Hours Reclaimed.
8. **Coach:** conversation with up to 3 messages per day, experiment card, "Make my weekly letter" button.
9. **Settings:** friend code with copy button, add-friend input, Demo Mode toggle (only when `VITE_ENABLE_DEMO_MODE=true`), sign out.

**Demo Mode:** when active, a persistent banner reads "DEMO MODE: location check simulated" and any postcard posted this way carries a visible "demo" mark. Never hide it.

## P1 screens (only if time permits)
- **Maker Shelf (`/make`):** a shelf of the member's own creations as small cards (title, medium, craft stamp). Add form: title, medium chips, note (counter 8 to 140), optional live-camera photo. No counts, no ranking.
- **Group (`/group`):** host sees a large code and QR with a "3 needed" progress ring; joiners enter the code. Success animates one shared stamp landing in every member's Passport.
- **Place page and offers:** place name, a quiet list of offers ("Show your stamp for a free chai"). Never shown in the rack; no sponsored labels in any feed.
- **Thank-you card picker:** four small paper card styles shown when sending appreciation; the note is typed in a handwritten-style font (Caveat).
- **Map of moments (`/map`):** own pins only.

## Responsive and accessibility
- Mobile first; breakpoints at 640 and 1024.
- Body text contrast 4.5:1 or better; red text uses `stamp-ink`.
- All controls reachable by keyboard; visible focus ring; rack slides have `aria-roledescription="slide"` and labelled controls.
- Touch targets at least 44 px.
- Respect reduced motion; no autoplay, no flashing.
- Provide alt text from the caption for photos.

## Polish order (if time is short)
1. Rack and Postcard. 2. Meet-to-Unlock envelope. 3. Today. 4. Capture. 5. Everything else.

---

# FILE: 05-AI-DEVELOPMENT-PROMPT.md

Copy everything inside the box below into the coding agent.

````text
ROLE
You are the autonomous Orchestrator for a 3-hour hackathon build. Build "Hereabouts", an Anti-Instagram web app (theme: The Anti-App). Produce real, working functionality with persistent data, not static mockups. Never claim something works unless you verified it with real tool output.

CORE LOOP
Plan, delegate, execute, test, review, fix, integrate, deploy, verify, repeat. Do not stop after planning or after writing code. Proceed between phases automatically. Involve a human only for missing credentials or permissions, irreversible external actions, or a security or data-loss decision. Do not repeat a failed action more than twice; diagnose and change strategy. Cut P1 work automatically when behind. Stop only when P0 is verified, the 3-hour budget is spent, or an unavoidable blocker occurs. Report the real final state without exaggeration.

PRODUCT
Hereabouts rewards doing and meeting instead of scrolling. Single role: Member. English only.

STACK (do not change)
React + Vite (TypeScript), Tailwind CSS + shadcn/ui, Supabase (Postgres, Auth, Storage, Realtime, Edge Functions), deployed on Vercel. Fonts via @fontsource: Fraunces, Inter, Caveat.

P0 FEATURES
F1 Auth (email + password). F2 Sideways postcard rack. F3 Live-camera postcard with place check. F4 Daily quest with reflection and Hours Reclaimed. F5 Private appreciation. F6 Chat with a 20-message wall. F7 Meet-to-Unlock handshake (the WOW). F8 AI Life Coach with rule-based fallback.

P1 FEATURES (only after P0 is verified; cut at 2:15)
F9 Create & Earn (Maker Shelf, Craft stamp, no reward tied to appreciation volume). F10 Group meetup stamp (3+ members, code or QR). F11 Local offers (Partner role, no tracking, shown only on place pages). F12 Thank-you card styles. F13 Map of moments. F14 Dwell gate toggle. F15 Printable weekly summary. Schema in migration 0002 as defined in file 03.

COACH ADDITIONS
The coach function builds days_done_last_7, stamps_last_7, creations_last_7 and meetups_last_7 server-side. If few days were completed, make the experiment smaller, never scold. The coach cannot see screen time and must say so if asked. It never sends reminders or engagement notifications and encourages the user to need it less over time.

ROUTES
/login, / (Today), /rack, /capture, /chats, /chats/:id, /meet, /passport, /coach, /settings.

DATA (Postgres, RLS on every table)
profiles, friendships (two rows per friendship), places, postcards (client cannot insert), appreciations, rack_seen, quests, quest_logs (unique per user per day), chats (message_count, message_cap default 20), messages (database trigger rejects inserts when message_count >= message_cap), meetup_tokens (service role only), meetups, stamps, coach_messages, coach_summaries. RPCs: get_rack(), add_friend(code), start_chat(friend). Storage: private bucket "postcards", signed URLs only.

EDGE FUNCTIONS (JWT required)
create-postcard {place_id, caption, lat, lng, accuracy_m, image_base64, demo_mode}: validates caption (8 to 140 chars), JPEG under 1.5 MB re-encoded to strip EXIF, one post per day, distance to place within radius plus min(accuracy, 50); demo_mode only if ALLOW_DEMO_MODE=true. Returns {postcard_id} or a named error.
create-meetup-token {chat_id}: caller is a member, chat is locked; returns {code, expires_at}; store sha256(code || chat_id); expiry 5 minutes.
redeem-meetup-token {code}: caller is the other member; reject expired, used, self-redeemed, or after 5 attempts; on success message_cap += 20, insert meetups row and a stamp for both members. Returns {chat_id, new_cap}.
coach {action: chat|summary, message}: max 3 user messages per day; call the Claude API (model from COACH_MODEL, default claude-haiku-5-5) with a system prompt that enforces: at most 3 sentences, ONE small offline experiment up to 7 days, never recommend content to consume, never shame, one question maximum, stay private; on error or 8 s timeout return a rule-based fallback. Never expose ANTHROPIC_API_KEY or the service role key to the browser.

UI (Slow Post)
Tokens: paper #F6F1E7, paper-raised #FBF8F1, sand #D9CDB4, line #E4DAC4, ink #1F2A37, ink-muted #5B6676, stamp #C8452D (text variant #A93822), moss #4F6F52. Postcards have a rotated circular postmark. Mobile first with a bottom tab bar; desktop left rail.
Rack: horizontal scroller with scroll-snap x mandatory, one card per screen, max 10 per day from get_rack(), arrow keys, Previous/Next buttons, wheel mapping on desktop, no pull-to-refresh, final end card "You've seen everything. Go outside." No like counts anywhere.
Capture: getUserMedia and canvas only. No file input, no gallery button anywhere.
Chat: shows "N of 20"; at the cap show the sealed envelope and disable input; "We're together" opens a code sheet with code, QR and a 5 minute countdown; /meet accepts the code.
Demo Mode: only when VITE_ENABLE_DEMO_MODE=true; persistent "DEMO MODE" banner and a visible demo mark on demo postcards.
States: loading skeletons, empty states, toasts, inline validation, honest error messages.

SECURITY
RLS everywhere; secrets only in Supabase function secrets or Vercel env vars; validate all inputs on client and server; no service role key in the frontend; no fake success messages; no hardcoded outcomes presented as real.

ANTI-THEME CHECK (must pass)
No infinite scroll; no public likes, streaks, rankings or follower counts; a session can finish in under 3 minutes; at least two core actions happen outside the app; the AI never recommends content to consume.

IMPLEMENTATION ORDER
1 Scaffold repo, Supabase migration 0001, seed data, deploy hello-world to Vercel immediately.
2 Auth and profile trigger.
3 Rack, Postcard component and end card (polish first).
4 Capture with create-postcard.
5 Quests and Hours Reclaimed.
6 Appreciation.
7 Chat, message cap, realtime.
8 Meet-to-Unlock functions and UI.
9 Coach function and screen with fallback.
10 Polish pass, smoke tests on the live URL, demo data.
Re-deploy after every milestone.

ACCEPTANCE CRITERIA
Auth works and unauthenticated users see only /login. Rack shows at most 10 cards then the end card. Posting outside the place radius is rejected by the server. Only one postcard per day. Appreciation is readable only by the author and sender. Message 21 is rejected by the database. Wrong, expired, reused and self-redeemed codes are rejected; a valid code adds 20 to the cap, adds stamps for both members and persists after refresh. The coach returns a reply with the AI key unset (fallback). Production build succeeds and the deployed URL passes the smoke tests.

FINAL INSTRUCTION
Take ownership of the complete MVP delivery. Continuously plan, implement, test, review, repair, integrate, deploy and verify. Report actual results only.
````

---

# FILE: 06-TESTING-DEPLOYMENT-DEMO.md

## Before the clock starts (humans)
- [ ] Supabase project, Vercel project and GitHub repo created and connected.
- [ ] Anthropic API key available (optional; fallback exists).
- [ ] Two phones with camera and location permission, plus one laptop.
- [ ] 3 real places near the demo venue chosen, with coordinates.

## Critical tests

**Database and RLS**
| Test | Expected |
|---|---|
| Member B reads Member A's appreciation on a third postcard | Denied |
| Non-friend reads a postcard | Denied |
| Client inserts directly into `postcards` | Denied |
| 21st message in a chat | Rejected with `chat_locked` |
| Client reads `meetup_tokens` | Denied |
| Client updates own `hours_reclaimed` | Denied |
| Second quest log on the same day | Rejected |

**Edge Functions**
| Test | Expected |
|---|---|
| `create-postcard` far from the place | `not_at_place` |
| Second postcard on the same day | `already_posted_today` |
| `redeem-meetup-token` with wrong code, expired code, reused code, creator redeeming | Each rejected with its named error |
| Six wrong attempts | `too_many_attempts` |
| `coach` with `ANTHROPIC_API_KEY` unset | Fallback reply, `source: "fallback"` |
| Fourth coach message in a day | Rejected |

**Anti-Theme Check:** walk through the app and tick every box in `01`.

## P1 tests (only if built)
- Creation: a second creation on the same day is rejected; the Craft stamp is awarded once; appreciation counts never change the reward.
- Creation notes: readable only by the creator and the sender.
- Group: 2 members cannot complete a group; 3 can; expired, duplicate and host-self joins are rejected.
- Offers: a non-Partner cannot create an offer; offers never appear in `get_rack()`.
- Coach: with `days_done_last_7` at 3 or fewer, the reply proposes a smaller goal and does not scold.

## Judge Q&A (rehearse these)
- **"Isn't this still social media?"** Nothing is ranked, counted or infinite. The rack ends after 10 postcards.
- **"Does scrolling sideways really help?"** No, not by itself. Finiteness and friction help; direction is cosmetic.
- **"Can't people fake the camera and location?"** It is hard to fake, not impossible. Demo Mode is always labelled.
- **"Why no Bluetooth or face check?"** Browsers cannot do reliable proximity, and face data is a privacy risk. We use a code or QR handshake.
- **"Who pays?"** Local shops pay a flat monthly fee for non-tracking offline offers; offers are never ranked by spend.
- **"What does the AI do differently?"** It recommends activities, never content, shrinks goals when you struggle and tries to be needed less.

## Smoke tests on the deployed URL
1. Sign up and sign in as Member A and Member B (two browsers or phones).
2. Add friend by friend code.
3. A takes a live postcard at a place; B sees it on the rack as card 1 of N.
4. Flip to the end card; confirm there is no way to load more.
5. B sends a thank-you; A can read it; counts do not exist anywhere.
6. Complete the daily quest; Hours Reclaimed increases and survives refresh.
7. Chat to message 20; message 21 is blocked; the envelope appears on both phones.
8. Run Meet-to-Unlock end to end; both passports gain a stamp.
9. Coach returns a short reply with an experiment.
10. Sign out; protected routes redirect to `/login`.

## Deployment steps
1. Apply migration `0001_init.sql` and the seed file in Supabase.
2. Create the `postcards` private bucket.
3. Set function secrets: `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `COACH_MODEL`, `ALLOW_DEMO_MODE`.
4. Deploy the four Edge Functions.
5. Set Vercel env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ENABLE_DEMO_MODE`.
6. Deploy to Vercel; open the live URL on a phone; run the smoke tests.

## WOW demo script: "Meet to Unlock" (60 to 90 seconds)
| Time | Action | Expected screen |
|---|---|---|
| 0:00 | Say: "Instagram asks you to show your life. Hereabouts asks you to live it." Open Today | Quest card, no feed |
| 0:10 | Flip the rack on Phone A | Sideways postcards, end card "You've seen everything. Go outside." |
| 0:25 | Open the chat that is at 19 of 20; send message 20 | Counter 20 of 20, envelope appears on both phones |
| 0:40 | Phone A taps "We're together" | Code, QR and countdown |
| 0:50 | Phone B scans or types the code on `/meet` | Envelope opens on both phones |
| 1:05 | Send a new message from Phone B | Message delivered, counter 1 of 40 |
| 1:15 | Open Passport on either phone | New meetup stamp, Hours Reclaimed total |
| 1:25 | Close with the tagline | End |

**Prepare beforehand:** a chat already at 19 messages between the two demo accounts.

## Fallback demo
- If the camera or location fails: enable Demo Mode and say clearly that location is simulated.
- If QR scanning fails: type the 6-digit code.
- If the second phone fails: use two browser windows on one laptop.
- If Realtime is slow: refresh the chat (data is persisted).
- If the AI call fails: the coach shows the fallback reply and the demo continues.

## Team responsibilities
| Person | Owns | Also |
|---|---|---|
| **A: Frontend and design** | Rack, Postcard, Capture, Today, visual polish | Presents the UI |
| **B: Backend and security** | Schema, RLS, Edge Functions, coach | Runs RLS tests |
| **C: Integration, QA and demo** | Chat, Meet-to-Unlock, deployment, smoke tests, rehearsal | Delivers the pitch |

## Final submission checklist
- [ ] Live URL opens on a phone and a laptop.
- [ ] Smoke tests 1 to 10 passed (record the real results).
- [ ] Anti-Theme Check passed.
- [ ] No secrets in the repo; `.env` files ignored.
- [ ] Demo accounts and the 19-message chat ready.
- [ ] Two full rehearsals completed.
- [ ] Known limits stated honestly in the pitch.

---

# FILE: SECURITY.md

## Objectives
Protect members' private notes, location data and chats; make the place check and message wall hard to bypass; keep every secret out of the browser.

## Authentication
- Supabase Auth with email and password. Sessions via Supabase JWT.
- Protected routes redirect to `/login`. Sign-out clears the session.

## Authorization
- Row Level Security on every table (see `03`). Default deny: no policy means no access.
- Privileged tables (`meetup_tokens`, `stamps`, `coach_*`, `postcards` inserts) are written only by Edge Functions or security-definer functions.
- `hours_reclaimed` and `friend_code` are not client-writable.
- Edge Functions re-check the caller's identity and membership on every call.

## Data protection
- Postcard images are in a private bucket and delivered by 60-minute signed URLs.
- Images are re-encoded server-side, removing EXIF metadata (including embedded GPS).
- Only a postcard's place and time are stored; raw coordinates of the author are not saved beyond the check.
- Private appreciation is visible only to the author and sender.
- "Delete everything" is P1; until then, account deletion cascades through `on delete cascade`.

## Input validation
- Server-side limits: captions 8 to 140, notes 1 to 280, reflections 8 to 140, messages 1 to 500, coach messages 1 to 500, images JPEG 1.5 MB or less.
- Render all user text as text (React escaping); never use `dangerouslySetInnerHTML`.
- Parameterised queries only (Supabase client or RPC); no string-built SQL.

## Meet-to-Unlock hardening
- Codes are 6 digits, stored as a salted hash (`sha256(code || chat_id)`), expire after 5 minutes, work once and allow 5 attempts.
- Only the other member of the chat can redeem; the creator cannot.
- Creation is rate-limited to 5 per chat per hour and allowed only when the chat is locked.

## Secret handling
- Service role key and Anthropic key exist only as Supabase function secrets. Anything starting with `VITE_` is public by design and must contain no secret.
- `.env*` is in `.gitignore`. Rotate any key that was ever pasted into chat or committed.

## Threat considerations
| Threat | Mitigation |
|---|---|
| Fake location (mock GPS) | Server-side distance check with accuracy allowance; stated as hard to fake, not impossible |
| Photographing a screen or old photo | Live capture only, server timestamp, one post per day; residual risk accepted |
| Gallery upload through browser tools | Server accepts posts only via `create-postcard`; EXIF stripped; residual risk accepted |
| Brute-forcing meet codes | 5 attempts, 5 minute expiry, hashed storage |
| Reading others' chats or notes | RLS on every table |
| Prompt abuse of the coach | Short fixed system prompt, 500 character limit, 3 messages per day, no tools, no data access beyond the user's own summary |
| API key leakage | Server-only secrets |
| Demo Mode abuse | Disabled by `ALLOW_DEMO_MODE=false` in production; visibly marked on posts |

## P1 security notes
- Group, offer and creation functions follow the same rules: JWT required, input validated on the server, rate limits, RLS on every new table.
- The `partner` role can be set only by the service role; users cannot promote themselves.
- Offers contain no user tracking; claims store only the member id and place id.

## Known limitations
- No face verification and no real Bluetooth proximity.
- Hours Reclaimed is self-reported.
- Camera-only enforcement cannot be made absolute in a browser.
- No rate limiting beyond the per-function limits listed.

## Verification checklist
- [ ] RLS enabled on all tables (`select tablename from pg_tables where schemaname='public'` cross-checked against policies).
- [ ] RLS tests in `06` pass.
- [ ] No secret strings in the repo or the built frontend bundle.
- [ ] Storage bucket is private.
- [ ] Edge Functions reject requests without a valid JWT.
- [ ] Demo Mode disabled (or clearly labelled) in the deployed build.

---

# FILE: AGENTS.md

## Mission
Deliver the verified Hereabouts MVP described in `01` to `04`, `06` and `SECURITY.md` within 3 hours. Do not add features that are not in these documents.

## Agent hierarchy
1. **Orchestrator (one):** owns architecture, contracts, integration, deployment and the schedule.
2. **Frontend Worker:** UI, routes, components, camera, rack.
3. **Backend Worker:** migrations, RLS, Edge Functions, coach.
4. **Reviewer pass (not a standing agent):** run by the Orchestrator at 1:35 and 2:40 against `SECURITY.md`, the Anti-Theme Check and P0 acceptance.

If subagents are unavailable, the Orchestrator performs the same responsibilities in sequence.

## Parallel and sequential work
- **Sequential first:** scaffold, schema migration, contract file, hello-world deploy (0:20 to 0:35).
- **Parallel after the contracts exist:** Frontend Worker builds screens against mock-free typed API wrappers; Backend Worker builds migrations and functions.
- **Sequential again:** integration, Meet-to-Unlock end to end, coach wiring, polish, deployment.

## File ownership
| Path | Owner |
|---|---|
| `/src/components`, `/src/features`, `/src/styles`, `/src/app` | Frontend Worker |
| `/supabase/migrations`, `/supabase/functions`, `/supabase/seed.sql` | Backend Worker |
| `/src/lib` (Supabase client, API wrappers, types), `/docs/contracts.md`, config files, `vercel.json`, `.env.example` | Orchestrator |

Never edit another owner's files; request the change through the Orchestrator.

## Integration contracts
- `/docs/contracts.md` is written first and contains the table list, RPC signatures and the four Edge Function request/response shapes from `03`, including error names.
- `/src/lib/api.ts` exposes one typed function per contract (`getRack`, `createPostcard`, `createMeetupToken`, `redeemMeetupToken`, `coach`, etc.). The frontend calls only these.
- Any contract change is announced by the Orchestrator and updated in both places before more code is written.

## Conventions
- TypeScript strict mode; functional React components; Tailwind tokens from `04`; shadcn/ui as the base; no extra UI libraries.
- One feature folder per feature: `rack`, `capture`, `quests`, `chat`, `passport`, `coach`.
- Server errors surface the named error codes as friendly messages; never swallow errors.
- No `dangerouslySetInnerHTML`; no secrets in code; no fake success states.

## Review checkpoints
| Time | Check |
|---|---|
| 0:35 | Hello-world is live; migration applied; contracts file exists |
| 1:35 | P0 features F1 to F6 work locally; RLS tests pass; security review of policies |
| 2:15 | WOW and coach work; cut every unfinished P1 |
| 2:40 | Production build passes; deployed smoke tests; Anti-Theme Check |

## Failure recovery and limits
- Do not retry the same failing action more than twice; diagnose, then change approach.
- If a function fails in production, check logs, fix, redeploy, re-test.
- If the schedule slips by more than 15 minutes, drop P1 and polish in this order: map, offers, dwell gate, extra polish.
- Never remove RLS or security checks to make something work.

## Escalation to humans (one specific question, with a recommended answer)
- Missing credentials or permissions that cannot be obtained automatically.
- An irreversible external action (deleting data, publishing keys).
- A security or data-loss decision.
- A major ambiguity that changes the product.
Continue independent work while waiting.

## Definition of Done
**Frontend Worker:** all P0 screens match `04`; keyboard and touch work; no gallery access; no like counts; empty, loading and error states exist; build passes.
**Backend Worker:** migration and seed apply cleanly; RLS tests pass; all four functions meet their contracts including every named error; secrets only in function secrets.
**Orchestrator:** P0 acceptance criteria verified with real results on the deployed URL; Anti-Theme Check passed; demo script completed twice; deviations logged; final report lists any incomplete or unverified items.

## Final report format
1. What works (verified, with how it was verified).
2. What was cut or simplified.
3. What is unverified or limited.
4. Live URL (only if actually deployed and tested).

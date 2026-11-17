# HEREABOUTS BACKEND INTEGRATION & CONTRACTS SPECIFICATION

## Overview
Hereabouts ("The Anti-Instagram") rewards doing and meeting instead of endless scrolling.
Theme: **The Anti-App**. Tagline: *Post less. Go somewhere. Meet someone.*

This document specifies the backend contracts, data structures, Row Level Security (RLS) policies, Edge Function contracts, and AI Life Coach architecture.

---

## 1. Database Schema (`supabase/migrations/`)

### 0001_init.sql (P0 Baseline)
- `profiles`: `(id, display_name, friend_code, hours_reclaimed, created_at)`
  * Security: `hours_reclaimed` and `friend_code` are column-revoked from client update. Auto-incremented via triggers.
  * Trigger: `on_auth_user_created` creates profile row on sign-up with unique 6-character alphanumeric friend code.
- `friendships`: `(user_id, friend_id, created_at)`
  * Stored bidirectionally (two rows per friendship)
  * Helper RPC: `are_friends(a, b)`
- `places`: `(id, name, lat, lng, radius_m)`
- `postcards`: `(id, author_id, place_id, image_path, caption, taken_at, is_demo)`
  * Client cannot insert directly. Only service role via `create-postcard` function.
  * Unique constraint: `(author_id, taken_at::date)` prevents more than 1 postcard per day.
- `appreciations`: `(id, postcard_id, from_id, note, created_at)`
  * Visible ONLY to the creator of the postcard and the sender.
  * No public like counts, no rankings.
- `rack_seen`: `(user_id, postcard_id, seen_on)`
  * Used by `get_rack()` RPC to limit daily rack to 10 postcards maximum.
- `quests`: `(id, title, description, kind)`
- `quest_logs`: `(id, user_id, quest_id, log_date, reflection, minutes, created_at)`
  * Unique constraint: 1 quest log per day per user.
  * Trigger `after_quest_log`: automatically increments `profiles.hours_reclaimed += minutes / 60.0` and awards a quest stamp.
- `chats`: `(id, user_a, user_b, message_count, message_cap, created_at)`
  * Default `message_cap = 20`.
- `messages`: `(id, chat_id, sender_id, body, created_at)`
  * Database trigger `enforce_message_cap`: atomically rejects any message insertion when `message_count >= message_cap` with error `chat_locked`.
- `meetup_tokens`: `(id, chat_id, created_by, token_hash, attempts, expires_at, used_at, used_by)`
  * Service role only. Protected from direct client read/write.
- `meetups`: `(id, chat_id, met_at)`
- `stamps`: `(id, user_id, kind, label, created_at)`
  * Kinds: `place`, `meetup`, `quest`, `craft`, `group`.
- `coach_messages`: `(id, user_id, role, content, source, created_at)`
- `coach_summaries`: `(id, user_id, week_start, summary)`

### 0002_p1.sql (P1 Additions)
- `creations`: Maker Shelf logs (Title, Medium, Note, Craft stamp). Unique 1 per day.
- `creation_notes`: Private notes on creations (no counts).
- `group_meetups` & `group_members`: Group meetups (3+ participants unlock shared Group stamp).
- `offers`: Offline local partner offers (Partner role only, no tracking, never in feed).

---

## 2. Edge Function Contracts (JSON over HTTPS, JWT required)

### `create-postcard`
- **Endpoint**: `/functions/v1/create-postcard`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "place_id": "uuid",
    "caption": "string (8 to 140 chars)",
    "lat": 12.9716,
    "lng": 77.5946,
    "accuracy_m": 20,
    "image_base64": "data:image/jpeg;base64,...",
    "demo_mode": false
  }
  ```
- **Validations**:
  1. Valid Supabase JWT Bearer token.
  2. Caption between 8 and 140 chars.
  3. Image is valid JPEG, <= 1.5MB. Strips EXIF metadata server-side.
  4. One postcard per day enforcement.
  5. Distance check via Haversine formula: user must be within `place.radius_m + min(accuracy_m, 50)`.
- **Response**:
  ```json
  { "success": true, "postcard_id": "uuid" }
  ```
- **Error Codes**: `not_at_place`, `already_posted_today`, `caption_invalid`, `image_invalid`, `place_not_found`, `unauthorized`.

---

### `create-meetup-token`
- **Endpoint**: `/functions/v1/create-meetup-token`
- **Method**: `POST`
- **Payload**: `{ "chat_id": "uuid" }`
- **Validations**:
  1. Caller is member of the chat.
  2. Chat is locked (`message_count >= message_cap`).
  3. Rate limiting: max 5 tokens per chat per hour.
- **Logic**:
  - Generates secure random 6-digit code.
  - Computes `sha256(code || chat_id)`.
  - Expiry set to 5 minutes (`now() + 5 minutes`).
- **Response**: `{ "code": "482913", "expires_at": "ISO-string" }`
- **Error Codes**: `not_member`, `not_locked`, `rate_limited`.

---

### `redeem-meetup-token`
- **Endpoint**: `/functions/v1/redeem-meetup-token`
- **Method**: `POST`
- **Payload**: `{ "code": "482913" }`
- **Validations**:
  1. Caller is the OTHER member of the chat (prevents self-redemption).
  2. Max 5 attempts per token (brute-force protection).
  3. Token is unexpired and unused.
- **Atomic Actions**:
  - Marks token `used_at = now()`, `used_by = caller_id`.
  - Increments `chats.message_cap += 20`.
  - Inserts row into `meetups`.
  - Inserts `meetup` stamps for both members in `stamps`.
- **Response**: `{ "success": true, "chat_id": "uuid", "new_cap": 40 }`
- **Error Codes**: `invalid_code`, `expired`, `already_used`, `self_redeem`, `too_many_attempts`.

---

### `coach`
- **Endpoint**: `/functions/v1/coach`
- **Method**: `POST`
- **Payload**: `{ "action": "chat" | "summary", "message": "string" }`
- **Validations**:
  1. Max 3 user messages per day.
  2. Message between 1 and 500 chars.
- **Server Context**:
  - `days_done_last_7`: count of `quest_logs`
  - `stamps_last_7`: count of `stamps`
  - `meetups_last_7`: count of in-person meetups
  - If `days_done_last_7 <= 3`, system prompt automatically instructs: *"The user completed few days. Make the experiment smaller than usual and never scold."*
- **Multi-Provider AI Execution**:
  - Integrates Groq, Google Gemini, OpenRouter, and Anthropic Claude.
  - Strict system prompt: 3 sentences or fewer, ONE small offline experiment (up to 7 days), NO content/media recommendations, max 1 question.
  - 8-second timeout fallback: calibrated keyword matcher for offline experiments (`scroll`, `read`, `friend`, `lonely`, `bored`).
- **Response**:
  ```json
  { "reply": "...", "source": "ai" | "fallback", "remaining_today": 2 }
  ```

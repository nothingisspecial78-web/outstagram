-- ====================================================================
-- HEREABOUTS: SEED DATA (supabase/seed.sql)
-- 8 Quests, 4 Places, Demo setup
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. SEED 8 QUESTS
-- --------------------------------------------------------------------
insert into quests (id, title, description, kind) values
  ('11111111-1111-1111-1111-111111111101', 'Walk 100 steps and notice three things', 'Leave your phone in your pocket. Take 100 mindful steps and spot three small things you have never seen before.', 'walk'),
  ('11111111-1111-1111-1111-111111111102', 'Read 10 pages of a physical book', 'Open a printed book. No screens, no notifications. Just the turn of ten quiet paper pages.', 'read'),
  ('11111111-1111-1111-1111-111111111103', 'Call an old friend for a voice chat', 'Pick up the phone and hear their voice. No texting, no meme forwards. Ask how their heart is.', 'call'),
  ('11111111-1111-1111-1111-111111111104', 'Help someone without telling anyone', 'Hold open a heavy door, pick up dropped fruit, or leave an anonymous kind note where someone will find it.', 'help'),
  ('11111111-1111-1111-1111-111111111105', 'Make something with your bare hands', 'Sketch on scrap paper, fold an origami crane, brew fresh tea, or carve a toothpick. Make, don''t consume.', 'create'),
  ('11111111-1111-1111-1111-111111111106', 'Visit a place you have never been', 'Turn down a street you always bypass. Stand there for two minutes and take in the architecture and sounds.', 'explore'),
  ('11111111-1111-1111-1111-111111111107', 'Write a postcard to your future self', 'Write down three sentences about what mattered today. Stamp it and put it inside your drawer.', 'create'),
  ('11111111-1111-1111-1111-111111111108', 'Sit outside for ten minutes without your phone', 'Find a park bench or stoop. Feel the wind. Watch the sky. No podcast, no earbuds.', 'walk')
on conflict (id) do nothing;

-- --------------------------------------------------------------------
-- 2. SEED PLACES
-- --------------------------------------------------------------------
insert into places (id, name, lat, lng, radius_m) values
  ('22222222-2222-2222-2222-222222222201', 'Riverside Artisan Cafe', 12.9716, 77.5946, 120),
  ('22222222-2222-2222-2222-222222222202', 'City Central Library', 12.9760, 77.5920, 150),
  ('22222222-2222-2222-2222-222222222203', 'Sunset Point Hill', 12.9800, 77.6000, 200),
  ('22222222-2222-2222-2222-222222222204', 'Demo Spot (Venue simulated)', 0.0000, 0.0000, 500)
on conflict (id) do nothing;

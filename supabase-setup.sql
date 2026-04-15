-- ============================================================
-- Supabase SQL: schedules table, RLS, Realtime, and seed data
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS schedules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  date            DATE NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  game_mode       TEXT NOT NULL CHECK (game_mode IN ('ranked', 'casual', 'tournament', 'custom', 'scrimmage')),
  status          TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  participants    TEXT[] DEFAULT '{}',
  max_participants INTEGER,
  host_nickname   TEXT NOT NULL,
  notes           TEXT,
  is_recurring    BOOLEAN DEFAULT FALSE,
  recurring_day   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index for common queries
CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules (date);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON schedules (status);
CREATE INDEX IF NOT EXISTS idx_schedules_game_mode ON schedules (game_mode);

-- 3. Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS schedules_updated_at ON schedules;
CREATE TRIGGER schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 4. Enable Row Level Security (read-only for public, full access for service_role)
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Public (anon) can only read
CREATE POLICY "Allow public read" ON schedules
  FOR SELECT USING (true);

-- Service role (used server-side) bypasses RLS automatically
-- For admin writes from the client, use the admin URL param + keep
-- INSERT/UPDATE/DELETE policies for the authenticated role when auth is added.
-- For now, allow all writes so admin mode works with the anon key:
CREATE POLICY "Allow admin insert" ON schedules
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin update" ON schedules
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin delete" ON schedules
  FOR DELETE USING (true);

-- 5. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE schedules;

-- ============================================================
-- 6. Seed data (8 events from the original mock data)
-- ============================================================

INSERT INTO schedules (id, title, description, date, start_time, end_time, game_mode, status, participants, max_participants, host_nickname, notes, is_recurring, recurring_day) VALUES
  (
    'a1b2c3d4-0001-4000-8000-000000000001',
    'Ranked Push Malam',
    'Push rank bareng sampai naik tier. Wajib mic on!',
    '2026-04-14', '20:00', '23:00',
    'ranked', 'ongoing',
    ARRAY['Bahuy','Anggoro','Arnold','Bobby','Abi','Farhan','Galen'],
    10, 'Bahuy',
    'Mic on wajib, yg AFK kick',
    FALSE, NULL
  ),
  (
    'a1b2c3d4-0002-4000-8000-000000000002',
    'Weekend Santai',
    'Main santai aja, have fun bareng.',
    '2026-04-18', '19:00', '22:00',
    'casual', 'upcoming',
    ARRAY['Ky','Theo','Ricky','Dwi','Christ'],
    NULL, 'Ky',
    NULL,
    TRUE, 'Sabtu'
  ),
  (
    'a1b2c3d4-0003-4000-8000-000000000003',
    'Scrim vs TITAN Squad',
    'Friendly match lawan clan TITAN. Siap-siap strategi!',
    '2026-04-19', '20:00', '22:30',
    'scrimmage', 'upcoming',
    ARRAY['Bahuy','Anggoro','Arnold','Jeffry','Abi'],
    5, 'Bahuy',
    'Line-up fix, gak bisa diganti. Latihan jam 19:30.',
    FALSE, NULL
  ),
  (
    'a1b2c3d4-0004-4000-8000-000000000004',
    'Community Cup S3',
    'Turnamen komunitas season 3. Hadiah total 5 juta!',
    '2026-04-20', '13:00', '18:00',
    'tournament', 'upcoming',
    ARRAY['Bahuy','Anggoro','Arnold','Jeffry','Abi','Bobby','Farhan'],
    7, 'Bahuy',
    'Kumpul jam 12:30 buat briefing',
    FALSE, NULL
  ),
  (
    'a1b2c3d4-0005-4000-8000-000000000005',
    'Custom Room: Hide & Seek',
    'Main hide and seek di map baru. Yang kalah push up 10x.',
    '2026-04-21', '21:00', '23:00',
    'custom', 'upcoming',
    ARRAY['Theo','Ricky','Jevon','John','Jaden','Dwiky'],
    12, 'Theo',
    NULL,
    FALSE, NULL
  ),
  (
    'a1b2c3d4-0006-4000-8000-000000000006',
    'Ranked Push Mingguan',
    'Sesi ranked push rutin tiap Sabtu malam.',
    '2026-04-25', '20:00', '23:30',
    'ranked', 'upcoming',
    ARRAY['Bahuy','Bobby','Bram'],
    10, 'Bahuy',
    NULL,
    TRUE, 'Sabtu'
  ),
  (
    'a1b2c3d4-0007-4000-8000-000000000007',
    'Ranked Push Sabtu',
    NULL,
    '2026-04-12', '20:00', '23:00',
    'ranked', 'completed',
    ARRAY['Bahuy','Anggoro','Arnold','Bobby','Abi','Farhan','Galen','Iwan'],
    10, 'Bahuy',
    NULL,
    FALSE, NULL
  ),
  (
    'a1b2c3d4-0008-4000-8000-000000000008',
    'Scrim vs SHADOW Clan',
    'Dibatalkan — lawan gak jadi.',
    '2026-04-13', '20:00', '22:00',
    'scrimmage', 'cancelled',
    ARRAY['Bahuy','Anggoro','Arnold','Jeffry','Abi'],
    5, 'Bahuy',
    'Clan lawan cancel last minute',
    FALSE, NULL
  );

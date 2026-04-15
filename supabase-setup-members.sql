-- ============================================================
-- Supabase SQL: members table, RLS, Realtime, Storage policy, and seed data
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Create members table
CREATE TABLE IF NOT EXISTS members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname        TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  rank            TEXT NOT NULL CHECK (rank IN ('Private', 'Corporal', 'Sergeant', 'Lieutenant', 'Captain', 'Major', 'Colonel', 'General')),
  city            TEXT NOT NULL,
  role            TEXT NOT NULL CHECK (role IN ('sniper', 'rusher', 'support', 'medic')),
  status          TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline')),
  join_date       TEXT NOT NULL,
  kd_ratio        NUMERIC(4,2) NOT NULL DEFAULT 1.0,
  is_featured     BOOLEAN DEFAULT FALSE,
  is_leader       BOOLEAN DEFAULT FALSE,
  avatar_url      TEXT,
  bio             TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_members_role ON members(role);
CREATE INDEX IF NOT EXISTS idx_members_rank ON members(rank);
CREATE INDEX IF NOT EXISTS idx_members_featured ON members(is_featured);
CREATE INDEX IF NOT EXISTS idx_members_nickname ON members(nickname);

-- 3. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS members_updated_at ON members;
CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 4. Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read on members" ON members
  FOR SELECT USING (true);

-- Admin full access (using anon key for simplicity, matching current schedule admin)
CREATE POLICY "Allow admin insert on members" ON members
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin update on members" ON members
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin delete on members" ON members
  FOR DELETE USING (true);

-- 5. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE members;

-- ============================================================
-- 6. Storage Policy for bucket "bahuy" (public read, admin write)
-- ============================================================
-- Run these in Storage SQL editor or Dashboard if not already set:

-- Enable public access to bucket (if not already done)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('bahuy', 'bahuy', true)
-- ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can read from bahuy bucket
CREATE POLICY "Public read access to bahuy bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'bahuy');

-- Policy: Admin can upload/update/delete in bahuy bucket
CREATE POLICY "Admin full access to bahuy bucket" ON storage.objects
  FOR ALL USING (bucket_id = 'bahuy')
  WITH CHECK (bucket_id = 'bahuy');

-- ============================================================
-- 7. Seed Data (converted from src/data/members.ts)
-- ============================================================

INSERT INTO members (nickname, name, rank, city, role, status, join_date, kd_ratio, is_featured, is_leader, avatar_url, bio)
VALUES
  ('Abi', 'Abi', 'Major', 'Indonesia', 'support', 'online', '2024', 1.8, false, false, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/abi.jpeg', 'Solid support player. Always has the team''s back.'),
  ('Akmal', 'Akmal', 'Sergeant', 'Indonesia', 'rusher', 'offline', '2024', 1.5, false, false, NULL, 'Quick reflexes and aggressive playstyle.'),
  ('Anggoro', 'Anggoro', 'Captain', 'Indonesia', 'rusher', 'online', '2024', 1.7, false, false, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/anggoro.jpeg', 'Aggressive entry fragger with quick reflexes.'),
  ('Arnold', 'Arnold', 'Captain', 'Indonesia', 'sniper', 'online', '2024', 1.9, false, false, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/arnold.jpeg', 'Precision shooter. Calm under pressure.'),
  ('Bahuy', 'Bahuy', 'Colonel', 'Indonesia', 'sniper', 'online', '2024', 2.5, true, true, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/bahuy.jpeg', 'Original Ace. Founding member of TEAM ULTRA.'),
  ('Bobby', 'Bobby', 'Major', 'Indonesia', 'rusher', 'online', '2024', 1.8, false, false, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/bobby.jpeg', 'Fearless frontliner. First in, last out.'),
  ('Boy', 'Boy', 'Captain', 'Indonesia', 'medic', 'offline', '2024', 1.5, false, false, NULL, 'Reliable medic who keeps the squad alive.'),
  ('Bram', 'Bram', 'Lieutenant', 'Indonesia', 'support', 'online', '2024', 1.6, false, false, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/bram.jpeg', 'Tactical mind with great game sense.'),
  ('Christ', 'Christ', 'Captain', 'Indonesia', 'sniper', 'online', '2024', 2.0, false, false, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/christ.jpeg', 'Sharpshooter with deadly accuracy at range.'),
  ('Dimas', 'Dimas', 'Sergeant', 'Indonesia', 'support', 'offline', '2024', 1.4, false, false, NULL, 'Versatile support with solid game awareness.'),
  ('Dwiky', 'Dwiky', 'Sergeant', 'Indonesia', 'rusher', 'online', '2024', 1.6, false, false, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/dwiky.jpeg', 'Fast-paced attacker. Always pushing the tempo.'),
  ('Fadil', 'Fadil', 'Colonel', 'Indonesia', 'rusher', 'online', '2024', 2.3, true, true, NULL, 'Original Ace. Founding member of TEAM ULTRA.'),
  ('Farhan', 'Farhan', 'Colonel', 'Indonesia', 'support', 'online', '2024', 2.2, true, true, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/farhan.jpeg', 'Original Ace. Founding member of TEAM ULTRA.'),
  ('Ferdy', 'Ferdy', 'Lieutenant', 'Indonesia', 'sniper', 'online', '2024', 1.7, false, false, NULL, 'Sharp eyes and steady hands under fire.'),
  ('Galen', 'Galen', 'Colonel', 'Indonesia', 'sniper', 'online', '2024', 2.4, true, true, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/galen.jpeg', 'Original Ace. Founding member of TEAM ULTRA.'),
  ('Heru', 'Heru', 'Lieutenant', 'Indonesia', 'sniper', 'online', '2024', 1.9, false, false, NULL, 'Patient sniper. Waits for the perfect shot.'),
  ('Iwan', 'Iwan', 'Sergeant', 'Indonesia', 'support', 'online', '2024', 1.5, false, false, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/iwan.jpeg', 'Utility specialist. Smoke and flash expert.'),
  ('Jeffry', 'Jeffry', 'Major', 'Indonesia', 'rusher', 'online', '2024', 1.9, false, false, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/jeffry.jpeg', 'High-impact rusher with clutch potential.'),
  ('Jeshua', 'Jeshua', 'Captain', 'Indonesia', 'medic', 'online', '2024', 1.6, false, false, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/jesua.jpeg', 'Dedicated healer. Team-first mentality.'),
  ('Jevon', 'Jevon', 'Lieutenant', 'Indonesia', 'sniper', 'online', '2024', 1.8, false, false, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/jevon.jpeg', 'Rising talent with a keen eye for headshots.'),
  ('John', 'John', 'Colonel', 'Indonesia', 'rusher', 'online', '2024', 2.3, true, true, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/john.jpeg', 'Original Ace. Founding member of TEAM ULTRA.'),
  ('Ken', 'Ken', 'Sergeant', 'Indonesia', 'medic', 'offline', '2024', 1.4, false, false, NULL, 'Combat medic with quick revive skills.'),
  ('Ky', 'Ky', 'Captain', 'Indonesia', 'rusher', 'online', '2024', 1.7, false, false, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/ky.jpeg', 'Explosive entry. Thrives in chaos.'),
  ('Rendi', 'Rendi', 'Sergeant', 'Indonesia', 'support', 'online', '2024', 1.5, false, false, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/rendi.jpeg', 'Anchor player. Holds the site down.'),
  ('Ricky', 'Ricky', 'Major', 'Indonesia', 'sniper', 'online', '2024', 2.0, false, false, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/ricky.jpeg', 'Veteran sniper. Consistent and reliable.'),
  ('Roni', 'Roni', 'Sergeant', 'Indonesia', 'medic', 'offline', '2024', 1.4, false, false, NULL, 'Field medic who never leaves a teammate behind.'),
  ('Theo', 'Theo', 'Lieutenant', 'Indonesia', 'rusher', 'online', '2024', 1.7, false, false, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/theo.jpeg', 'Aggressive playstyle with smart rotations.'),
  ('Tony', 'Tony', 'Colonel', 'Indonesia', 'support', 'online', '2024', 2.1, false, true, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/tony.jpeg', 'Original Ace. Founding member of TEAM ULTRA.'),
  ('Yaden', 'Yaden', 'Sergeant', 'Indonesia', 'support', 'online', '2024', 1.5, false, false, 'https://qxatobfwiyuuxbatygwl.supabase.co/storage/v1/object/public/bahuy/jaden.jpeg', 'Dependable teammate. Always in the right position.'),
  ('Yudi', 'Yudi', 'Sergeant', 'Indonesia', 'rusher', 'offline', '2024', 1.3, false, false, NULL, 'Energetic rusher with unpredictable moves.')
ON CONFLICT (nickname) DO UPDATE SET
  bio = EXCLUDED.bio,
  is_featured = EXCLUDED.is_featured,
  is_leader = EXCLUDED.is_leader;

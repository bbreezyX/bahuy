-- ============================================================
-- Migration: Slim members table to 5 core columns
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Add new skills column (text array)
ALTER TABLE members
  ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';

-- 2. Drop removed columns
ALTER TABLE members
  DROP COLUMN IF EXISTS rank,
  DROP COLUMN IF EXISTS role,
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS join_date,
  DROP COLUMN IF EXISTS kd_ratio,
  DROP COLUMN IF EXISTS is_featured;

-- 3. Drop old indexes that referenced dropped columns
DROP INDEX IF EXISTS idx_members_role;
DROP INDEX IF EXISTS idx_members_rank;
DROP INDEX IF EXISTS idx_members_featured;

-- 4. Add GIN index for skills array queries
CREATE INDEX IF NOT EXISTS idx_members_skills ON members USING GIN (skills);

-- ============================================================
-- Remaining schema:
--   id, nickname, name, skills, city, is_leader,
--   avatar_url, bio, created_at, updated_at
-- ============================================================

-- ============================================================================
-- CREATE GOALS TABLE
-- ============================================================================
-- This script creates the goals table for tracking user wellness goals
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('health', 'fitness', 'wellness', 'personal', 'career', 'relationships')),
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
  target_date DATE,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_category ON goals(category);
CREATE INDEX IF NOT EXISTS idx_goals_target_date ON goals(target_date);

-- Enable Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users can only see their own goals
CREATE POLICY "Users can view their own goals"
  ON goals
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own goals
CREATE POLICY "Users can insert their own goals"
  ON goals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own goals
CREATE POLICY "Users can update their own goals"
  ON goals
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own goals
CREATE POLICY "Users can delete their own goals"
  ON goals
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER goals_updated_at_trigger
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_goals_updated_at();

-- Grant permissions
GRANT ALL ON goals TO authenticated;
GRANT ALL ON goals TO service_role;

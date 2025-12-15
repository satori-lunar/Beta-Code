-- ============================================================================
-- CREATE PATHWAYS SYSTEM
-- ============================================================================
-- This script creates the pathways system for guiding users through curated
-- class collections with badges, achievements, and streaks
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Create pathways table
CREATE TABLE IF NOT EXISTS pathways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  icon TEXT, -- Emoji or icon identifier
  color_gradient TEXT, -- Tailwind gradient classes
  class_titles TEXT[] NOT NULL, -- Array of class titles in this pathway
  total_classes INTEGER NOT NULL,
  estimated_duration TEXT, -- e.g., "8 weeks", "12 sessions"
  benefits TEXT[], -- Array of benefits
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user pathway progress table
CREATE TABLE IF NOT EXISTS user_pathway_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pathway_id UUID NOT NULL REFERENCES pathways(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  classes_completed INTEGER DEFAULT 0,
  total_classes INTEGER NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_class_completed_at TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, pathway_id)
);

-- Create pathway achievements table
CREATE TABLE IF NOT EXISTS pathway_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pathway_id UUID NOT NULL REFERENCES pathways(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL, -- 'enrolled', 'first_class', 'streak_3', 'streak_7', 'halfway', 'completed'
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  badge_icon TEXT, -- Emoji or icon
  badge_color TEXT, -- Color for the badge
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pathway_id, achievement_type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_pathway_progress_user_id ON user_pathway_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pathway_progress_pathway_id ON user_pathway_progress(pathway_id);
CREATE INDEX IF NOT EXISTS idx_pathway_achievements_user_id ON pathway_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_pathway_achievements_pathway_id ON pathway_achievements(pathway_id);

-- Enable Row Level Security
ALTER TABLE pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pathway_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pathways (public read)
CREATE POLICY "Anyone can view pathways"
  ON pathways
  FOR SELECT
  USING (true);

-- RLS Policies for user_pathway_progress
CREATE POLICY "Users can view their own pathway progress"
  ON user_pathway_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pathway progress"
  ON user_pathway_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pathway progress"
  ON user_pathway_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pathway progress"
  ON user_pathway_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for pathway_achievements
CREATE POLICY "Users can view their own achievements"
  ON pathway_achievements
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON pathway_achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pathways_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER pathways_updated_at_trigger
  BEFORE UPDATE ON pathways
  FOR EACH ROW
  EXECUTE FUNCTION update_pathways_updated_at();

CREATE TRIGGER user_pathway_progress_updated_at_trigger
  BEFORE UPDATE ON user_pathway_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_pathways_updated_at();

-- Grant permissions
GRANT ALL ON pathways TO authenticated;
GRANT ALL ON pathways TO service_role;
GRANT ALL ON user_pathway_progress TO authenticated;
GRANT ALL ON user_pathway_progress TO service_role;
GRANT ALL ON pathway_achievements TO authenticated;
GRANT ALL ON pathway_achievements TO service_role;

-- Insert the 4 pathways
INSERT INTO pathways (title, description, icon, color_gradient, class_titles, total_classes, estimated_duration, benefits) VALUES
(
  'Self Compassion',
  'Cultivate kindness toward yourself through mindful movement, nourishing practices, and heart-centered yoga. Perfect for those seeking to develop a gentler relationship with themselves.',
  '💝',
  'from-pink-400 to-rose-500',
  ARRAY['Inner Chords', 'Foundation in Motion', 'Heart of Nourishment', 'Nighttime Nurturing', 'Hatha Yoga'],
  5,
  '5 weeks',
  ARRAY['Develop self-kindness', 'Reduce self-criticism', 'Improve emotional well-being', 'Build a sustainable self-care practice']
),
(
  'Relationships',
  'Navigate the complexities of human connection, process grief, and deepen your understanding of yourself in relation to others.',
  '🤝',
  'from-purple-400 to-indigo-500',
  ARRAY['Refreshed and Ready', 'Grief & Growth', 'Tangled', 'Reflecting Pool'],
  4,
  '4 weeks',
  ARRAY['Improve communication skills', 'Process difficult emotions', 'Strengthen connections', 'Gain relationship insights']
),
(
  'Life Balance',
  'Create structure, find wisdom, and cultivate daily practices that bring harmony to your life. Ideal for those feeling overwhelmed or seeking more intentional living.',
  '⚖️',
  'from-emerald-400 to-teal-500',
  ARRAY['Plan Your Week', 'Evenings W/Emily', 'Wisdom Rising', 'Instinctive Meditation'],
  4,
  '4 weeks',
  ARRAY['Better time management', 'Reduced stress', 'Increased clarity', 'More intentional living']
),
(
  'Weight Health',
  'A holistic approach to weight and wellness combining mindful eating, strength training, habit formation, and root-cause exploration.',
  '🌱',
  'from-green-400 to-emerald-500',
  ARRAY['Rooted Weight Health', 'Strength in Motion', '2-Bite Tuesdays', 'The Habit Lab'],
  4,
  '4 weeks',
  ARRAY['Sustainable weight management', 'Build healthy habits', 'Improve relationship with food', 'Increase strength and energy']
);

-- Enhanced Habits System
-- Adds notes, points, and analytics support

-- Habit notes table (for storing notes per completion)
CREATE TABLE IF NOT EXISTS public.habit_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, completed_date)
);

-- User points and gamification
CREATE TABLE IF NOT EXISTS public.user_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_level_points INTEGER DEFAULT 0,
  points_to_next_level INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Points history (for tracking point sources)
CREATE TABLE IF NOT EXISTS public.points_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  source TEXT NOT NULL, -- 'habit_complete', 'streak_bonus', 'badge_earned', etc.
  source_id UUID, -- ID of the related item (habit_id, badge_id, etc.)
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add notes column to habits table if it doesn't exist (for general habit notes)
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_habit_notes_habit_id ON public.habit_notes(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_notes_user_id ON public.habit_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_notes_date ON public.habit_notes(completed_date);
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON public.user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_points_history_user_id ON public.points_history(user_id);
CREATE INDEX IF NOT EXISTS idx_points_history_created_at ON public.points_history(created_at);

-- Enable RLS
ALTER TABLE public.habit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for habit_notes
CREATE POLICY "Users can view their own habit notes"
  ON public.habit_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit notes"
  ON public.habit_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit notes"
  ON public.habit_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit notes"
  ON public.habit_notes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for user_points
CREATE POLICY "Users can view their own points"
  ON public.user_points FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points"
  ON public.user_points FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own points"
  ON public.user_points FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for points_history
CREATE POLICY "Users can view their own points history"
  ON public.points_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points history"
  ON public.points_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to calculate level from points
CREATE OR REPLACE FUNCTION calculate_level(points INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Level 1: 0-99, Level 2: 100-249, Level 3: 250-499, etc.
  -- Formula: level = floor(sqrt(points / 25)) + 1
  RETURN FLOOR(SQRT(points / 25.0)) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate points needed for next level
CREATE OR REPLACE FUNCTION points_to_next_level(current_level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Points needed to reach next level from current level
  -- Level 1: 0-99, Level 2: 100-249, Level 3: 250-499, etc.
  -- Points for level N = (N-1)^2 * 25
  -- Points needed for next level = (current_level^2 * 25) - (current_level-1)^2 * 25
  IF current_level = 1 THEN
    RETURN 100;
  ELSE
    RETURN (current_level * current_level * 25) - ((current_level - 1) * (current_level - 1) * 25);
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to award points
CREATE OR REPLACE FUNCTION award_points(
  p_user_id UUID,
  p_points INTEGER,
  p_source TEXT,
  p_source_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_current_points INTEGER;
  v_new_level INTEGER;
  v_points_to_next INTEGER;
  v_prev_level_points INTEGER;
BEGIN
  -- Insert into points history
  INSERT INTO public.points_history (user_id, points, source, source_id, description)
  VALUES (p_user_id, p_points, p_source, p_source_id, p_description);

  -- Update or insert user_points
  INSERT INTO public.user_points (user_id, total_points, level, current_level_points, points_to_next_level)
  VALUES (p_user_id, p_points, calculate_level(p_points), p_points, points_to_next_level(calculate_level(p_points)))
  ON CONFLICT (user_id) DO UPDATE SET
    total_points = user_points.total_points + p_points,
    updated_at = NOW();

  -- Recalculate level
  SELECT total_points INTO v_current_points FROM public.user_points WHERE user_id = p_user_id;
  v_new_level := calculate_level(v_current_points);
  
  -- Calculate points in current level (points beyond the previous level threshold)
  IF v_new_level = 1 THEN
    v_prev_level_points := 0;
  ELSE
    v_prev_level_points := ((v_new_level - 1) * (v_new_level - 1) * 25);
  END IF;
  
  v_points_to_next := points_to_next_level(v_new_level);
  
  UPDATE public.user_points
  SET
    level = v_new_level,
    current_level_points = v_current_points - v_prev_level_points,
    points_to_next_level = GREATEST(0, v_points_to_next - (v_current_points - v_prev_level_points)),
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;


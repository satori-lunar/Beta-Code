-- Expand Badge System
-- Adds many more badges and ways to earn them

-- Insert comprehensive badge collection
INSERT INTO public.badges (id, name, description, icon, category) VALUES
-- Streak Badges
(uuid_generate_v4(), 'Week Warrior', 'Maintain a 7-day streak', 'flame', 'streak'),
(uuid_generate_v4(), 'Consistency King', 'Maintain a 30-day streak', 'trophy', 'streak'),
(uuid_generate_v4(), 'Century Club', 'Maintain a 100-day streak', 'zap', 'streak'),
(uuid_generate_v4(), 'Half Year Hero', 'Maintain a 180-day streak', 'award', 'streak'),
(uuid_generate_v4(), 'Year Warrior', 'Maintain a 365-day streak', 'crown', 'streak'),

-- Habit Badges
(uuid_generate_v4(), 'First Steps', 'Complete your first habit', 'target', 'habit'),
(uuid_generate_v4(), 'Habit Builder', 'Complete 10 habits', 'check-circle', 'habit'),
(uuid_generate_v4(), 'Habit Master', 'Complete 50 habits', 'award', 'habit'),
(uuid_generate_v4(), 'Habit Legend', 'Complete 100 habits', 'trophy', 'habit'),
(uuid_generate_v4(), 'Perfect Week', 'Complete all habits for 7 days straight', 'star', 'habit'),
(uuid_generate_v4(), 'Perfect Month', 'Complete all habits for 30 days straight', 'crown', 'habit'),
(uuid_generate_v4(), 'Early Bird', 'Complete morning habits 10 times', 'sun', 'habit'),
(uuid_generate_v4(), 'Night Owl', 'Complete evening habits 10 times', 'moon', 'habit'),
(uuid_generate_v4(), 'Multi-Tasker', 'Maintain 5 active habits', 'layers', 'habit'),
(uuid_generate_v4(), 'Consistency Champion', 'Complete habits with 80%+ rate for 30 days', 'trending-up', 'habit'),

-- Journal Badges
(uuid_generate_v4(), 'Journaling Beginner', 'Write your first journal entry', 'book-open', 'mindfulness'),
(uuid_generate_v4(), 'Reflective Writer', 'Write 5 journal entries', 'pen-tool', 'mindfulness'),
(uuid_generate_v4(), 'Daily Diarist', 'Write 30 journal entries', 'book', 'mindfulness'),
(uuid_generate_v4(), 'Gratitude Guru', 'Write 10 gratitude entries', 'heart', 'mindfulness'),
(uuid_generate_v4(), 'Mindful Writer', 'Write 100 journal entries', 'sparkles', 'mindfulness'),
(uuid_generate_v4(), 'Journal Streak', 'Write journal entries for 7 days straight', 'flame', 'mindfulness'),

-- Nutrition Badges
(uuid_generate_v4(), 'Nutrition Starter', 'Log your first meal', 'utensils', 'nutrition'),
(uuid_generate_v4(), 'Meal Logger', 'Log meals for 7 days', 'calendar', 'nutrition'),
(uuid_generate_v4(), 'Balanced Eater', 'Log meals for 30 days', 'check-circle', 'nutrition'),
(uuid_generate_v4(), 'Hydration Hero', 'Meet water goals for 10 days', 'droplet', 'nutrition'),
(uuid_generate_v4(), 'Protein Power', 'Meet protein goals for 5 days', 'zap', 'nutrition'),
(uuid_generate_v4(), 'Nutrition Master', 'Log meals for 100 days', 'award', 'nutrition'),
(uuid_generate_v4(), 'Goal Getter', 'Meet nutrition goals for 7 days straight', 'target', 'nutrition'),

-- Workout/Session Badges
(uuid_generate_v4(), 'Fitness Enthusiast', 'Complete your first workout', 'dumbbell', 'workout'),
(uuid_generate_v4(), 'Active Starter', 'Complete 5 sessions', 'activity', 'workout'),
(uuid_generate_v4(), 'Workout Warrior', 'Complete 25 sessions', 'zap', 'workout'),
(uuid_generate_v4(), 'Fitness Champion', 'Complete 100 sessions', 'trophy', 'workout'),
(uuid_generate_v4(), 'Course Completer', 'Finish your first course', 'graduation-cap', 'special'),
(uuid_generate_v4(), 'Course Master', 'Complete 5 courses', 'award', 'special'),
(uuid_generate_v4(), 'Live Class Attendee', 'Attend your first live class', 'users', 'special'),
(uuid_generate_v4(), 'Regular Attendee', 'Attend 10 live classes', 'calendar', 'special'),
(uuid_generate_v4(), 'Session Streak', 'Complete sessions for 7 days straight', 'flame', 'workout'),

-- Mindfulness Badges
(uuid_generate_v4(), 'Mindful Beginner', 'Complete your first mindfulness session', 'brain', 'mindfulness'),
(uuid_generate_v4(), 'Zen Seeker', 'Complete 10 meditation sessions', 'sparkles', 'mindfulness'),
(uuid_generate_v4(), 'Mindfulness Master', 'Complete 50 meditation sessions', 'lotus', 'mindfulness'),
(uuid_generate_v4(), 'Breathing Pro', 'Complete 20 breathing exercises', 'wind', 'mindfulness'),
(uuid_generate_v4(), 'Calm Collector', 'Complete 5 different mindfulness types', 'heart', 'mindfulness'),

-- Points & Levels Badges
(uuid_generate_v4(), 'Point Collector', 'Earn 100 points', 'star', 'special'),
(uuid_generate_v4(), 'Point Master', 'Earn 500 points', 'award', 'special'),
(uuid_generate_v4(), 'Point Legend', 'Earn 1000 points', 'trophy', 'special'),
(uuid_generate_v4(), 'Level Up', 'Reach level 5', 'trending-up', 'special'),
(uuid_generate_v4(), 'Level Master', 'Reach level 10', 'crown', 'special'),
(uuid_generate_v4(), 'Level Legend', 'Reach level 20', 'zap', 'special'),

-- Consistency & Achievement Badges
(uuid_generate_v4(), 'Track Star', 'Log your first weight entry', 'scale', 'special'),
(uuid_generate_v4(), 'Health Tracker', 'Log health metrics for 7 days', 'activity', 'special'),
(uuid_generate_v4(), 'Wellness Champion', 'Track health metrics for 30 days', 'heart', 'special'),
(uuid_generate_v4(), 'All Around', 'Earn badges in 5 different categories', 'layers', 'special'),
(uuid_generate_v4(), 'Wellness Warrior', 'Earn 10 different badges', 'shield', 'special'),
(uuid_generate_v4(), 'Badge Collector', 'Earn 20 different badges', 'award', 'special'),
(uuid_generate_v4(), 'Badge Master', 'Earn 30 different badges', 'trophy', 'special'),

-- Special Milestone Badges
(uuid_generate_v4(), 'New Member', 'Join the platform', 'user-plus', 'special'),
(uuid_generate_v4(), 'Week One', 'Complete your first week', 'calendar', 'special'),
(uuid_generate_v4(), 'Month One', 'Complete your first month', 'calendar', 'special'),
(uuid_generate_v4(), 'Quarter Champion', 'Complete 3 months', 'award', 'special'),
(uuid_generate_v4(), 'Half Year Hero', 'Complete 6 months', 'trophy', 'special'),
(uuid_generate_v4(), 'Year Warrior', 'Complete 1 year', 'crown', 'special')
ON CONFLICT DO NOTHING;

-- Create function to check and award habit completion badges
CREATE OR REPLACE FUNCTION check_habit_completion_badges(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_total_completions INTEGER;
  v_perfect_weeks INTEGER;
  v_perfect_months INTEGER;
  v_active_habits INTEGER;
BEGIN
  -- Count total habit completions
  SELECT COUNT(*) INTO v_total_completions
  FROM habits
  WHERE user_id = p_user_id
  AND completed_dates IS NOT NULL
  AND jsonb_array_length(completed_dates::jsonb) > 0;

  -- Check completion milestone badges
  IF v_total_completions >= 10 THEN
    PERFORM award_badge_by_name(p_user_id, 'Habit Builder');
  END IF;
  IF v_total_completions >= 50 THEN
    PERFORM award_badge_by_name(p_user_id, 'Habit Master');
  END IF;
  IF v_total_completions >= 100 THEN
    PERFORM award_badge_by_name(p_user_id, 'Habit Legend');
  END IF;

  -- Count active habits
  SELECT COUNT(*) INTO v_active_habits
  FROM habits
  WHERE user_id = p_user_id;

  IF v_active_habits >= 5 THEN
    PERFORM award_badge_by_name(p_user_id, 'Multi-Tasker');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to check and award journal badges
CREATE OR REPLACE FUNCTION check_journal_badges(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_total_entries INTEGER;
  v_gratitude_entries INTEGER;
BEGIN
  -- Count total journal entries
  SELECT COUNT(*) INTO v_total_entries
  FROM journal_entries
  WHERE user_id = p_user_id;

  -- Check journal milestone badges
  IF v_total_entries >= 5 THEN
    PERFORM award_badge_by_name(p_user_id, 'Reflective Writer');
  END IF;
  IF v_total_entries >= 30 THEN
    PERFORM award_badge_by_name(p_user_id, 'Daily Diarist');
  END IF;
  IF v_total_entries >= 100 THEN
    PERFORM award_badge_by_name(p_user_id, 'Mindful Writer');
  END IF;

  -- Count gratitude entries
  SELECT COUNT(*) INTO v_gratitude_entries
  FROM journal_entries
  WHERE user_id = p_user_id
  AND gratitude IS NOT NULL
  AND array_length(gratitude, 1) > 0;

  IF v_gratitude_entries >= 10 THEN
    PERFORM award_badge_by_name(p_user_id, 'Gratitude Guru');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to check and award nutrition badges
CREATE OR REPLACE FUNCTION check_nutrition_badges(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_total_entries INTEGER;
  v_hydration_days INTEGER;
BEGIN
  -- Count total nutrition entries
  SELECT COUNT(*) INTO v_total_entries
  FROM nutrition_entries
  WHERE user_id = p_user_id;

  -- Check nutrition milestone badges
  IF v_total_entries >= 7 THEN
    PERFORM award_badge_by_name(p_user_id, 'Meal Logger');
  END IF;
  IF v_total_entries >= 30 THEN
    PERFORM award_badge_by_name(p_user_id, 'Balanced Eater');
  END IF;
  IF v_total_entries >= 100 THEN
    PERFORM award_badge_by_name(p_user_id, 'Nutrition Master');
  END IF;

  -- Count hydration goal days (assuming water_intake > 0 means goal met)
  SELECT COUNT(*) INTO v_hydration_days
  FROM nutrition_entries
  WHERE user_id = p_user_id
  AND water_intake > 0
  AND date >= CURRENT_DATE - INTERVAL '30 days';

  IF v_hydration_days >= 10 THEN
    PERFORM award_badge_by_name(p_user_id, 'Hydration Hero');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to check and award points/level badges
CREATE OR REPLACE FUNCTION check_points_badges(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_total_points INTEGER;
  v_level INTEGER;
BEGIN
  SELECT total_points, level INTO v_total_points, v_level
  FROM user_points
  WHERE user_id = p_user_id;

  IF v_total_points IS NULL THEN
    RETURN;
  END IF;

  -- Check points milestone badges
  IF v_total_points >= 100 THEN
    PERFORM award_badge_by_name(p_user_id, 'Point Collector');
  END IF;
  IF v_total_points >= 500 THEN
    PERFORM award_badge_by_name(p_user_id, 'Point Master');
  END IF;
  IF v_total_points >= 1000 THEN
    PERFORM award_badge_by_name(p_user_id, 'Point Legend');
  END IF;

  -- Check level milestone badges
  IF v_level >= 5 THEN
    PERFORM award_badge_by_name(p_user_id, 'Level Up');
  END IF;
  IF v_level >= 10 THEN
    PERFORM award_badge_by_name(p_user_id, 'Level Master');
  END IF;
  IF v_level >= 20 THEN
    PERFORM award_badge_by_name(p_user_id, 'Level Legend');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Helper function to award badge by name
CREATE OR REPLACE FUNCTION award_badge_by_name(p_user_id UUID, p_badge_name TEXT)
RETURNS VOID AS $$
DECLARE
  v_badge_id UUID;
  v_already_has BOOLEAN;
BEGIN
  -- Get badge ID
  SELECT id INTO v_badge_id
  FROM badges
  WHERE name = p_badge_name;

  IF v_badge_id IS NULL THEN
    RETURN;
  END IF;

  -- Check if user already has this badge
  SELECT EXISTS(
    SELECT 1 FROM user_badges
    WHERE user_id = p_user_id
    AND badge_id = v_badge_id
  ) INTO v_already_has;

  IF NOT v_already_has THEN
    -- Award the badge
    INSERT INTO user_badges (user_id, badge_id, earned_date)
    VALUES (p_user_id, v_badge_id, CURRENT_DATE)
    ON CONFLICT (user_id, badge_id) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to check all badges (comprehensive check)
CREATE OR REPLACE FUNCTION check_all_badges(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM check_habit_completion_badges(p_user_id);
  PERFORM check_journal_badges(p_user_id);
  PERFORM check_nutrition_badges(p_user_id);
  PERFORM check_points_badges(p_user_id);
END;
$$ LANGUAGE plpgsql;


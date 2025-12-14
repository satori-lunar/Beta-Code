-- Enhance Activity Tracking
-- This migration adds comprehensive activity tracking for all user actions

-- Step 1: Create user_activity table (this must run first)
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Drop existing constraint if it exists
ALTER TABLE public.user_activity 
DROP CONSTRAINT IF EXISTS user_activity_activity_type_check;

-- Step 3: Add constraint with all activity types
ALTER TABLE public.user_activity 
ADD CONSTRAINT user_activity_activity_type_check 
CHECK (activity_type IN (
  'video_view',
  'favorite_added',
  'favorite_removed',
  'reminder_set',
  'reminder_cancelled',
  'login',
  'weight_logged',
  'journal_entry_created',
  'journal_entry_updated',
  'habit_completed',
  'session_completed'
));

-- Step 4: Add helpful columns
ALTER TABLE public.user_activity 
ADD COLUMN IF NOT EXISTS activity_description TEXT,
ADD COLUMN IF NOT EXISTS entity_title TEXT;

-- Step 5: Create indexes
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON public.user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created ON public.user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_entity_title ON public.user_activity(entity_title);
CREATE INDEX IF NOT EXISTS idx_user_activity_description ON public.user_activity(activity_description);

-- Step 6: Enable RLS
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies
DROP POLICY IF EXISTS "Users can view own activity" ON public.user_activity;
CREATE POLICY "Users can view own activity"
  ON public.user_activity FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all activity" ON public.user_activity;
CREATE POLICY "Admins can view all activity"
  ON public.user_activity FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can insert own activity" ON public.user_activity;
CREATE POLICY "Users can insert own activity"
  ON public.user_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Step 8: Create view for organized display
CREATE OR REPLACE VIEW public.user_activity_detailed AS
SELECT 
  ua.id,
  ua.user_id,
  u.email as user_email,
  u.name as user_name,
  ua.activity_type,
  ua.activity_description,
  ua.entity_type,
  ua.entity_id,
  ua.entity_title,
  ua.metadata,
  ua.created_at,
  CASE 
    WHEN ua.activity_type = 'video_view' THEN 'Video View'
    WHEN ua.activity_type = 'favorite_added' THEN 'Favorite Added'
    WHEN ua.activity_type = 'favorite_removed' THEN 'Favorite Removed'
    WHEN ua.activity_type = 'reminder_set' THEN 'Reminder Set'
    WHEN ua.activity_type = 'reminder_cancelled' THEN 'Reminder Cancelled'
    WHEN ua.activity_type = 'login' THEN 'Login'
    WHEN ua.activity_type = 'weight_logged' THEN 'Weight Logged'
    WHEN ua.activity_type = 'journal_entry_created' THEN 'Journal Entry Created'
    WHEN ua.activity_type = 'journal_entry_updated' THEN 'Journal Entry Updated'
    WHEN ua.activity_type = 'habit_completed' THEN 'Habit Completed'
    WHEN ua.activity_type = 'session_completed' THEN 'Session Completed'
    ELSE ua.activity_type
  END as activity_label,
  TO_CHAR(ua.created_at, 'YYYY-MM-DD HH24:MI:SS') as formatted_time
FROM public.user_activity ua
LEFT JOIN public.users u ON ua.user_id = u.id
ORDER BY ua.created_at DESC;

-- Step 9: Grant access
GRANT SELECT ON public.user_activity_detailed TO authenticated;

-- Step 10: Add documentation
COMMENT ON TABLE public.user_activity IS 'Comprehensive activity tracking for all user actions in the dashboard. Use user_activity_detailed view for organized display.';
COMMENT ON COLUMN public.user_activity.activity_description IS 'Human-readable description of the activity';
COMMENT ON COLUMN public.user_activity.entity_title IS 'Title/name of the entity (e.g., class title, journal entry title)';

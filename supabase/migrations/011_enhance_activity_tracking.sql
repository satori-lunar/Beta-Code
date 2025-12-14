-- Enhance Activity Tracking
-- This migration adds comprehensive activity tracking for all user actions

-- Add new activity types to user_activity table
ALTER TABLE public.user_activity 
DROP CONSTRAINT IF EXISTS user_activity_activity_type_check;

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

-- Add helpful columns for better organization
ALTER TABLE public.user_activity 
ADD COLUMN IF NOT EXISTS activity_description TEXT,
ADD COLUMN IF NOT EXISTS entity_title TEXT; -- Human-readable title (e.g., "Yoga Class", "Weight: 70kg")

-- Create a view for organized activity display in Supabase
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
  -- Add helpful computed fields
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
  -- Format timestamp nicely
  TO_CHAR(ua.created_at, 'YYYY-MM-DD HH24:MI:SS') as formatted_time
FROM public.user_activity ua
LEFT JOIN public.users u ON ua.user_id = u.id
ORDER BY ua.created_at DESC;

-- Create index on entity_title for better search
CREATE INDEX IF NOT EXISTS idx_user_activity_entity_title ON public.user_activity(entity_title);

-- Create index on activity_description
CREATE INDEX IF NOT EXISTS idx_user_activity_description ON public.user_activity(activity_description);

-- Grant access to the view
GRANT SELECT ON public.user_activity_detailed TO authenticated;

-- Add comment to table for documentation
COMMENT ON TABLE public.user_activity IS 'Comprehensive activity tracking for all user actions in the dashboard. Use user_activity_detailed view for organized display.';
COMMENT ON COLUMN public.user_activity.activity_description IS 'Human-readable description of the activity';
COMMENT ON COLUMN public.user_activity.entity_title IS 'Title/name of the entity (e.g., class title, journal entry title)';

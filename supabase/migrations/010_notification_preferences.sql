-- Notification Preferences and Scheduled Reminders
-- This migration creates tables for user notification preferences and scheduled reminders

-- Notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Reminder preferences (enabled/disabled and times)
  habit_reminders_enabled BOOLEAN DEFAULT true,
  habit_reminder_time TIME DEFAULT '09:00:00', -- Default 9 AM
  
  journal_reminders_enabled BOOLEAN DEFAULT true,
  journal_reminder_time TIME DEFAULT '20:00:00', -- Default 8 PM
  
  mental_health_reminders_enabled BOOLEAN DEFAULT true,
  mental_health_reminder_time TIME DEFAULT '14:00:00', -- Default 2 PM
  
  goal_reminders_enabled BOOLEAN DEFAULT true,
  goal_reminder_frequency TEXT DEFAULT 'daily' CHECK (goal_reminder_frequency IN ('daily', 'weekly', 'never')),
  goal_reminder_time TIME DEFAULT '10:00:00', -- Default 10 AM
  
  -- General preferences
  streak_reminders_enabled BOOLEAN DEFAULT true,
  achievement_notifications_enabled BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON public.notification_preferences(user_id);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own notification preferences"
  ON public.notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences"
  ON public.notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
  ON public.notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to automatically create default preferences when user is created
CREATE OR REPLACE FUNCTION public.handle_new_user_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create preferences when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created_notification_preferences ON auth.users;
CREATE TRIGGER on_auth_user_created_notification_preferences
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_notification_preferences();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_notification_preferences_updated_at();

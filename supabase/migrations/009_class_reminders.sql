-- Class Reminders Table
-- Stores user reminders for live classes with notification preferences

CREATE TABLE IF NOT EXISTS public.class_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  live_class_id UUID NOT NULL REFERENCES public.live_classes(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('push', 'email')),
  reminder_minutes_before INTEGER NOT NULL CHECK (reminder_minutes_before IN (5, 15)),
  scheduled_reminder_time TIMESTAMPTZ NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, live_class_id, notification_type, reminder_minutes_before)
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_class_reminders_user_id ON public.class_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_class_reminders_live_class_id ON public.class_reminders(live_class_id);
CREATE INDEX IF NOT EXISTS idx_class_reminders_scheduled_time ON public.class_reminders(scheduled_reminder_time);
CREATE INDEX IF NOT EXISTS idx_class_reminders_sent ON public.class_reminders(sent) WHERE sent = FALSE;

-- Enable Row Level Security
ALTER TABLE public.class_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own reminders"
  ON public.class_reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders"
  ON public.class_reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
  ON public.class_reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
  ON public.class_reminders FOR DELETE
  USING (auth.uid() = user_id);

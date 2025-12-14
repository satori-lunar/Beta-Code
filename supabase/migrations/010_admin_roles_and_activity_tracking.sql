-- Admin Roles and Activity Tracking
-- This migration adds admin role support and activity tracking for analytics

-- Add role column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin'));

-- Create admin_users table to track admin assignments
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity tracking table for user actions
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'video_view',
    'favorite_added',
    'favorite_removed',
    'reminder_set',
    'reminder_cancelled',
    'login',
    'weight_logged',
    'habit_completed',
    'session_completed'
  )),
  entity_type TEXT, -- 'recorded_session', 'live_class', 'course', etc.
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video view tracking (specific table for video analytics)
CREATE TABLE IF NOT EXISTS public.video_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.recorded_sessions(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  duration_seconds INTEGER, -- How long they watched
  completed BOOLEAN DEFAULT FALSE, -- Did they watch to the end
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Login tracking
CREATE TABLE IF NOT EXISTS public.user_logins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  login_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON public.user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created ON public.user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_views_user_id ON public.video_views(user_id);
CREATE INDEX IF NOT EXISTS idx_video_views_session_id ON public.video_views(session_id);
CREATE INDEX IF NOT EXISTS idx_user_logins_user_id ON public.user_logins(user_id);
CREATE INDEX IF NOT EXISTS idx_user_logins_login_at ON public.user_logins(login_at DESC);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_logins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users (only admins can view)
CREATE POLICY "Admins can view all admin users"
  ON public.admin_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for user_activity (users see their own, admins see all)
CREATE POLICY "Users can view own activity"
  ON public.user_activity FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity"
  ON public.user_activity FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can insert own activity"
  ON public.user_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for video_views (users see their own, admins see all)
CREATE POLICY "Users can view own video views"
  ON public.video_views FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all video views"
  ON public.video_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can insert own video views"
  ON public.video_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_logins (users see their own, admins see all)
CREATE POLICY "Users can view own logins"
  ON public.user_logins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all logins"
  ON public.user_logins FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "System can insert logins"
  ON public.user_logins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to set user as admin (can be called by existing admins)
CREATE OR REPLACE FUNCTION public.set_user_admin(target_user_id UUID, admin_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update user role
  UPDATE public.users 
  SET role = 'admin' 
  WHERE id = target_user_id;
  
  -- Add to admin_users table
  INSERT INTO public.admin_users (user_id, email, assigned_by)
  VALUES (target_user_id, admin_email, auth.uid())
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Set up first admin (elliotmccormick@satori-lunar.com)
-- Note: This will need to be run after the user account exists
-- You can run this manually after the user signs up:
-- SELECT public.set_user_admin(
--   (SELECT id FROM auth.users WHERE email = 'elliotmccormick@satori-lunar.com'),
--   'elliotmccormick@satori-lunar.com'
-- );

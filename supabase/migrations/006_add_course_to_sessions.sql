-- First, ensure the courses table exists (in case migrations weren't run in order)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  instructor TEXT NOT NULL,
  duration TEXT NOT NULL,
  sessions INTEGER NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on courses if not already enabled
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for courses if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'courses' 
    AND policyname = 'Courses are viewable by all'
  ) THEN
    CREATE POLICY "Courses are viewable by all" ON public.courses FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- Add course_id to recorded_sessions to link sessions to courses
ALTER TABLE public.recorded_sessions 
ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_recorded_sessions_course_id 
ON public.recorded_sessions(course_id);

-- Ensure recorded_sessions table exists (in case migrations weren't run in order)
CREATE TABLE IF NOT EXISTS public.recorded_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructor TEXT NOT NULL,
  recorded_at DATE NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  synced_from_kajabi BOOLEAN DEFAULT FALSE,
  kajabi_product_id TEXT,
  kajabi_offering_id TEXT
);

-- Enable RLS on recorded_sessions if not already enabled
ALTER TABLE public.recorded_sessions ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for recorded_sessions if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'recorded_sessions' 
    AND policyname = 'Recorded sessions are viewable by all'
  ) THEN
    CREATE POLICY "Recorded sessions are viewable by all" ON public.recorded_sessions FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- Ensure users table exists (for foreign key)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add user session completion tracking
CREATE TABLE IF NOT EXISTS public.user_session_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.recorded_sessions(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_session_completions_user_id 
ON public.user_session_completions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_session_completions_session_id 
ON public.user_session_completions(session_id);

-- Enable RLS
ALTER TABLE public.user_session_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own completions
CREATE POLICY "Users can view their own session completions" 
ON public.user_session_completions FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own completions
CREATE POLICY "Users can insert their own session completions" 
ON public.user_session_completions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own completions
CREATE POLICY "Users can delete their own session completions" 
ON public.user_session_completions FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

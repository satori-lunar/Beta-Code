-- Complete setup script - run this ONE TIME to set everything up
-- This creates all tables and adds the course_id column

-- ============================================
-- STEP 1: Create all necessary tables
-- ============================================

-- 1. Create users table (if not exists)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create courses table
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

-- 3. Create recorded_sessions table (without course_id first)
CREATE TABLE IF NOT EXISTS public.recorded_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructor TEXT NOT NULL,
  recorded_at DATE NOT NULL,
  duration INTEGER NOT NULL,
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

-- 4. Add course_id column to recorded_sessions if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'recorded_sessions' 
    AND column_name = 'course_id'
  ) THEN
    ALTER TABLE public.recorded_sessions 
    ADD COLUMN course_id UUID;
    
    -- Add foreign key constraint
    ALTER TABLE public.recorded_sessions 
    ADD CONSTRAINT recorded_sessions_course_id_fkey 
    FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE SET NULL;
    
    RAISE NOTICE 'Added course_id column and foreign key';
  END IF;
END $$;

-- 5. Create user_favorite_sessions table
CREATE TABLE IF NOT EXISTS public.user_favorite_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.recorded_sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_id)
);

-- 6. Create user_session_completions table
CREATE TABLE IF NOT EXISTS public.user_session_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.recorded_sessions(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_id)
);

-- ============================================
-- STEP 2: Create indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_recorded_sessions_course_id 
ON public.recorded_sessions(course_id);

CREATE INDEX IF NOT EXISTS idx_user_session_completions_user_id 
ON public.user_session_completions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_session_completions_session_id 
ON public.user_session_completions(session_id);

-- ============================================
-- STEP 3: Enable RLS
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recorded_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_session_completions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: Create RLS Policies
-- ============================================

-- Users policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Users can view own data'
  ) THEN
    CREATE POLICY "Users can view own data" ON public.users FOR SELECT TO authenticated USING (auth.uid() = id);
  END IF;
END $$;

-- Courses policies
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

-- Recorded sessions policies
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

-- User favorite sessions policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_favorite_sessions' 
    AND policyname = 'Users can manage their own favorites'
  ) THEN
    CREATE POLICY "Users can manage their own favorites" ON public.user_favorite_sessions 
    FOR ALL TO authenticated 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- User session completions policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_session_completions' 
    AND policyname = 'Users can view their own session completions'
  ) THEN
    CREATE POLICY "Users can view their own session completions" 
    ON public.user_session_completions FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_session_completions' 
    AND policyname = 'Users can insert their own session completions'
  ) THEN
    CREATE POLICY "Users can insert their own session completions" 
    ON public.user_session_completions FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_session_completions' 
    AND policyname = 'Users can delete their own session completions'
  ) THEN
    CREATE POLICY "Users can delete their own session completions" 
    ON public.user_session_completions FOR DELETE 
    TO authenticated 
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create missing tables for Classes/Recordings functionality
-- Run this in Supabase SQL Editor if you get "relation does not exist" errors

-- Live classes
CREATE TABLE IF NOT EXISTS public.live_classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructor TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  zoom_link TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recorded sessions
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User favorite sessions
CREATE TABLE IF NOT EXISTS public.user_favorite_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.recorded_sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_id)
);

-- Add Kajabi tracking fields (if migration 005 wasn't run)
DO $$ 
BEGIN
  -- Add to recorded_sessions
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'recorded_sessions' 
                 AND column_name = 'kajabi_product_id') THEN
    ALTER TABLE public.recorded_sessions 
    ADD COLUMN kajabi_product_id TEXT,
    ADD COLUMN kajabi_offering_id TEXT,
    ADD COLUMN synced_from_kajabi BOOLEAN DEFAULT FALSE;
  END IF;

  -- Add to users
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'kajabi_contact_id') THEN
    ALTER TABLE public.users 
    ADD COLUMN kajabi_contact_id TEXT,
    ADD COLUMN kajabi_tags TEXT[],
    ADD COLUMN synced_from_kajabi BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_live_classes_scheduled_at ON public.live_classes(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_recorded_sessions_kajabi_product_id ON public.recorded_sessions(kajabi_product_id);
CREATE INDEX IF NOT EXISTS idx_users_kajabi_contact_id ON public.users(kajabi_contact_id);

-- Add unique constraints for Kajabi syncing
CREATE UNIQUE INDEX IF NOT EXISTS idx_recorded_sessions_kajabi_unique 
ON public.recorded_sessions(kajabi_product_id, kajabi_offering_id) 
WHERE kajabi_product_id IS NOT NULL AND kajabi_offering_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_recorded_sessions_kajabi_product_unique 
ON public.recorded_sessions(kajabi_product_id) 
WHERE kajabi_product_id IS NOT NULL AND kajabi_offering_id IS NULL;

-- Enable Row Level Security
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recorded_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Live classes are readable by all authenticated users
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'live_classes' 
    AND policyname = 'Live classes are viewable by all'
  ) THEN
    CREATE POLICY "Live classes are viewable by all" 
    ON public.live_classes FOR SELECT 
    TO authenticated USING (true);
  END IF;
END $$;

-- Recorded sessions are readable by all authenticated users
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'recorded_sessions' 
    AND policyname = 'Recorded sessions are viewable by all'
  ) THEN
    CREATE POLICY "Recorded sessions are viewable by all" 
    ON public.recorded_sessions FOR SELECT 
    TO authenticated USING (true);
  END IF;
END $$;

-- User favorite sessions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_favorite_sessions' 
    AND policyname = 'Users can view own favorites'
  ) THEN
    CREATE POLICY "Users can view own favorites" 
    ON public.user_favorite_sessions FOR SELECT 
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_favorite_sessions' 
    AND policyname = 'Users can create favorites'
  ) THEN
    CREATE POLICY "Users can create favorites" 
    ON public.user_favorite_sessions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'user_favorite_sessions' 
    AND policyname = 'Users can delete own favorites'
  ) THEN
    CREATE POLICY "Users can delete own favorites" 
    ON public.user_favorite_sessions FOR DELETE 
    USING (auth.uid() = user_id);
  END IF;
END $$;


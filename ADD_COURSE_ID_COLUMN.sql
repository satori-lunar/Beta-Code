-- Add course_id column to existing recorded_sessions table
-- Run this if you get "column course_id does not exist" error

-- Step 1: Ensure courses table exists first
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

-- Step 2: Add course_id column if it doesn't exist (without constraint first)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'recorded_sessions' 
    AND column_name = 'course_id'
  ) THEN
    -- Add column without foreign key constraint first
    ALTER TABLE public.recorded_sessions 
    ADD COLUMN course_id UUID;
    
    RAISE NOTICE 'Added course_id column to recorded_sessions table';
  ELSE
    RAISE NOTICE 'course_id column already exists';
  END IF;
END $$;

-- Step 3: Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
    AND table_name = 'recorded_sessions' 
    AND constraint_name = 'recorded_sessions_course_id_fkey'
  ) THEN
    ALTER TABLE public.recorded_sessions 
    ADD CONSTRAINT recorded_sessions_course_id_fkey 
    FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE SET NULL;
    
    RAISE NOTICE 'Added foreign key constraint';
  ELSE
    RAISE NOTICE 'Foreign key constraint already exists';
  END IF;
END $$;

-- Step 4: Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_recorded_sessions_course_id 
ON public.recorded_sessions(course_id);

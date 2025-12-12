-- Add RLS policy to allow users to insert their own record in public.users
-- This is needed for users who signed up before the trigger was in place
-- or if the trigger didn't run for some reason

-- Enable RLS if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Add INSERT policy if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile" 
    ON public.users FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = id);
  END IF;
END $$;

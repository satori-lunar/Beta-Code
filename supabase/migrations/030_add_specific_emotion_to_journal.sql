-- Add specific_emotion column to journal_entries table
-- This allows users to specify a more detailed emotion from the feelings wheel
-- while keeping the main mood (great, good, neutral, low, bad) as the primary classification

ALTER TABLE public.journal_entries
ADD COLUMN IF NOT EXISTS specific_emotion TEXT;

-- Add a comment to explain the column
COMMENT ON COLUMN public.journal_entries.specific_emotion IS 'Optional specific emotion selected from feelings wheel (e.g., anxious, hopeful, overwhelmed). Displayed as subtitle under main mood.';


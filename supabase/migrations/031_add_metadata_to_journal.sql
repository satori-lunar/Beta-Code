-- Add metadata column to journal_entries for storing emotional context and other structured data
-- This allows us to store emotional context without changing the main schema

ALTER TABLE public.journal_entries
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add index for metadata queries
CREATE INDEX IF NOT EXISTS idx_journal_entries_metadata ON public.journal_entries USING GIN (metadata);

-- Add comment
COMMENT ON COLUMN public.journal_entries.metadata IS 'Stores additional structured data like emotional context, reflection prompts used, etc.';


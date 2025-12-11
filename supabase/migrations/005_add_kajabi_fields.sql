-- Add Kajabi tracking fields to recorded_sessions
ALTER TABLE public.recorded_sessions 
ADD COLUMN IF NOT EXISTS kajabi_product_id TEXT,
ADD COLUMN IF NOT EXISTS kajabi_offering_id TEXT,
ADD COLUMN IF NOT EXISTS synced_from_kajabi BOOLEAN DEFAULT FALSE;

-- Add Kajabi tracking fields to users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS kajabi_contact_id TEXT,
ADD COLUMN IF NOT EXISTS kajabi_tags TEXT[],
ADD COLUMN IF NOT EXISTS synced_from_kajabi BOOLEAN DEFAULT FALSE;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_recorded_sessions_kajabi_product_id 
ON public.recorded_sessions(kajabi_product_id);

CREATE INDEX IF NOT EXISTS idx_users_kajabi_contact_id 
ON public.users(kajabi_contact_id);

-- Add unique constraint to prevent duplicate syncing for recordings
CREATE UNIQUE INDEX IF NOT EXISTS idx_recorded_sessions_kajabi_unique 
ON public.recorded_sessions(kajabi_product_id, kajabi_offering_id) 
WHERE kajabi_product_id IS NOT NULL AND kajabi_offering_id IS NOT NULL;

-- Add unique constraint for products without offerings
CREATE UNIQUE INDEX IF NOT EXISTS idx_recorded_sessions_kajabi_product_unique 
ON public.recorded_sessions(kajabi_product_id) 
WHERE kajabi_product_id IS NOT NULL AND kajabi_offering_id IS NULL;


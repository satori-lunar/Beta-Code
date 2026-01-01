-- Timezone Offset Reference Table
-- This table stores the hour offset from Eastern Time for each timezone
-- Used by the calendar to adjust class times without changing days

CREATE TABLE IF NOT EXISTS public.timezone_offsets (
  timezone_id TEXT PRIMARY KEY,
  timezone_name TEXT NOT NULL,
  offset_from_eastern INTEGER NOT NULL, -- Hours difference from Eastern Time (e.g., -1 for Central, -3 for Pacific)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert standard US timezone offsets
INSERT INTO public.timezone_offsets (timezone_id, timezone_name, offset_from_eastern) VALUES
  ('America/New_York', 'Eastern Time (ET)', 0),
  ('America/Chicago', 'Central Time (CT)', -1),
  ('America/Denver', 'Mountain Time (MT)', -2),
  ('America/Los_Angeles', 'Pacific Time (PT)', -3),
  ('America/Phoenix', 'Arizona Time (MST)', -2),
  ('America/Anchorage', 'Alaska Time (AKT)', -4),
  ('Pacific/Honolulu', 'Hawaii Time (HST)', -5),
  ('UTC', 'UTC', -5),
  ('Europe/London', 'London (GMT)', -5),
  ('Europe/Paris', 'Paris (CET)', -6),
  ('Asia/Tokyo', 'Tokyo (JST)', 14),
  ('Asia/Shanghai', 'Shanghai (CST)', 13),
  ('Australia/Sydney', 'Sydney (AEDT)', 16)
ON CONFLICT (timezone_id) DO UPDATE SET
  timezone_name = EXCLUDED.timezone_name,
  offset_from_eastern = EXCLUDED.offset_from_eastern;

-- Enable Row Level Security
ALTER TABLE public.timezone_offsets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Timezone offsets are viewable by all authenticated users"
  ON public.timezone_offsets FOR SELECT
  USING (auth.role() = 'authenticated');



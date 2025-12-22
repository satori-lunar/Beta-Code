-- Setup Cron Job for Email Reminders
-- This migration sets up a pg_cron job to automatically send email reminders
-- The job runs every minute to check for due reminders

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Drop existing job if it exists
SELECT cron.unschedule('send-email-reminders');

-- Create a function to call the Edge Function via HTTP
-- Note: This requires the Supabase Edge Function to be deployed
CREATE OR REPLACE FUNCTION public.trigger_email_reminders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  supabase_url TEXT;
  service_role_key TEXT;
  response_status INT;
  response_body TEXT;
BEGIN
  -- Get Supabase URL and service role key from environment
  -- These should be set in Supabase project settings
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);
  
  -- If not set, use default (you'll need to set these in Supabase dashboard)
  IF supabase_url IS NULL THEN
    RAISE NOTICE 'Supabase URL not configured. Please set app.settings.supabase_url';
    RETURN;
  END IF;
  
  IF service_role_key IS NULL THEN
    RAISE NOTICE 'Service role key not configured. Please set app.settings.service_role_key';
    RETURN;
  END IF;
  
  -- Call the Edge Function
  SELECT status, content INTO response_status, response_body
  FROM http((
    'POST',
    supabase_url || '/functions/v1/send-email-reminders',
    ARRAY[
      http_header('Authorization', 'Bearer ' || service_role_key),
      http_header('Content-Type', 'application/json')
    ],
    'application/json',
    '{}'
  )::http_request);
  
  RAISE NOTICE 'Email reminders triggered. Status: %, Response: %', response_status, response_body;
END;
$$;

-- Schedule the cron job to run every minute
-- Note: You may need to adjust the schedule based on your needs
SELECT cron.schedule(
  'send-email-reminders',
  '* * * * *', -- Every minute
  $$SELECT public.trigger_email_reminders();$$
);

-- Alternative: If you prefer to use Supabase's built-in cron (recommended)
-- You can set this up in the Supabase Dashboard under Database > Cron Jobs
-- Or use the Supabase CLI to create a cron job

COMMENT ON FUNCTION public.trigger_email_reminders() IS 
'Triggers the send-email-reminders Edge Function to process due email reminders. 
This function is called by pg_cron every minute.';


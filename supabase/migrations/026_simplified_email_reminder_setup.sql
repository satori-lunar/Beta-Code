-- Simplified Email Reminder Setup
-- This migration creates a simpler approach using Supabase's built-in cron or external services
-- The pg_cron approach may not work in all Supabase projects

-- Create a simpler function that can be called via HTTP
-- This will be used by Supabase Cron Jobs or external cron services

-- First, ensure the http extension is available (for making HTTP requests)
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Create a function to trigger email reminders
-- This function will be called by the cron job
CREATE OR REPLACE FUNCTION public.trigger_email_reminders_simple()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  supabase_url TEXT;
  service_role_key TEXT;
  response_status INT;
  response_body TEXT;
BEGIN
  -- Get values from environment (set in Supabase dashboard)
  -- These should be set as database secrets or in the cron job configuration
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);
  
  -- If not set via settings, try to get from environment
  -- Note: In Supabase, you'll need to pass these when calling the function
  -- or set them in the cron job SQL directly
  
  IF supabase_url IS NULL OR service_role_key IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Supabase URL or service role key not configured. Please set these in the cron job configuration.'
    );
  END IF;
  
  -- Call the Edge Function via HTTP
  SELECT status, content INTO response_status, response_body
  FROM http((
    'POST',
    supabase_url || '/functions/v1/send-email-reminders',
    ARRAY[
      http_header('Authorization', 'Bearer ' || service_role_key),
      http_header('Content-Type', 'application/json')
    ]::http_header[],
    'application/json',
    '{}'
  )::http_request);
  
  RETURN jsonb_build_object(
    'success', response_status = 200,
    'status', response_status,
    'response', response_body
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users (for testing)
GRANT EXECUTE ON FUNCTION public.trigger_email_reminders_simple() TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.trigger_email_reminders_simple() IS 
'Triggers the send-email-reminders Edge Function. 
This function should be called by a Supabase Cron Job or external cron service every minute.
To use with Supabase Cron Jobs, create a cron job with this SQL:
SELECT public.trigger_email_reminders_simple();

Or use the direct HTTP call in the cron job:
SELECT net.http_post(
  url := ''https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-email-reminders'',
  headers := jsonb_build_object(
    ''Authorization'', ''Bearer YOUR_SERVICE_ROLE_KEY'',
    ''Content-Type'', ''application/json''
  ),
  body := ''{}''::jsonb
);';


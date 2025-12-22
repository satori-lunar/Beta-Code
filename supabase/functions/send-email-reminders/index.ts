import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Resend API integration
async function sendEmailWithResend(
  to: string,
  subject: string,
  htmlBody: string,
  fromEmail: string = 'noreply@mybirchandstonecoaching.com'
) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [to],
      subject: subject,
      html: htmlBody,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Resend API error: ${response.status} ${error}`)
  }

  return await response.json()
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify this is called with service role key (for cron jobs)
    // Allow both Authorization header and apikey query parameter
    const authHeader = req.headers.get('Authorization')
    const apiKey = req.headers.get('apikey')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    // Check authorization - allow service role key in header or apikey header
    const isAuthorized = 
      (authHeader && authHeader.includes(serviceRoleKey || '')) ||
      (apiKey && apiKey === serviceRoleKey)
    
    if (!isAuthorized) {
      console.error('Unauthorized request. Auth header:', authHeader ? 'present' : 'missing', 'API key:', apiKey ? 'present' : 'missing')
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Service role key required.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabase = createClient(supabaseUrl, serviceRoleKey!)

    const now = new Date()
    const nowISO = now.toISOString()

    console.log(`[${nowISO}] Checking for due email reminders...`)

    // Define a small time window so we don't send extremely old, past-due reminders.
    // This makes manual runs safe: only reminders due in the last 10 minutes will send.
    const windowMinutes = 10
    const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000)
    const windowStartISO = windowStart.toISOString()

    // Find email reminders that are due "now" (within the recent window) and not sent
    const { data: dueReminders, error: remindersError } = await supabase
      .from('class_reminders')
      .select(`
        id,
        user_id,
        live_class_id,
        reminder_minutes_before,
        scheduled_reminder_time,
        notification_type,
        live_classes:live_class_id (
          title,
          description,
          scheduled_at
        )
      `)
      .eq('notification_type', 'email')
      .eq('sent', false)
      .lte('scheduled_reminder_time', nowISO)
      .gt('scheduled_reminder_time', windowStartISO)

    if (remindersError) {
      console.error('Error fetching due reminders:', remindersError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch reminders', details: remindersError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!dueReminders || dueReminders.length === 0) {
      console.log(`[${nowISO}] No due reminders found`)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No due reminders to send',
          count: 0,
          timestamp: nowISO
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`[${nowISO}] Found ${dueReminders.length} due reminder(s)`)

    const appUrl = Deno.env.get('APP_URL') || 'https://your-app.com'
    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Process each reminder (and reschedule it weekly)
    for (const reminder of dueReminders) {
      try {
        const liveClass = reminder.live_classes as any
        if (!liveClass || !liveClass.scheduled_at) {
          console.error('Missing live class data for reminder:', reminder.id)
          results.failed++
          results.errors.push(`Reminder ${reminder.id}: Missing live class data`)
          continue
        }

        // Get user email and name
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email, name')
          .eq('id', reminder.user_id)
          .maybeSingle()

        if (userError || !userData || !userData.email) {
          console.error('Error fetching user or no email:', reminder.user_id, userError)
          results.failed++
          results.errors.push(`User ${reminder.user_id}: email not found`)
          continue
        }

        const userEmail = userData.email
        const userName = userData.name || userData.email.split('@')[0] || 'there'

        // Format the class time in user's timezone (default to Eastern)
        const classTime = new Date(liveClass.scheduled_at)
        const formattedTime = classTime.toLocaleString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short'
        })

        const emailSubject = `Reminder: ${liveClass.title} starts in ${reminder.reminder_minutes_before} minutes`
        
        // Create HTML email body
        const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Class Reminder</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f86f4d 0%, #ff8c6b 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Class Reminder</h1>
  </div>
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      This is a reminder that <strong>"${liveClass.title}"</strong> is starting in <strong>${reminder.reminder_minutes_before} minutes</strong>.
    </p>
    
    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: #6b7280;"><strong>Class Time:</strong></p>
      <p style="margin: 5px 0 0 0; font-size: 18px; color: #111827; font-weight: 600;">${formattedTime}</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${appUrl}/classes" 
         style="display: inline-block; background: #f86f4d; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Join the Class
      </a>
    </div>
    
    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      See you there!<br>
      <span style="color: #9ca3af;">— Birch & Stone</span>
    </p>
  </div>
</body>
</html>
        `.trim()

        // Send email using Resend
        try {
          await sendEmailWithResend(userEmail, emailSubject, htmlBody)
          console.log(`✓ Email sent successfully to ${userEmail} for reminder ${reminder.id}`)
          results.sent++

          // Create notification in database
          await supabase
            .from('notifications')
            .insert({
              user_id: reminder.user_id,
              title: emailSubject,
              message: `Reminder: "${liveClass.title}" starts in ${reminder.reminder_minutes_before} minutes.`,
              type: 'reminder',
              link: '/classes',
              read: false
            })

          // Reschedule this reminder for the same class time next week
          // so users only have to click "email reminder" once.
          const currentReminderTime = new Date(reminder.scheduled_reminder_time)
          const nextReminderTime = new Date(
            currentReminderTime.getTime() + 7 * 24 * 60 * 60 * 1000
          )

          // Update the existing reminder row to point to next week
          await supabase
            .from('class_reminders')
            .update({
              scheduled_reminder_time: nextReminderTime.toISOString(),
              sent: false,
              updated_at: nowISO
            })
            .eq('id', reminder.id)

        } catch (emailError: any) {
          console.error(`✗ Error sending email to ${userEmail}:`, emailError)
          results.failed++
          results.errors.push(`Reminder ${reminder.id}: ${emailError.message}`)
        }

      } catch (error: any) {
        console.error(`✗ Error processing reminder ${reminder.id}:`, error)
        results.failed++
        results.errors.push(`Reminder ${reminder.id}: ${error.message}`)
      }
    }

    const response = {
      success: true,
      message: `Processed ${dueReminders.length} reminders`,
      sent: results.sent,
      failed: results.failed,
      errors: results.errors,
      timestamp: nowISO
    }

    console.log(`[${nowISO}] Completed:`, response)

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error in send-email-reminders:', error)
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error', details: error?.stack }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

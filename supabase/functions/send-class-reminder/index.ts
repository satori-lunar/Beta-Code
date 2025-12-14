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
  fromEmail: string = 'noreply@birchandstone.com'
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
    const { reminderId, userId, classTitle, scheduledAt, reminderMinutes } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      throw new Error('User not found')
    }

    // Format the class time
    const classTime = new Date(scheduledAt)
    const formattedTime = classTime.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    })

    const appUrl = Deno.env.get('APP_URL') || 'https://your-app.com'
    const emailSubject = `Reminder: ${classTitle} starts in ${reminderMinutes} minutes`
    
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
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userData.name || 'there'},</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      This is a reminder that <strong>"${classTitle}"</strong> is starting in <strong>${reminderMinutes} minutes</strong>.
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

    // Plain text version for fallback
    const textBody = `
Hi ${userData.name || 'there'},

This is a reminder that "${classTitle}" is starting in ${reminderMinutes} minutes.

Class Time: ${formattedTime}

Join the class here: ${appUrl}/classes

See you there!
— Birch & Stone
    `.trim()

    // Send email using Resend
    let emailSent = false
    try {
      await sendEmailWithResend(userData.email, emailSubject, htmlBody)
      emailSent = true
      console.log(`Email sent successfully to ${userData.email}`)
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Continue to create notification even if email fails
    }

    // Create notification in database (always create, even if email fails)
    const { error: notifError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: emailSubject,
        message: textBody,
        type: 'reminder',
        link: '/classes',
        read: false
      })

    if (notifError) {
      console.error('Error creating notification:', notifError)
    }

    // Mark reminder as sent
    const { error: updateError } = await supabase
      .from('class_reminders')
      .update({ sent: true, updated_at: new Date().toISOString() })
      .eq('id', reminderId)

    if (updateError) {
      console.error('Error updating reminder:', updateError)
      throw updateError
    }

    if (!emailSent) {
      // If email failed, return error so caller knows
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Reminder notification created, but email failed to send',
          emailSent: false
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Reminder sent' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending reminder:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

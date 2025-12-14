import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Send email using Supabase's built-in email (or integrate with your email service)
    // For now, we'll create a notification in the database
    // You can integrate with SendGrid, Resend, or another email service here
    
    const emailSubject = `Reminder: ${classTitle} starts in ${reminderMinutes} minutes`
    const emailBody = `
Hi ${userData.name || 'there'},

This is a reminder that "${classTitle}" is starting in ${reminderMinutes} minutes.

Class Time: ${formattedTime}

Join the class here: ${Deno.env.get('APP_URL') || 'https://your-app.com'}/classes

See you there!
    `.trim()

    // Create notification in database
    const { error: notifError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: emailSubject,
        message: emailBody,
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
    }

    // TODO: Integrate with actual email service (SendGrid, Resend, etc.)
    // For now, we're just creating a notification
    // Example with Resend:
    // const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    // await resend.emails.send({
    //   from: 'noreply@yourdomain.com',
    //   to: userData.email,
    //   subject: emailSubject,
    //   html: emailBody.replace(/\n/g, '<br>')
    // })

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

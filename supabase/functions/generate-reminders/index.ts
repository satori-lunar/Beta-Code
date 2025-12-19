import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
  }

  try {
    // Verify this is called with service role key (for cron jobs)
    const authHeader = req.headers.get('Authorization')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!authHeader || !authHeader.includes(serviceRoleKey || '')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5) // HH:MM format
    const today = now.toISOString().split('T')[0] // YYYY-MM-DD format
    const notificationsCreated: string[] = []

    // Get all users with notification preferences
    const { data: preferences, error: prefError } = await supabaseAdmin
      .from('notification_preferences')
      .select('*')

    if (prefError) {
      console.error('Error fetching preferences:', prefError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch notification preferences' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!preferences || preferences.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No users with notification preferences', notificationsCreated: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Process each user's preferences
    for (const pref of preferences) {
      const userId = pref.user_id
      const prefTime = (pref.habit_reminder_time || '').slice(0, 5) // HH:MM format

      // Check if we should create habit reminders
      if (pref.habit_reminders_enabled && prefTime === currentTime) {
        // Check if user has incomplete habits today
        const { data: habits } = await supabaseAdmin
          .from('habits')
          .select('id, name')
          .eq('user_id', userId)

        if (habits && habits.length > 0) {
          // Check which habits are incomplete today
          const { data: completions } = await supabaseAdmin
            .from('habit_completions')
            .select('habit_id')
            .eq('user_id', userId)
            .eq('completed_date', today)

          const completedHabitIds = new Set((completions || []).map(c => c.habit_id))
          const incompleteHabits = habits.filter(h => !completedHabitIds.has(h.id))

          if (incompleteHabits.length > 0) {
            // Check if notification already exists today
            const { data: existing } = await supabaseAdmin
              .from('notifications')
              .select('id')
              .eq('user_id', userId)
              .eq('type', 'reminder')
              .like('title', '%habit%')
              .gte('created_at', `${today}T00:00:00`)
              .limit(1)

            if (!existing || existing.length === 0) {
              await supabaseAdmin.from('notifications').insert({
                user_id: userId,
                title: '📋 Complete Your Habits',
                message: `You have ${incompleteHabits.length} habit${incompleteHabits.length > 1 ? 's' : ''} to complete today: ${incompleteHabits.slice(0, 3).map(h => h.name).join(', ')}${incompleteHabits.length > 3 ? '...' : ''}`,
                type: 'reminder',
                link: '/habits',
                read: false
              })
              notificationsCreated.push(`habit-${userId}`)
            }
          }
        }
      }

      // Check journal reminders
      const journalTime = (pref.journal_reminder_time || '').slice(0, 5)
      if (pref.journal_reminders_enabled && journalTime === currentTime) {
        // Check if journal entry exists today
        const { data: journalEntries } = await supabaseAdmin
          .from('journal_entries')
          .select('id')
          .eq('user_id', userId)
          .gte('created_at', `${today}T00:00:00`)
          .limit(1)

        if (!journalEntries || journalEntries.length === 0) {
          // Check if notification already exists today
          const { data: existing } = await supabaseAdmin
            .from('notifications')
            .select('id')
            .eq('user_id', userId)
            .eq('type', 'reminder')
            .like('title', '%journal%')
            .gte('created_at', `${today}T00:00:00`)
            .limit(1)

          if (!existing || existing.length === 0) {
            await supabaseAdmin.from('notifications').insert({
              user_id: userId,
              title: '📔 Time to Journal',
              message: 'Take a moment to reflect on your day and write in your journal.',
              type: 'reminder',
              link: '/journal',
              read: false
            })
            notificationsCreated.push(`journal-${userId}`)
          }
        }
      }

      // Check mental health exercise reminders
      const mentalHealthTime = (pref.mental_health_reminder_time || '').slice(0, 5)
      if (pref.mental_health_reminders_enabled && mentalHealthTime === currentTime) {
        // Check if notification already exists today
        const { data: existing } = await supabaseAdmin
          .from('notifications')
          .select('id')
          .eq('user_id', userId)
          .eq('type', 'reminder')
          .like('title', '%mental health%')
          .gte('created_at', `${today}T00:00:00`)
          .limit(1)

        if (!existing || existing.length === 0) {
          await supabaseAdmin.from('notifications').insert({
            user_id: userId,
            title: '🧘 Mental Health Check-in',
            message: 'Take a few minutes for a mental health exercise or mindfulness practice.',
            type: 'reminder',
            link: '/health',
            read: false
          })
          notificationsCreated.push(`mental-health-${userId}`)
        }
      }

      // Check goal reminders (daily or weekly based on preference)
      const goalTime = (pref.goal_reminder_time || '').slice(0, 5)
      const shouldRemindGoals = 
        pref.goal_reminders_enabled && 
        goalTime === currentTime &&
        (pref.goal_reminder_frequency === 'daily' || 
         (pref.goal_reminder_frequency === 'weekly' && now.getDay() === 1)) // Monday for weekly

      if (shouldRemindGoals) {
        // Check if user has active goals
        const { data: goals } = await supabaseAdmin
          .from('goals')
          .select('id, title, target_date')
          .eq('user_id', userId)
          .is('completed_at', null)
          .limit(5)

        if (goals && goals.length > 0) {
          // Check if notification already exists today
          const { data: existing } = await supabaseAdmin
            .from('notifications')
            .select('id')
            .eq('user_id', userId)
            .eq('type', 'reminder')
            .like('title', '%goal%')
            .gte('created_at', `${today}T00:00:00`)
            .limit(1)

          if (!existing || existing.length === 0) {
            await supabaseAdmin.from('notifications').insert({
              user_id: userId,
              title: '🎯 Check Your Goals',
              message: `You have ${goals.length} active goal${goals.length > 1 ? 's' : ''} to work towards. Keep making progress!`,
              type: 'reminder',
              link: '/goals',
              read: false
            })
            notificationsCreated.push(`goals-${userId}`)
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Created ${notificationsCreated.length} reminder notifications`,
        notificationsCreated,
        timestamp: now.toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error generating reminders:', error)
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

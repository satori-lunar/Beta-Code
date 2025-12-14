import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Hook to check for due reminders and trigger notifications
export function useReminderChecker() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || typeof window === 'undefined') return;

    const checkReminders = async () => {
      try {
        const now = new Date();
        
        // Find reminders that are due (scheduled_reminder_time <= now and not sent)
        const { data: dueReminders, error } = await supabase
          .from('class_reminders')
          .select(`
            *,
            live_classes (
              title,
              scheduled_at,
              zoom_link
            )
          `)
          .eq('user_id', user.id)
          .eq('sent', false)
          .lte('scheduled_reminder_time', now.toISOString());

        if (error) {
          console.error('Error checking reminders:', error);
          return;
        }

        if (!dueReminders || dueReminders.length === 0) return;

        // Process each due reminder
        for (const reminder of dueReminders) {
          const classData = reminder.live_classes as any;
          
          if (!classData) continue;

          // Send notification based on type
          if (reminder.notification_type === 'push' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification(`Class Reminder: ${classData.title}`, {
                body: `Your class starts in ${reminder.reminder_minutes_before} minutes!`,
                icon: '/icon-192x192.png',
                tag: `reminder-${reminder.id}`,
                data: {
                  url: '/classes',
                  classId: reminder.live_class_id
                }
              });
            }
          }

          // For email reminders, the Edge Function will handle it
          // Mark as sent
          await supabase
            .from('class_reminders')
            .update({ sent: true, updated_at: new Date().toISOString() })
            .eq('id', reminder.id);

          // Also trigger email via Edge Function if it's an email reminder
          if (reminder.notification_type === 'email') {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              if (session) {
                await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-class-reminder`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                  },
                  body: JSON.stringify({
                    reminderId: reminder.id,
                    userId: user.id,
                    classTitle: classData.title,
                    scheduledAt: classData.scheduled_at,
                    reminderMinutes: reminder.reminder_minutes_before
                  })
                });
              }
            } catch (error) {
              console.error('Error sending email reminder:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error in reminder checker:', error);
      }
    };

    // Check immediately
    checkReminders();

    // Check every minute
    const interval = setInterval(checkReminders, 60000);

    return () => clearInterval(interval);
  }, [user]);
}

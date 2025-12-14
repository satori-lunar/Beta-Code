import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Track video view
export function useTrackVideoView() {
  const { user } = useAuth();

  const trackView = async (sessionId: string, sessionTitle?: string) => {
    if (!user) return;

    try {
      // Track in video_views table
      await supabase
        .from('video_views')
        .insert({
          user_id: user.id,
          session_id: sessionId,
          viewed_at: new Date().toISOString()
        });

      // Track in user_activity table
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: 'video_view',
          entity_type: 'recorded_session',
          entity_id: sessionId,
          entity_title: sessionTitle || 'Recorded Session',
          activity_description: sessionTitle 
            ? `Viewed video: "${sessionTitle}"`
            : 'Viewed recorded session',
          metadata: { viewed_at: new Date().toISOString() }
        });
    } catch (error) {
      console.error('Error tracking video view:', error);
    }
  };

  return { trackView };
}

// Track favorite action
export function useTrackFavorite() {
  const { user } = useAuth();

  const trackFavorite = async (sessionId: string, action: 'favorite_added' | 'favorite_removed', sessionTitle?: string) => {
    if (!user) return;

    try {
      const description = action === 'favorite_added'
        ? sessionTitle ? `Added favorite: "${sessionTitle}"` : 'Added session to favorites'
        : sessionTitle ? `Removed favorite: "${sessionTitle}"` : 'Removed session from favorites';
      
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: action,
          entity_type: 'recorded_session',
          entity_id: sessionId,
          entity_title: sessionTitle || 'Recorded Session',
          activity_description: description,
          metadata: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
      console.error('Error tracking favorite:', error);
    }
  };

  return { trackFavorite };
}

// Track reminder
export function useTrackReminder() {
  const { user } = useAuth();

  const trackReminder = async (classId: string, action: 'reminder_set' | 'reminder_cancelled', minutes: number, className?: string) => {
    if (!user) return;

    try {
      const description = action === 'reminder_set'
        ? className 
          ? `Set reminder for "${className}" (${minutes} min before)`
          : `Set reminder for class (${minutes} min before)`
        : className
          ? `Cancelled reminder for "${className}"`
          : 'Cancelled class reminder';
      
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: action,
          entity_type: 'live_class',
          entity_id: classId,
          entity_title: className || 'Live Class',
          activity_description: description,
          metadata: { reminder_minutes: minutes, timestamp: new Date().toISOString() }
        });
    } catch (error) {
      console.error('Error tracking reminder:', error);
    }
  };

  return { trackReminder };
}

// Track login
export function useTrackLogin() {
  const { user } = useAuth();

  const trackLogin = async () => {
    if (!user) return;

    try {
      // Get IP and user agent if available
      const ipAddress = null; // Could be obtained from headers in server-side
      const userAgent = navigator.userAgent;

      await supabase
        .from('user_logins')
        .insert({
          user_id: user.id,
          login_at: new Date().toISOString(),
          ip_address: ipAddress,
          user_agent: userAgent
        });

      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: 'login',
          activity_description: 'User logged in',
          metadata: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
      console.error('Error tracking login:', error);
    }
  };

  return { trackLogin };
}

// Track journal entry
export function useTrackJournal() {
  const { user } = useAuth();

  const trackJournalEntry = async (entryId: string, title: string, action: 'journal_entry_created' | 'journal_entry_updated') => {
    if (!user) return;

    try {
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: action,
          entity_type: 'journal_entry',
          entity_id: entryId,
          entity_title: title,
          activity_description: action === 'journal_entry_created' 
            ? `Created journal entry: "${title}"`
            : `Updated journal entry: "${title}"`,
          metadata: { 
            timestamp: new Date().toISOString(),
            action: action
          }
        });
    } catch (error) {
      console.error('Error tracking journal entry:', error);
    }
  };

  return { trackJournalEntry };
}

// Track weight log
export function useTrackWeightLog() {
  const { user } = useAuth();

  const trackWeightLog = async (entryId: string, weight: number, unit: string) => {
    if (!user) return;

    try {
      const weightText = `${weight} ${unit}`;
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: 'weight_logged',
          entity_type: 'weight_entry',
          entity_id: entryId,
          entity_title: `Weight: ${weightText}`,
          activity_description: `Logged weight: ${weightText}`,
          metadata: { 
            weight: weight,
            unit: unit,
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Error tracking weight log:', error);
    }
  };

  return { trackWeightLog };
}

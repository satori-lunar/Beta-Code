import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Track video view
export function useTrackVideoView() {
  const { user } = useAuth();

  const trackView = async (sessionId: string) => {
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

  const trackFavorite = async (sessionId: string, action: 'favorite_added' | 'favorite_removed') => {
    if (!user) return;

    try {
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: action,
          entity_type: 'recorded_session',
          entity_id: sessionId,
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

  const trackReminder = async (classId: string, action: 'reminder_set' | 'reminder_cancelled', minutes: number) => {
    if (!user) return;

    try {
      await supabase
        .from('user_activity')
        .insert({
          user_id: user.id,
          activity_type: action,
          entity_type: 'live_class',
          entity_id: classId,
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
          metadata: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
      console.error('Error tracking login:', error);
    }
  };

  return { trackLogin };
}

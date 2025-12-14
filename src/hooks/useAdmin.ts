import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Check if current user is admin
export function useIsAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const checkAdmin = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.role === 'admin');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user]);

  return { isAdmin, loading };
}

// Hook to get all users (admin only)
export function useAllUsers() {
  const { isAdmin } = useIsAdmin();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  return { users, loading };
}

// Hook to get analytics
export function useAdminAnalytics() {
  const { isAdmin } = useIsAdmin();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        // Get total users
        const { count: totalUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        // Get video views with user and session info
        const { data: videoViews } = await supabase
          .from('video_views')
          .select(`
            *,
            users!video_views_user_id_fkey (email, name),
            recorded_sessions!video_views_session_id_fkey (title, category)
          `)
          .order('viewed_at', { ascending: false })
          .limit(100);

        // Get favorites with user info
        const { data: favorites } = await supabase
          .from('user_favorite_sessions')
          .select(`
            *,
            users!user_favorite_sessions_user_id_fkey (email, name),
            recorded_sessions!user_favorite_sessions_session_id_fkey (title, category)
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        // Get reminders
        const { data: reminders } = await supabase
          .from('class_reminders')
          .select(`
            *,
            live_classes (title, scheduled_at),
            users (email, name)
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        // Get weight logs with user info
        const { data: weightLogs } = await supabase
          .from('weight_entries')
          .select(`
            *,
            users!weight_entries_user_id_fkey (email, name)
          `)
          .order('date', { ascending: false })
          .limit(100);

        // Get login activity with user info
        const { data: logins } = await supabase
          .from('user_logins')
          .select(`
            *,
            users!user_logins_user_id_fkey (email, name)
          `)
          .order('login_at', { ascending: false })
          .limit(100);

        // Get streaks
        const { data: userStreaks } = await supabase
          .from('users')
          .select('id, email, name, streak')
          .order('streak', { ascending: false })
          .limit(50);

        setAnalytics({
          totalUsers: totalUsers || 0,
          videoViews: enrichedVideoViews || [],
          favorites: enrichedFavorites || [],
          reminders: enrichedReminders || [],
          weightLogs: enrichedWeightLogs || [],
          logins: enrichedLogins || [],
          userStreaks: userStreaks || []
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [isAdmin]);

  return { analytics, loading };
}

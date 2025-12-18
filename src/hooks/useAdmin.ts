import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Update this list with the email(s) you want to treat as admins
const ADMIN_EMAILS = [
  'YOUR_ADMIN_EMAIL_HERE'
];

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

    // Simple check: user email is one of the configured admin emails
    const email = user.email || (user.user_metadata as any)?.email || '';
    setIsAdmin(ADMIN_EMAILS.includes(email));
    setLoading(false);
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

        // Get video views
        const { data: videoViews } = await supabase
          .from('video_views')
          .select('*')
          .order('viewed_at', { ascending: false })
          .limit(100);

        // Get favorites
        const { data: favorites } = await supabase
          .from('user_favorite_sessions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        // Get reminders
        const { data: reminders } = await supabase
          .from('class_reminders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        // Get weight logs
        const { data: weightLogs } = await supabase
          .from('weight_entries')
          .select('*')
          .order('date', { ascending: false })
          .limit(100);

        // Get login activity
        const { data: logins } = await supabase
          .from('user_logins')
          .select('*')
          .order('login_at', { ascending: false })
          .limit(100);

        // Get streaks
        const { data: userStreaks } = await supabase
          .from('users')
          .select('id, email, name, streak')
          .order('streak', { ascending: false })
          .limit(50);

        // Get user info for enrichment
        const userIds = new Set<string>();
        videoViews?.forEach((v: any) => userIds.add(v.user_id));
        favorites?.forEach((f: any) => userIds.add(f.user_id));
        reminders?.forEach((r: any) => userIds.add(r.user_id));
        weightLogs?.forEach((w: any) => userIds.add(w.user_id));
        logins?.forEach((l: any) => userIds.add(l.user_id));

        const { data: allUsers } = userIds.size > 0 ? await supabase
          .from('users')
          .select('id, email, name')
          .in('id', Array.from(userIds)) : { data: [] };

        const userMap = new Map((allUsers || []).map((u: any) => [u.id, u]));

        // Get session info
        const sessionIds = new Set<string>();
        videoViews?.forEach((v: any) => v.session_id && sessionIds.add(v.session_id));
        favorites?.forEach((f: any) => f.session_id && sessionIds.add(f.session_id));

        const { data: sessions } = sessionIds.size > 0 ? await supabase
          .from('recorded_sessions')
          .select('id, title, category')
          .in('id', Array.from(sessionIds)) : { data: [] };

        const sessionMap = new Map((sessions || []).map((s: any) => [s.id, s]));

        // Get class info
        const classIds = new Set<string>();
        reminders?.forEach((r: any) => r.live_class_id && classIds.add(r.live_class_id));

        const { data: classes } = classIds.size > 0 ? await supabase
          .from('live_classes')
          .select('id, title, scheduled_at')
          .in('id', Array.from(classIds)) : { data: [] };

        const classMap = new Map((classes || []).map((c: any) => [c.id, c]));

        // Enrich data
        const enrichedVideoViews = (videoViews || []).map((v: any) => ({
          ...v,
          users: userMap.get(v.user_id),
          recorded_sessions: sessionMap.get(v.session_id)
        }));

        const enrichedFavorites = (favorites || []).map((f: any) => ({
          ...f,
          users: userMap.get(f.user_id),
          recorded_sessions: sessionMap.get(f.session_id)
        }));

        const enrichedReminders = (reminders || []).map((r: any) => ({
          ...r,
          users: userMap.get(r.user_id),
          live_classes: classMap.get(r.live_class_id)
        }));

        const enrichedWeightLogs = (weightLogs || []).map((w: any) => ({
          ...w,
          users: userMap.get(w.user_id)
        }));

        const enrichedLogins = (logins || []).map((l: any) => ({
          ...l,
          users: userMap.get(l.user_id)
        }));

        setAnalytics({
          totalUsers: totalUsers || 0,
          videoViews: enrichedVideoViews,
          favorites: enrichedFavorites,
          reminders: enrichedReminders,
          weightLogs: enrichedWeightLogs,
          logins: enrichedLogins,
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


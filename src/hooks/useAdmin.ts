import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Update this list with the email(s) you want to treat as admins
const ADMIN_EMAILS = [
  'elliotmccormick@satori-lunar.com'
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

        // Get habits
        const { data: habits } = await supabase
          .from('habits')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        // Get habit completions
        const { data: habitCompletions } = await supabase
          .from('habit_completions')
          .select('*')
          .order('completed_date', { ascending: false })
          .limit(200);

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

        // Get recent user activity to compute activity-based streaks and last active
        const { data: activityRows } = await (supabase as any)
          .from('user_activity')
          .select('user_id, created_at')
          .gte('created_at', new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString()); // last 90 days

        // Get user info for enrichment
        const userIds = new Set<string>();
        videoViews?.forEach((v: any) => userIds.add(v.user_id));
        favorites?.forEach((f: any) => userIds.add(f.user_id));
        reminders?.forEach((r: any) => userIds.add(r.user_id));
        weightLogs?.forEach((w: any) => userIds.add(w.user_id));
        habits?.forEach((h: any) => userIds.add(h.user_id));
        habitCompletions?.forEach((hc: any) => userIds.add(hc.user_id));
        logins?.forEach((l: any) => userIds.add(l.user_id));
        activityRows?.forEach((a: any) => userIds.add(a.user_id));

        const { data: allUsers } = userIds.size > 0 ? await supabase
          .from('users')
          .select('id, email, name')
          .in('id', Array.from(userIds)) : { data: [] };

        const userMap = new Map((allUsers || []).map((u: any) => [u.id, u]));

        // Compute activity-based streaks and last active per user
        const activityByUser = new Map<string, Set<string>>();
        (activityRows || []).forEach((row: any) => {
          if (!row.user_id || !row.created_at) return;
          const date = new Date(row.created_at as string);
          const day = date.toISOString().slice(0, 10); // YYYY-MM-DD
          if (!activityByUser.has(row.user_id)) {
            activityByUser.set(row.user_id, new Set<string>());
          }
          activityByUser.get(row.user_id)!.add(day);
        });

        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);

        const computeActivityStreak = (days: Set<string>): number => {
          if (!days.size) return 0;
          // Sort days descending
          const sorted = Array.from(days).sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
          let streak = 0;
          let cursor = new Date(todayStr);

          for (const dayStr of sorted) {
            const dayDate = new Date(dayStr);
            // Skip future dates, just in case
            if (dayDate > cursor) continue;

            if (
              dayDate.getUTCFullYear() === cursor.getUTCFullYear() &&
              dayDate.getUTCMonth() === cursor.getUTCMonth() &&
              dayDate.getUTCDate() === cursor.getUTCDate()
            ) {
              streak += 1;
              // Move cursor back one day
              cursor.setUTCDate(cursor.getUTCDate() - 1);
            } else if (dayDate < cursor) {
              // Gap detected – streak ends
              break;
            }
          }

          return streak;
        };

        const activityStreaks = Array.from(activityByUser.entries()).map(([userId, days]) => {
          const userInfo = userMap.get(userId);
          const streak = computeActivityStreak(days);
          const lastActive = Array.from(days).sort().at(-1) || null;
          return {
            id: userId,
            email: userInfo?.email || null,
            name: userInfo?.name || null,
            activityStreak: streak,
            lastActive,
          };
        });

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

        const enrichedHabits = (habits || []).map((h: any) => ({
          ...h,
          users: userMap.get(h.user_id)
        }));

        const enrichedHabitCompletions = (habitCompletions || []).map((hc: any) => ({
          ...hc,
          users: userMap.get(hc.user_id)
        }));

        setAnalytics({
          totalUsers: totalUsers || 0,
          videoViews: enrichedVideoViews,
          favorites: enrichedFavorites,
          reminders: enrichedReminders,
          weightLogs: enrichedWeightLogs,
          habits: enrichedHabits,
          habitCompletions: enrichedHabitCompletions,
          logins: enrichedLogins,
          userStreaks: userStreaks || [],
          activityStreaks,
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


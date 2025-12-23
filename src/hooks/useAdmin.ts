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

    const checkAdmin = async () => {
      try {
        // First check: user email is one of the configured admin emails
        const email = user.email || (user.user_metadata as any)?.email || '';
        const isEmailAdmin = ADMIN_EMAILS.includes(email);

        // Second check: check database role (this might fail due to RLS, that's OK)
        let isRoleAdmin = false;
        try {
          const { data: userData, error: roleError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

          if (!roleError) {
            // Check for both admin and admin_lv2
            isRoleAdmin = userData?.role === 'admin' || userData?.role === 'admin_lv2';
          }
        } catch (roleCheckErr) {
          // Continue with email check only
        }

        const finalIsAdmin = isEmailAdmin || isRoleAdmin;
        setIsAdmin(finalIsAdmin);
      } catch (err) {
        console.error('Error checking admin status:', err);
        // Fallback to email check
        const email = user.email || (user.user_metadata as any)?.email || '';
        const fallbackIsAdmin = ADMIN_EMAILS.includes(email);
        setIsAdmin(fallbackIsAdmin);
      } finally {
    setLoading(false);
      }
    };

    checkAdmin();
  }, [user]);

  return { isAdmin, loading };
}

// Check if current user is a full admin (not admin_lv2)
export function useIsFullAdmin() {
  const { user } = useAuth();
  const [isFullAdmin, setIsFullAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsFullAdmin(false);
      setLoading(false);
      return;
    }

    const checkFullAdmin = async () => {
      try {
        // First check: user email is one of the configured admin emails
        const email = user.email || (user.user_metadata as any)?.email || '';
        const isEmailAdmin = ADMIN_EMAILS.includes(email);

        // Second check: check database role (must be 'admin', not 'admin_lv2')
        let isRoleAdmin = false;
        try {
          const { data: userData, error: roleError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

          if (!roleError) {
            // Only full admin, not admin_lv2
            isRoleAdmin = userData?.role === 'admin';
          }
        } catch (roleCheckErr) {
          // Continue with email check only
        }

        const finalIsFullAdmin = isEmailAdmin || isRoleAdmin;
        setIsFullAdmin(finalIsFullAdmin);
      } catch (err) {
        console.error('Error checking full admin status:', err);
        // Fallback to email check
        const email = user.email || (user.user_metadata as any)?.email || '';
        const fallbackIsFullAdmin = ADMIN_EMAILS.includes(email);
        setIsFullAdmin(fallbackIsFullAdmin);
      } finally {
        setLoading(false);
      }
    };

    checkFullAdmin();
  }, [user]);

  return { isFullAdmin, loading };
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
        
        // Fetch all users without limit (Supabase default is 1000, but we'll handle pagination if needed)
        let allUsers: any[] = [];
        let from = 0;
        const pageSize = 1000;
        let hasMore = true;
        let pageCount = 0;
        
        while (hasMore && pageCount < 10) { // Safety limit of 10 pages
          pageCount++;
          
        const { data, error } = await supabase
          .from('users')
          .select('*')
            .order('created_at', { ascending: false })
            .range(from, from + pageSize - 1);

          if (error) {
            console.error('Error fetching users page:', error);
            throw error;
          }
          
          
          if (data && data.length > 0) {
            allUsers = [...allUsers, ...data];
            from += pageSize;
            hasMore = data.length === pageSize;
          } else {
            hasMore = false;
          }
        }
        
        setUsers(allUsers);
      } catch (error) {
        console.error('Fatal error fetching users:', error);
        setUsers([]);
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
        const { count: totalUsers, error: usersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        if (usersError) {
          console.error('Error fetching total users:', usersError);
        }

        // Get video views from user_activity table where activity_type = 'video_view'
        let videoViews: any[] = [];
        const { data: videoViewsData, error: videoViewsError } = await supabase
          .from('user_activity')
          .select('*')
          .eq('activity_type', 'video_view')
          .order('created_at', { ascending: false })
          .limit(10000); // High limit to get all views
        
        if (videoViewsError) {
          console.error('Error fetching video views from user_activity:', videoViewsError);
          // If it's an RLS error, try fallback to video_views table
          if (videoViewsError.message?.includes('permission') || videoViewsError.message?.includes('policy')) {
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('video_views')
              .select('*')
              .order('viewed_at', { ascending: false })
              .limit(10000);
            
            if (!fallbackError && fallbackData) {
              // Convert video_views format to user_activity format
              videoViews = fallbackData.map((vv: any) => ({
                id: vv.id,
                user_id: vv.user_id,
                activity_type: 'video_view',
                entity_type: 'recorded_session',
                entity_id: vv.session_id,
                created_at: vv.viewed_at || vv.created_at,
                metadata: {}
              }));
            } else if (fallbackError) {
              console.error('Fallback to video_views also failed:', fallbackError);
            }
          }
        } else {
          videoViews = videoViewsData || [];
          if (videoViews.length === 0) {
            // Try fallback to video_views table if user_activity is empty
            const { data: fallbackData, error: fallbackError } = await supabase
              .from('video_views')
              .select('*')
              .order('viewed_at', { ascending: false })
              .limit(10000);
            
            if (!fallbackError && fallbackData && fallbackData.length > 0) {
              // Convert video_views format to user_activity format
              videoViews = fallbackData.map((vv: any) => ({
                id: vv.id,
                user_id: vv.user_id,
                activity_type: 'video_view',
                entity_type: 'recorded_session',
                entity_id: vv.session_id,
                created_at: vv.viewed_at || vv.created_at,
                metadata: {}
              }));
            }
          } else {
          }
        }

        // Get favorites (fetch all)
        const { data: favorites, error: favoritesError } = await supabase
          .from('user_favorite_sessions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10000);
        
        if (favoritesError) {
          console.error('Error fetching favorites:', favoritesError);
        }

        // Get reminders (fetch all)
        const { data: reminders, error: remindersError } = await supabase
          .from('class_reminders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10000);
        
        if (remindersError) {
          console.error('Error fetching reminders:', remindersError);
        }

        // Get weight logs (fetch all)
        const { data: weightLogs, error: weightLogsError } = await supabase
          .from('weight_entries')
          .select('*')
          .order('date', { ascending: false })
          .limit(10000);
        
        if (weightLogsError) {
          console.error('Error fetching weight logs:', weightLogsError);
        }

        // Get habits (fetch all)
        const { data: habits, error: habitsError } = await supabase
          .from('habits')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10000);
        
        if (habitsError) {
          console.error('Error fetching habits:', habitsError);
        }

        // Get habit completions (fetch all)
        let habitCompletions: any[] = [];
        const { data: habitCompletionsData, error: habitCompletionsError } = await (supabase as any)
          .from('habit_completions')
          .select('*')
          .order('completed_date', { ascending: false })
          .limit(10000);
        
        if (habitCompletionsError) {
          // 404 means table doesn't exist, which is OK
          if (habitCompletionsError.code !== 'PGRST116') {
          }
        } else {
          habitCompletions = habitCompletionsData || [];
        }

        // Get login activity
        let logins: any[] = [];
        const { data: loginsData, error: loginsError } = await supabase
          .from('user_logins')
          .select('*')
          .order('login_at', { ascending: false })
          .limit(100);

        if (loginsError) {
          // 404 means table doesn't exist, which is OK
          if (loginsError.code !== 'PGRST116') {
          }
        } else {
          logins = loginsData || [];
        }

        // Get badges from user_badges table
        let userBadges: any[] = [];
        const { data: badgesData, error: badgesError } = await (supabase as any)
          .from('user_badges')
          .select('*')
          .order('earned_date', { ascending: false })
          .limit(10000);
        
        if (badgesError) {
          console.error('Error fetching badges:', badgesError);
        } else {
          userBadges = badgesData || [];
        }

        // Get recent user activity to compute last active
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
        userBadges?.forEach((b: any) => userIds.add(b.user_id));

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

        // Group badges by user
        const badgesByUser = new Map<string, any[]>();
        userBadges?.forEach((badge: any) => {
          if (!badge.user_id) {
            return;
          }
          if (!badgesByUser.has(badge.user_id)) {
            badgesByUser.set(badge.user_id, []);
          }
          badgesByUser.get(badge.user_id)!.push(badge);
        });
        

        // Create badges list with user info
        const enrichedBadges = Array.from(badgesByUser.entries()).map(([userId, badges]) => {
          const userInfo = userMap.get(userId);
          const lastActive = Array.from(activityByUser.get(userId) || []).sort().at(-1) || null;
          return {
            id: userId,
            email: userInfo?.email || null,
            name: userInfo?.name || null,
            badges: badges.sort((a: any, b: any) => 
              new Date(b.earned_date || b.created_at).getTime() - new Date(a.earned_date || a.created_at).getTime()
            ),
            badgeCount: badges.length,
            lastActive,
          };
        });

        // Get session info (for video views from user_activity, entity_id is the session_id)
        const sessionIds = new Set<string>();
        videoViews?.forEach((v: any) => v.entity_id && sessionIds.add(v.entity_id));
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
          recorded_sessions: sessionMap.get(v.entity_id), // user_activity uses entity_id
          viewed_at: v.created_at // user_activity uses created_at instead of viewed_at
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

        
        // Debug: Log sample video views
        if (enrichedVideoViews.length > 0) {
        }

        setAnalytics({
          totalUsers: totalUsers || 0,
          videoViews: enrichedVideoViews,
          favorites: enrichedFavorites,
          reminders: enrichedReminders,
          weightLogs: enrichedWeightLogs,
          habits: enrichedHabits,
          habitCompletions: enrichedHabitCompletions,
          logins: enrichedLogins,
          badges: enrichedBadges,
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


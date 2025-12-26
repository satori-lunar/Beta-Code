import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Check if current user is a coach
export function useIsCoach() {
  const { user } = useAuth();
  const [isCoach, setIsCoach] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsCoach(false);
      setLoading(false);
      return;
    }

    const checkCoach = async () => {
      try {
        const { data: userData, error: roleError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        // Coach role is not currently in the database schema
        // This functionality may need to be implemented separately
        setIsCoach(false);
      } catch (err) {
        console.error('Error checking coach status:', err);
        setIsCoach(false);
      } finally {
        setLoading(false);
      }
    };

    checkCoach();
  }, [user]);

  return { isCoach, loading };
}

// Hook to get coach's class titles
export function useCoachClasses() {
  const { user } = useAuth();
  const [classTitles, setClassTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchCoachClasses = async () => {
      try {
        // coach_classes table doesn't exist in the database schema
        // This functionality may need to be implemented separately
        const { data, error } = { data: null, error: { message: 'coach_classes table not found' } } as any;

        if (error) {
          console.error('Error fetching coach classes:', error);
          setClassTitles([]);
        } else {
          setClassTitles((data || []).map((cc: any) => cc.class_title));
        }
      } catch (err) {
        console.error('Error fetching coach classes:', err);
        setClassTitles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachClasses();
  }, [user]);

  return { classTitles, loading };
}

// Hook to get coach analytics (video views and reminders for their classes)
export function useCoachAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchCoachAnalytics = async () => {
      try {
        // Get coach's class titles
        // coach_classes table doesn't exist in the database schema
        // This functionality may need to be implemented separately
        const { data: coachClasses, error: classesError } = { data: null, error: { message: 'coach_classes table not found' } } as any;

        if (classesError || !coachClasses || coachClasses.length === 0) {
          setAnalytics({ videoViews: [], reminders: [] });
          setLoading(false);
          return;
        }

        const classTitles = coachClasses.map((cc: any) => cc.class_title);
        const liveClassTitles = coachClasses.filter((cc: any) => cc.class_type === 'live').map((cc: any) => cc.class_title);
        const recordedClassTitles = coachClasses.filter((cc: any) => cc.class_type === 'recorded').map((cc: any) => cc.class_title);

        // Get video views for recorded classes
        let videoViews: any[] = [];
        if (recordedClassTitles.length > 0) {
          // Get recorded session IDs for coach's classes
          const { data: sessions, error: sessionsError } = await supabase
            .from('recorded_sessions')
            .select('id, title')
            .in('title', recordedClassTitles);

          if (!sessionsError && sessions) {
            const sessionIds = sessions.map((s: any) => s.id);

            // Get video views from user_activity
            const { data: activityData, error: activityError } = await supabase
              .from('user_activity')
              .select('*')
              .eq('activity_type', 'video_view')
              .in('entity_id', sessionIds)
              .order('created_at', { ascending: false })
              .limit(10000);

            if (!activityError && activityData) {
              videoViews = activityData;
            }
          }
        }

        // Get reminders for live classes
        let reminders: any[] = [];
        if (liveClassTitles.length > 0) {
          // Get live class IDs for coach's classes
          const { data: liveClasses, error: liveClassesError } = await supabase
            .from('live_classes')
            .select('id, title')
            .in('title', liveClassTitles);

          if (!liveClassesError && liveClasses) {
            const liveClassIds = liveClasses.map((lc: any) => lc.id);

            // Get reminders for these classes
            const { data: remindersData, error: remindersError } = await supabase
              .from('class_reminders')
              .select('*')
              .in('live_class_id', liveClassIds)
              .order('created_at', { ascending: false })
              .limit(10000);

            if (!remindersError && remindersData) {
              reminders = remindersData;
            }
          }
        }

        // Enrich with user and class/session info
        const userIds = new Set<string>();
        videoViews.forEach((v: any) => userIds.add(v.user_id));
        reminders.forEach((r: any) => userIds.add(r.user_id));

        const { data: allUsers } = userIds.size > 0 ? await supabase
          .from('users')
          .select('id, email, name')
          .in('id', Array.from(userIds)) : { data: [] };

        const userMap = new Map((allUsers || []).map((u: any) => [u.id, u]));

        // Get session info for video views
        const sessionIds = new Set<string>();
        videoViews.forEach((v: any) => sessionIds.add(v.entity_id));

        const { data: sessions } = sessionIds.size > 0 ? await supabase
          .from('recorded_sessions')
          .select('id, title, category')
          .in('id', Array.from(sessionIds)) : { data: [] };

        const sessionMap = new Map((sessions || []).map((s: any) => [s.id, s]));

        // Get class info for reminders
        const classIds = new Set<string>();
        reminders.forEach((r: any) => classIds.add(r.live_class_id));

        const { data: classes } = classIds.size > 0 ? await supabase
          .from('live_classes')
          .select('id, title, scheduled_at')
          .in('id', Array.from(classIds)) : { data: [] };

        const classMap = new Map((classes || []).map((c: any) => [c.id, c]));

        // Enrich data
        const enrichedVideoViews = videoViews.map((v: any) => ({
          ...v,
          users: userMap.get(v.user_id),
          recorded_sessions: sessionMap.get(v.entity_id),
          viewed_at: v.created_at
        }));

        const enrichedReminders = reminders.map((r: any) => ({
          ...r,
          users: userMap.get(r.user_id),
          live_classes: classMap.get(r.live_class_id)
        }));

        setAnalytics({
          videoViews: enrichedVideoViews,
          reminders: enrichedReminders,
          classTitles
        });
      } catch (error) {
        console.error('Error fetching coach analytics:', error);
        setAnalytics({ videoViews: [], reminders: [], classTitles: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchCoachAnalytics();
  }, [user]);

  return { analytics, loading };
}


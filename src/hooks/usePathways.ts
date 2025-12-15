import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Pathway {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  icon: string;
  color_gradient: string;
  class_titles: string[];
  total_classes: number;
  estimated_duration: string;
  benefits: string[];
  created_at: string;
}

export interface UserPathwayProgress {
  id: string;
  user_id: string;
  pathway_id: string;
  enrolled_at: string;
  classes_completed: number;
  total_classes: number;
  current_streak: number;
  longest_streak: number;
  last_class_completed_at: string | null;
  completed: boolean;
  completed_at: string | null;
}

export interface PathwayAchievement {
  id: string;
  user_id: string;
  pathway_id: string;
  achievement_type: string;
  achievement_name: string;
  achievement_description: string | null;
  badge_icon: string;
  badge_color: string;
  earned_at: string;
}

export function usePathways() {
  const { user } = useAuth();
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserPathwayProgress>>({});
  const [achievements, setAchievements] = useState<PathwayAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch pathways
  useEffect(() => {
    async function fetchPathways() {
      try {
        const { data, error: pathwaysError } = await supabase
          .from('pathways')
          .select('*')
          .order('created_at', { ascending: true });

        if (pathwaysError) throw pathwaysError;
        setPathways(data || []);
      } catch (err) {
        setError(err as Error);
      }
    }

    fetchPathways();
  }, []);

  // Fetch user progress and achievements
  useEffect(() => {
    if (!user) {
      setUserProgress({});
      setAchievements([]);
      setLoading(false);
      return;
    }

    async function fetchUserData() {
      try {
        setLoading(true);

        // Fetch user progress
        const { data: progressData, error: progressError } = await supabase
          .from('user_pathway_progress')
          .select('*')
          .eq('user_id', user.id);

        if (progressError) throw progressError;

        // Convert to map for easy lookup
        const progressMap: Record<string, UserPathwayProgress> = {};
        (progressData || []).forEach((progress) => {
          progressMap[progress.pathway_id] = progress;
        });
        setUserProgress(progressMap);

        // Fetch achievements
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('pathway_achievements')
          .select('*')
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false });

        if (achievementsError) throw achievementsError;
        setAchievements(achievementsData || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();

    // Subscribe to changes
    const progressChannel = supabase
      .channel('user_pathway_progress_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_pathway_progress',
          filter: `user_id=eq.${user.id}`,
        },
        fetchUserData
      )
      .subscribe();

    const achievementsChannel = supabase
      .channel('pathway_achievements_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pathway_achievements',
          filter: `user_id=eq.${user.id}`,
        },
        fetchUserData
      )
      .subscribe();

    return () => {
      supabase.removeChannel(progressChannel);
      supabase.removeChannel(achievementsChannel);
    };
  }, [user]);

  // Enroll in pathway
  const enrollInPathway = async (pathwayId: string, totalClasses: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_pathway_progress')
        .insert({
          user_id: user.id,
          pathway_id: pathwayId,
          total_classes: totalClasses,
          classes_completed: 0,
          current_streak: 0,
          longest_streak: 0,
        });

      if (error) throw error;

      // Award enrollment achievement
      await supabase.from('pathway_achievements').insert({
        user_id: user.id,
        pathway_id: pathwayId,
        achievement_type: 'enrolled',
        achievement_name: 'Journey Begun',
        achievement_description: 'Enrolled in a new pathway',
        badge_icon: '🎯',
        badge_color: '#3b82f6',
      });
    } catch (err) {
      console.error('Error enrolling in pathway:', err);
    }
  };

  // Update pathway progress (called when a class is completed)
  const updatePathwayProgress = async (pathwayId: string, classTitle: string) => {
    if (!user) return;

    try {
      const progress = userProgress[pathwayId];
      if (!progress) return;

      const newClassesCompleted = progress.classes_completed + 1;
      const newCompleted = newClassesCompleted >= progress.total_classes;

      // Calculate streak
      const now = new Date();
      const lastCompleted = progress.last_class_completed_at
        ? new Date(progress.last_class_completed_at)
        : null;

      let newCurrentStreak = progress.current_streak;
      let newLongestStreak = progress.longest_streak;

      if (lastCompleted) {
        const daysSinceLastClass = Math.floor(
          (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceLastClass <= 1) {
          // Continue streak
          newCurrentStreak += 1;
        } else if (daysSinceLastClass <= 3) {
          // Within grace period, maintain streak
          newCurrentStreak += 1;
        } else {
          // Streak broken
          newCurrentStreak = 1;
        }
      } else {
        newCurrentStreak = 1;
      }

      newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);

      // Update progress
      const { error } = await supabase
        .from('user_pathway_progress')
        .update({
          classes_completed: newClassesCompleted,
          current_streak: newCurrentStreak,
          longest_streak: newLongestStreak,
          last_class_completed_at: now.toISOString(),
          completed: newCompleted,
          completed_at: newCompleted ? now.toISOString() : null,
        })
        .eq('id', progress.id);

      if (error) throw error;

      // Award achievements
      const achievementsToAward: Array<{
        type: string;
        name: string;
        description: string;
        icon: string;
        color: string;
      }> = [];

      if (newClassesCompleted === 1) {
        achievementsToAward.push({
          type: 'first_class',
          name: 'First Step',
          description: 'Completed your first class in this pathway',
          icon: '⭐',
          color: '#f59e0b',
        });
      }

      if (newCurrentStreak === 3) {
        achievementsToAward.push({
          type: 'streak_3',
          name: '3-Day Streak',
          description: 'Attended classes 3 days in a row',
          icon: '🔥',
          color: '#ef4444',
        });
      }

      if (newCurrentStreak === 7) {
        achievementsToAward.push({
          type: 'streak_7',
          name: 'Week Warrior',
          description: 'Attended classes 7 days in a row',
          icon: '💪',
          color: '#8b5cf6',
        });
      }

      if (newClassesCompleted === Math.ceil(progress.total_classes / 2)) {
        achievementsToAward.push({
          type: 'halfway',
          name: 'Halfway There',
          description: 'Completed half of the pathway',
          icon: '🎖️',
          color: '#06b6d4',
        });
      }

      if (newCompleted) {
        achievementsToAward.push({
          type: 'completed',
          name: 'Pathway Complete',
          description: 'Completed all classes in this pathway',
          icon: '🏆',
          color: '#22c55e',
        });
      }

      // Insert achievements
      for (const achievement of achievementsToAward) {
        await supabase.from('pathway_achievements').insert({
          user_id: user.id,
          pathway_id: pathwayId,
          achievement_type: achievement.type,
          achievement_name: achievement.name,
          achievement_description: achievement.description,
          badge_icon: achievement.icon,
          badge_color: achievement.color,
        });
      }
    } catch (err) {
      console.error('Error updating pathway progress:', err);
    }
  };

  // Unenroll from pathway
  const unenrollFromPathway = async (pathwayId: string) => {
    if (!user) return;

    try {
      const progress = userProgress[pathwayId];
      if (!progress) return;

      await supabase.from('user_pathway_progress').delete().eq('id', progress.id);
    } catch (err) {
      console.error('Error unenrolling from pathway:', err);
    }
  };

  return {
    pathways,
    userProgress,
    achievements,
    loading,
    error,
    enrollInPathway,
    updatePathwayProgress,
    unenrollFromPathway,
  };
}

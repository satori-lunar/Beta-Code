import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Database } from '../types/database'

type Tables = Database['public']['Tables']
type NotificationRecord = {
  id: string
  title: string
  message: string
  type: 'reminder' | 'achievement' | 'class' | 'streak' | 'system'
  read: boolean
  link: string | null
  createdAt: string
}
type UserBadge = {
  id: string
  badgeId?: string | null
  name: string
  description: string | null
  icon: string | null
  category: string | null
  earnedDate: string | null
}

// Generic hook for fetching user-specific data
export function useUserData<T>(
  table: keyof Tables,
  options?: {
    orderBy?: { column: string; ascending?: boolean }
    limit?: number
  }
) {
  const { user } = useAuth()
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    if (!user) {
      setData([])
      setLoading(false)
      return
    }

    async function fetchData() {
      try {
        setLoading(true)
        let query = supabase
          .from(table as any)
          .select('*')
          .eq('user_id', user!.id) as any

        if (options?.orderBy) {
          query = query.order(options.orderBy.column, {
            ascending: options.orderBy.ascending ?? false,
          })
        }

        if (options?.limit) {
          query = query.limit(options.limit)
        }

        const { data: result, error } = await query

        if (error) throw error
        setData((result as T[]) || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`${table as string}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table as any,
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, table, options?.orderBy?.column, options?.orderBy?.ascending, options?.limit, refetchTrigger])

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1)
  }

  return { data, loading, error, refetch }
}

// Specific hooks for each table
export function useHabits() {
  return useUserData<Tables['habits']['Row']>('habits', {
    orderBy: { column: 'created_at', ascending: true },
  })
}

export function useNutritionEntries() {
  return useUserData<Tables['nutrition_entries']['Row']>('nutrition_entries', {
    orderBy: { column: 'date', ascending: false },
  })
}

export function useWeightEntries() {
  return useUserData<Tables['weight_entries']['Row']>('weight_entries', {
    orderBy: { column: 'date', ascending: false },
  })
}

export function useJournalEntries() {
  return useUserData<Tables['journal_entries']['Row']>('journal_entries', {
    orderBy: { column: 'date', ascending: false },
  })
}

export function useCalendarEvents() {
  return useUserData<Tables['calendar_events']['Row']>('calendar_events', {
    orderBy: { column: 'date', ascending: true },
  })
}

export function useUserBadges() {
  const { user } = useAuth()
  const [data, setData] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    if (!user) {
      setData([])
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchBadges = async () => {
      try {
        setLoading(true)
        const { data: result, error } = await supabase
          .from('user_badges')
          .select('id, badge_id, earned_date, badges:badge_id (name, description, icon, category), name, description, icon, category')
          .eq('user_id', user.id)
          .order('earned_date', { ascending: false })

        if (error) throw error

        if (!isMounted) return

        const mapped: UserBadge[] = (result || []).map((badge: any) => ({
          id: badge.id,
          badgeId: badge.badge_id ?? null,
          name: badge.badges?.name ?? badge.name ?? 'Badge',
          description: badge.badges?.description ?? badge.description ?? null,
          icon: badge.badges?.icon ?? badge.icon ?? null,
          category: badge.badges?.category ?? badge.category ?? null,
          earnedDate: badge.earned_date ?? null,
        }))

        setData(mapped)
      } catch (err) {
        if (isMounted) setError(err as Error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchBadges()

    const channel = supabase
      .channel('user_badges_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_badges',
          filter: `user_id=eq.${user.id}`,
        },
        fetchBadges
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [user, refetchTrigger])

  const refetch = () => setRefetchTrigger(prev => prev + 1)

  return { data, loading, error, refetch }
}

// Hook for user profile
export function useUserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Tables['user_profiles']['Row'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    async function fetchProfile() {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user!.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    fetchProfile()
  }, [user])

  return { profile, loading }
}

// Hook for health metrics
export function useHealthMetrics() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<Tables['health_metrics']['Row'] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setMetrics(null)
      setLoading(false)
      return
    }

    async function fetchMetrics() {
      const { data } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user!.id)
        .single()

      setMetrics(data)
      setLoading(false)
    }

    fetchMetrics()

    // Subscribe to changes
    const channel = supabase
      .channel('health_metrics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'health_metrics',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchMetrics()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return { metrics, loading }
}

// Hook for recorded sessions (available to all authenticated users)
export function useRecordedSessions() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    if (!user) {
      setSessions([])
      setLoading(false)
      return
    }

    async function fetchSessions() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('recorded_sessions')
          .select('*, course_id')
          .order('recorded_at', { ascending: false })

        if (error) throw error
        setSessions(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()

    // Subscribe to changes
    const channel = supabase
      .channel('recorded_sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recorded_sessions',
        },
        fetchSessions
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, refetchTrigger])

  const refetch = () => setRefetchTrigger(prev => prev + 1)

  return { sessions, loading, error, refetch }
}

// Hook for live classes (available to all authenticated users)
export function useLiveClasses() {
  const { user } = useAuth()
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    if (!user) {
      setClasses([])
      setLoading(false)
      return
    }

    async function fetchClasses() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('live_classes')
          .select('*')
          .order('scheduled_at', { ascending: true })

        if (error) throw error
        setClasses(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()

    // Subscribe to changes
    const channel = supabase
      .channel('live_classes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_classes',
        },
        fetchClasses
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, refetchTrigger])

  const refetch = () => setRefetchTrigger(prev => prev + 1)

  return { classes, loading, error, refetch }
}

// Helper function to ensure user exists in public.users
async function ensureUserExists(userId: string, email: string | undefined) {
  try {
    // Check if user exists (using type assertion since users table might not be in types)
    const { data: existingUser, error: selectError } = await (supabase
      .from('users' as any)
      .select('id')
      .eq('id', userId)
      .single() as any)

    if (selectError && selectError.code === 'PGRST116') {
      // User doesn't exist (PGRST116 = no rows returned), create them
      const { error: insertError } = await (supabase
        .from('users' as any)
        .insert({
          id: userId,
          email: email || null,
          full_name: email?.split('@')[0] || null,
        })
        .select()
        .single() as any)

      if (insertError && insertError.code !== '23505') { // Ignore duplicate key errors
        console.warn('[ensureUserExists] Could not create user:', insertError)
        return false
      }
      return true
    } else if (selectError) {
      console.warn('[ensureUserExists] Error checking user:', selectError)
      return false
    }
    return true
  } catch (err) {
    console.warn('[ensureUserExists] Unexpected error:', err)
    return false
  }
}

// Hook for favorite sessions
export function useFavoriteSessions() {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set())
      setLoading(false)
      return
    }

    async function fetchFavorites() {
      if (!user) return
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('user_favorite_sessions')
          .select('session_id')
          .eq('user_id', user.id)

        if (error) throw error
        setFavoriteIds(new Set((data || []).map((f: any) => f.session_id)))
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()

    // Subscribe to changes
    const channel = supabase
      .channel('user_favorite_sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_favorite_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        fetchFavorites
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, refetchTrigger])

  const toggleFavorite = async (sessionId: string) => {
    if (!user) {
      console.error('[toggleFavorite] No user found')
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/1de0ee3c-dda9-4eeb-9faf-c2d8ef7facb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSupabaseData.ts:464',message:'toggleFavorite called without user',data:{sessionId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return
    }

    const isFavorite = favoriteIds.has(sessionId)

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/1de0ee3c-dda9-4eeb-9faf-c2d8ef7facb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSupabaseData.ts:467',message:'toggleFavorite state check',data:{sessionId,isFavorite,userId:user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    try {
      if (isFavorite) {
        // Remove from favorites
        const { error, data } = await supabase
          .from('user_favorite_sessions')
          .delete()
          .eq('user_id', user.id)
          .eq('session_id', sessionId)
          .select()

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/1de0ee3c-dda9-4eeb-9faf-c2d8ef7facb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSupabaseData.ts:476',message:'delete favorite result',data:{sessionId,error:error?.message,hasError:!!error,errorCode:error?.code,errorDetails:error?.details,data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion

        if (error) {
          console.error('[toggleFavorite] Error removing favorite:', error)
          setError(error as Error)
        } else {
          setFavoriteIds(prev => {
            const next = new Set(prev)
            next.delete(sessionId)
            return next
          })
        }
      } else {
        // Add to favorites
        const { error, data } = await supabase
          .from('user_favorite_sessions')
          .insert({
            user_id: user.id,
            session_id: sessionId,
          })
          .select()

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/1de0ee3c-dda9-4eeb-9faf-c2d8ef7facb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useSupabaseData.ts:492',message:'insert favorite result',data:{sessionId,error:error?.message,hasError:!!error,errorCode:error?.code,errorDetails:error?.details,data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion

        if (error) {
          console.error('[toggleFavorite] Error adding favorite:', error)
          setError(error as Error)
        } else {
          setFavoriteIds(prev => new Set(prev).add(sessionId))
        }
      }
    } catch (err) {
      console.error('[toggleFavorite] Unexpected error:', err)
      setError(err as Error)
    }
  }

  const refetch = () => setRefetchTrigger(prev => prev + 1)

  return { favoriteIds, loading, error, toggleFavorite, refetch }
}

// Hook for session completions
export function useSessionCompletions() {
  const { user } = useAuth()
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    if (!user) {
      setCompletedIds(new Set())
      setLoading(false)
      return
    }

    async function fetchCompletions() {
      if (!user) return
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('user_session_completions')
          .select('session_id')
          .eq('user_id', user.id)

        if (error) throw error
        setCompletedIds(new Set((data || []).map((c: any) => c.session_id)))
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompletions()

    // Subscribe to changes
    const channel = supabase
      .channel('user_session_completions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_session_completions',
          filter: `user_id=eq.${user.id}`,
        },
        fetchCompletions
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, refetchTrigger])

  const toggleCompletion = async (sessionId: string) => {
    if (!user) {
      console.error('[toggleCompletion] No user found')
      return
    }

    // Ensure user exists in public.users
    await ensureUserExists(user.id, user.email)

    const isCompleted = completedIds.has(sessionId)

    try {
      if (isCompleted) {
        // Remove completion
        const { error, data } = await supabase
          .from('user_session_completions')
          .delete()
          .eq('user_id', user.id)
          .eq('session_id', sessionId)
          .select()

        if (error) {
          console.error('[toggleCompletion] Error removing completion:', error)
          setError(error as Error)
        } else {
          setCompletedIds(prev => {
            const next = new Set(prev)
            next.delete(sessionId)
            return next
          })
        }
      } else {
        // Add completion
        const { error, data } = await supabase
          .from('user_session_completions')
          .insert({
            user_id: user.id,
            session_id: sessionId,
            completed_at: new Date().toISOString(),
          })
          .select()

        if (error) {
          console.error('[toggleCompletion] Error adding completion:', error)
          setError(error as Error)
        } else {
          setCompletedIds(prev => new Set(prev).add(sessionId))
        }
      }
    } catch (err) {
      console.error('[toggleCompletion] Unexpected error:', err)
      setError(err as Error)
    }
  }

  const refetch = () => setRefetchTrigger(prev => prev + 1)

  return { completedIds, loading, error, toggleCompletion, refetch }
}

// Hook for workout presets
export function useWorkoutPresets() {
  const { user } = useAuth()
  const [presets, setPresets] = useState<Tables['workout_presets']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    if (!user) {
      setPresets([])
      setLoading(false)
      return
    }

    async function fetchPresets() {
      const { data } = await supabase
        .from('workout_presets')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      setPresets(data || [])
      setLoading(false)
    }

    fetchPresets()

    const channel = supabase
      .channel('workout_presets_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workout_presets',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchPresets()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, refetchTrigger])

  const savePreset = async (preset: {
    name: string
    activityType: string
    goalType: string
    targetTime?: number
    targetMilestones?: number
    milestoneMode: string
    autoMilestoneInterval?: number
    intensity: string
  }) => {
    if (!user) return null

    const { data, error } = await supabase
      .from('workout_presets')
      .insert({
        user_id: user.id,
        name: preset.name,
        activity_type: preset.activityType,
        goal_type: preset.goalType,
        target_time: preset.targetTime || null,
        target_milestones: preset.targetMilestones || null,
        milestone_mode: preset.milestoneMode,
        auto_milestone_interval: preset.autoMilestoneInterval || null,
        intensity: preset.intensity,
      })
      .select()
      .single()

    if (!error) {
      setRefetchTrigger(prev => prev + 1)
    }
    return data
  }

  const deletePreset = async (id: string) => {
    const { error } = await supabase
      .from('workout_presets')
      .delete()
      .eq('id', id)

    if (!error) {
      setRefetchTrigger(prev => prev + 1)
    }
    return !error
  }

  return { presets, loading, savePreset, deletePreset }
}

// Hook for workout history
export function useWorkoutHistory(limit = 10) {
  const { user } = useAuth()
  const [history, setHistory] = useState<Tables['workout_history']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    if (!user) {
      setHistory([])
      setLoading(false)
      return
    }

    async function fetchHistory() {
      const { data } = await supabase
        .from('workout_history')
        .select('*')
        .eq('user_id', user!.id)
        .order('finished_at', { ascending: false })
        .limit(limit)

      setHistory(data || [])
      setLoading(false)
    }

    fetchHistory()

    const channel = supabase
      .channel('workout_history_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workout_history',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchHistory()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, limit, refetchTrigger])

  const saveWorkout = async (workout: {
    activityType: string
    duration: number
    milestones: number
    calories: number
    goalType?: string
    milestoneMode?: string
    autoMilestoneInterval?: number
    notes?: string
  }) => {
    if (!user) return null

    const { data, error } = await supabase
      .from('workout_history')
      .insert({
        user_id: user.id,
        activity_type: workout.activityType,
        duration: workout.duration,
        milestones: workout.milestones,
        calories: workout.calories,
        goal_type: workout.goalType || null,
        milestone_mode: workout.milestoneMode || null,
        auto_milestone_interval: workout.autoMilestoneInterval || null,
        notes: workout.notes || null,
        finished_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (!error) {
      setRefetchTrigger(prev => prev + 1)
    }
    return data
  }

  return { history, loading, saveWorkout }
}

// Hook for notifications
export function useNotifications(limit = 50) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<NotificationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(limit)

        if (error) throw error
        if (!isMounted) return

        setNotifications(
          (data || []).map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type,
            read: Boolean(n.read),
            link: n.link ?? null,
            createdAt: n.created_at,
          }))
        )
      } catch (err) {
        if (isMounted) setError(err as Error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchNotifications()

    const channel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        fetchNotifications
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [user, limit, refetchTrigger])

  const markRead = async (id: string) => {
    if (!user) return
    await supabase.from('notifications').update({ read: true }).eq('id', id).eq('user_id', user.id)
    setRefetchTrigger((prev) => prev + 1)
  }

  const markAllRead = async () => {
    if (!user) return
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id)
    setRefetchTrigger((prev) => prev + 1)
  }

  const deleteNotification = async (id: string) => {
    if (!user) return
    await supabase.from('notifications').delete().eq('id', id).eq('user_id', user.id)
    setRefetchTrigger((prev) => prev + 1)
  }

  const refetch = () => setRefetchTrigger(prev => prev + 1)

  return { notifications, loading, error, markRead, markAllRead, deleteNotification, refetch }
}

// Helper function to create a notification
export async function createNotification(
  userId: string,
  notification: {
    title: string
    message: string
    type: 'reminder' | 'achievement' | 'class' | 'streak' | 'system'
    link?: string
  }
) {
  const { error } = await supabase.from('notifications').insert({
    user_id: userId,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    link: notification.link || null,
    read: false,
  })
  return !error
}

// Helper function to award a badge to a user
export async function awardBadge(
  userId: string,
  badge: {
    name: string
    description: string
    icon: string
    category: string
  }
) {
  // Check if user already has this badge
  const { data: existing } = await supabase
    .from('user_badges')
    .select('id')
    .eq('user_id', userId)
    .eq('name', badge.name)
    .single()

  if (existing) {
    return { alreadyHas: true, badge: existing }
  }

  // Award the badge
  const { data, error } = await supabase
    .from('user_badges')
    .insert({
      user_id: userId,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      category: badge.category,
      earned_date: new Date().toISOString().split('T')[0],
    })
    .select()
    .single()

  if (!error && data) {
    // Create a notification for the badge
    await createNotification(userId, {
      title: '🏆 New Badge Earned!',
      message: `Congratulations! You've earned the "${badge.name}" badge: ${badge.description}`,
      type: 'achievement',
      link: '/badges',
    })
  }

  return { alreadyHas: false, badge: data, error }
}

// Check and award streak badges
export async function checkAndAwardStreakBadges(userId: string, streak: number) {
  const streakBadges = [
    { minStreak: 7, name: '7 Day Streak', description: 'Complete habits for 7 days straight', icon: 'flame' },
    { minStreak: 14, name: '14 Day Streak', description: 'Complete habits for 14 days straight', icon: 'flame' },
    { minStreak: 30, name: '30 Day Streak', description: 'Complete habits for 30 days straight', icon: 'crown' },
    { minStreak: 60, name: '60 Day Streak', description: 'Complete habits for 60 days straight', icon: 'trophy' },
    { minStreak: 100, name: 'Century Streak', description: 'Complete habits for 100 days straight', icon: 'star' },
  ]

  for (const badge of streakBadges) {
    if (streak >= badge.minStreak) {
      await awardBadge(userId, {
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        category: 'streak',
      })
    }
  }
}

// Check and award first-time badges
export async function checkFirstTimeBadges(
  userId: string,
  action: 'habit_complete' | 'journal_entry' | 'weight_log' | 'workout_complete'
) {
  const firstTimeBadges: Record<string, { name: string; description: string; icon: string; category: string }> = {
    habit_complete: {
      name: 'First Habit',
      description: 'Complete your first habit',
      icon: 'target',
      category: 'habit',
    },
    journal_entry: {
      name: 'Dear Diary',
      description: 'Write your first journal entry',
      icon: 'book',
      category: 'mindfulness',
    },
    weight_log: {
      name: 'Track Star',
      description: 'Log your first weight entry',
      icon: 'star',
      category: 'special',
    },
    workout_complete: {
      name: 'First Workout',
      description: 'Complete your first workout',
      icon: 'dumbbell',
      category: 'workout',
    },
  }

  const badge = firstTimeBadges[action]
  if (badge) {
    await awardBadge(userId, badge)
  }
}


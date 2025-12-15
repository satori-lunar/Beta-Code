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

  // Memoize user ID and options to prevent unnecessary re-renders
  // Use null instead of undefined for stable dependency comparison
  const userId = user ? user.id : null
  const orderByColumn = options?.orderBy?.column
  const orderByAscending = options?.orderBy?.ascending
  const limit = options?.limit

  useEffect(() => {
    if (!user) {
      setData([])
      setLoading(false)
      setError(null)
      return
    }

    let isMounted = true
    let channel: any = null

    async function fetchData() {
      if (!isMounted) return
      
      try {
        setLoading(true)
        if (!user) {
          setLoading(false);
          return; // Guard clause - user should exist here but TypeScript needs it
        }
        
        console.log(`[useUserData] Fetching ${table} for user ${user.id}`);
        
        let query = supabase
          .from(table as any)
          .select('*')
          .eq('user_id', user.id) as any

        if (orderByColumn) {
          query = query.order(orderByColumn, {
            ascending: orderByAscending ?? false,
          })
        }

        if (limit) {
          query = query.limit(limit)
        }

        const { data: result, error } = await query

        if (!isMounted) return

        if (error) {
          console.error(`[useUserData] Error fetching ${table}:`, error);
          setError(error as Error)
          setData([]) // Set empty array on error
        } else {
          console.log(`[useUserData] Successfully fetched ${table}:`, result?.length || 0, 'items');
          setData((result as T[]) || [])
          setError(null)
        }
      } catch (err) {
        if (!isMounted) return
        console.error(`[useUserData] Exception in useUserData for ${table}:`, err);
        setError(err as Error)
        setData([]) // Set empty array on error
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    // Subscribe to real-time changes
    if (user) {
      channel = supabase
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
            if (isMounted) {
              fetchData()
            }
          }
        )
        .subscribe()
    }

    return () => {
      isMounted = false
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [userId, table, orderByColumn, orderByAscending, limit, refetchTrigger])

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

  // Use stable user ID for dependency array (null instead of undefined)
  const userId = user?.id ?? null

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
  }, [userId, refetchTrigger])

  const refetch = () => setRefetchTrigger(prev => prev + 1)

  return { data, loading, error, refetch }
}

// Hook for user profile
export function useUserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Tables['user_profiles']['Row'] | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Use stable user ID for dependency array
  const userId = user ? user.id : null

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
  }, [userId])

  return { profile, loading }
}

// Hook for health metrics
export function useHealthMetrics() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<Tables['health_metrics']['Row'] | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Use stable user ID for dependency array
  const userId = user ? user.id : null

  useEffect(() => {
    if (!user) {
      setMetrics(null)
      setLoading(false)
      return
    }

    async function fetchMetrics() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('health_metrics')
          .select('*')
          .eq('user_id', user!.id)
          .single()

        if (error) throw error
        setMetrics(data)
      } catch (err) {
        console.error('Error fetching health metrics:', err)
        setMetrics(null)
      } finally {
        setLoading(false)
      }
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
  }, [userId])

  return { metrics, loading }
}

// Hook for recorded sessions (available to all authenticated users)
export function useRecordedSessions() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)
  
  // Use stable user ID for dependency array
  const userId = user ? user.id : null

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
  }, [userId, refetchTrigger])

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
  
  // Use stable user ID for dependency array
  const userId = user ? user.id : null

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
  }, [userId, refetchTrigger])

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
      .maybeSingle() as any)

    // If user exists, we're done
    if (existingUser) {
      return true
    }

    // If error is not "not found", log it
    if (selectError && selectError.code !== 'PGRST116') {
      console.warn('[ensureUserExists] Error checking user:', selectError)
    }

    // User doesn't exist, create them
    // Try with the original schema first (name, email NOT NULL)
    const userName = email?.split('@')[0] || 'User'
    const userEmail = email || `${userId}@example.com`
    
    const { error: insertError } = await (supabase
      .from('users' as any)
      .insert({
        id: userId,
        email: userEmail,
        name: userName,
      })
      .select()
      .single() as any)

    if (insertError) {
      console.error('[ensureUserExists] Insert error details:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      })

      // If that fails, try with the alternative schema (full_name, nullable email)
      if (insertError.code === '42703' || insertError.message?.includes('name') || insertError.message?.includes('column')) {
        // Column 'name' doesn't exist, try 'full_name'
        const { error: insertError2 } = await (supabase
          .from('users' as any)
          .insert({
            id: userId,
            email: email || null,
            full_name: userName,
          })
          .select()
          .single() as any)

        if (insertError2) {
          console.error('[ensureUserExists] Could not create user with full_name:', {
            code: insertError2.code,
            message: insertError2.message,
            details: insertError2.details,
            hint: insertError2.hint
          })
          
          // If it's a permission/RLS error, the user might need to be created via trigger
          // For now, we'll allow the operation to continue and let the foreign key error show
          // The user will need to contact support or we need to add an RLS policy
          if (insertError2.code === '42501' || insertError2.message?.includes('permission') || insertError2.message?.includes('policy')) {
            console.warn('[ensureUserExists] RLS policy blocking user creation. User may need to be created via database trigger.')
            // Return false so we show the alert
            return false
          }
          
          if (insertError2.code !== '23505') {
            // If it's a permission error, provide helpful message
            if (insertError2.code === '42501' || insertError2.message?.includes('permission') || insertError2.message?.includes('policy')) {
              console.error('[ensureUserExists] RLS policy blocking user creation. Please run migration 007_add_user_insert_policy.sql')
            }
            return false
          }
        }
        return true
      } else if (insertError.code === '42501' || insertError.message?.includes('permission') || insertError.message?.includes('policy')) {
        // RLS policy error - user can't insert themselves
        console.error('[ensureUserExists] RLS policy blocking user creation. Please run migration 007_add_user_insert_policy.sql')
        return false
      } else if (insertError.code !== '23505') {
        // Ignore duplicate key errors (user was created between check and insert)
        console.error('[ensureUserExists] Could not create user:', insertError)
        return false
      }
    }
    return true
  } catch (err) {
    console.error('[ensureUserExists] Unexpected error:', err)
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
  
  // Use stable user ID for dependency array
  const userId = user ? user.id : null

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
  }, [userId, refetchTrigger])

  const toggleFavorite = async (sessionId: string) => {
    if (!user) {
      console.error('[toggleFavorite] No user found')
      return
    }

    // Ensure user exists in public.users first
    const userExists = await ensureUserExists(user.id, user.email)
    if (!userExists) {
      console.error('[toggleFavorite] Failed to ensure user exists in database')
      alert('Please refresh the page and try again. If the problem persists, contact support.')
      return
    }

    const isFavorite = favoriteIds.has(sessionId)
    console.log('[toggleFavorite] Toggling favorite for session:', sessionId, 'Current state:', isFavorite)

    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorite_sessions')
          .delete()
          .eq('user_id', user.id)
          .eq('session_id', sessionId)

        if (error) {
          console.error('[toggleFavorite] Error removing favorite:', error)
          setError(error as Error)
          alert(`Failed to remove favorite: ${error.message}`)
        } else {
          console.log('[toggleFavorite] Successfully removed favorite')
          setFavoriteIds(prev => {
            const next = new Set(prev)
            next.delete(sessionId)
            return next
          })
          // Track favorite removal
          try {
            await supabase.from('user_activity').insert({
              user_id: user.id,
              activity_type: 'favorite_removed',
              entity_type: 'recorded_session',
              entity_id: sessionId,
              metadata: { timestamp: new Date().toISOString() }
            })
          } catch (err) {
            // Don't block on tracking errors
            console.error('Error tracking favorite removal:', err)
          }
        }
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorite_sessions')
          .insert({
            user_id: user.id,
            session_id: sessionId,
          })

        if (error) {
          console.error('[toggleFavorite] Error adding favorite:', error)
          setError(error as Error)
          alert(`Failed to add favorite: ${error.message}`)
        } else {
          console.log('[toggleFavorite] Successfully added favorite')
          setFavoriteIds(prev => new Set(prev).add(sessionId))
          // Track favorite addition
          try {
            await supabase.from('user_activity').insert({
              user_id: user.id,
              activity_type: 'favorite_added',
              entity_type: 'recorded_session',
              entity_id: sessionId,
              metadata: { timestamp: new Date().toISOString() }
            })
          } catch (err) {
            // Don't block on tracking errors
            console.error('Error tracking favorite addition:', err)
          }
        }
      }
    } catch (err) {
      console.error('[toggleFavorite] Unexpected error:', err)
      setError(err as Error)
      alert(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`)
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
  
  // Use stable user ID for dependency array
  const userId = user ? user.id : null

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
  }, [userId, refetchTrigger])

  const toggleCompletion = async (sessionId: string) => {
    if (!user) {
      console.error('[toggleCompletion] No user found')
      return
    }

    // Ensure user exists in public.users
    const userExists = await ensureUserExists(user.id, user.email)
    if (!userExists) {
      console.error('[toggleCompletion] Failed to ensure user exists in database')
      alert('Please refresh the page and try again. If the problem persists, contact support.')
      return
    }

    const isCompleted = completedIds.has(sessionId)

    try {
      if (isCompleted) {
        // Remove completion
        const { error } = await supabase
          .from('user_session_completions')
          .delete()
          .eq('user_id', user.id)
          .eq('session_id', sessionId)

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
        const { error } = await supabase
          .from('user_session_completions')
          .insert({
            user_id: user.id,
            session_id: sessionId,
            completed_at: new Date().toISOString(),
          })

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
  
  // Use stable user ID for dependency array
  const userId = user ? user.id : null

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
  }, [userId, refetchTrigger])

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
  
  // Use stable user ID for dependency array
  const userId = user ? user.id : null

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
  }, [userId, limit, refetchTrigger])

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
  
  // Use stable user ID for dependency array
  const userId = user ? user.id : null

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
  }, [userId, limit, refetchTrigger])

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

// Hook for class reminders
export function useClassReminders() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const setReminder = async (
    liveClassId: string,
    notificationType: 'email', // Only email supported now
    reminderMinutesBefore: 5 | 15,
    scheduledAt: string
  ) => {
    if (!user) {
      throw new Error('User must be logged in to set reminders')
    }

    setLoading(true)
    setError(null)

    try {
      // Calculate when to send the reminder
      const classTime = new Date(scheduledAt)
      const reminderTime = new Date(classTime.getTime() - reminderMinutesBefore * 60 * 1000)

      // Check if reminder already exists
      const { data: existing, error: checkError } = await supabase
        .from('class_reminders')
        .select('id')
        .eq('user_id', user.id)
        .eq('live_class_id', liveClassId)
        .eq('notification_type', notificationType)
        .eq('reminder_minutes_before', reminderMinutesBefore)
        .maybeSingle()

      // If there's an error checking (not just "not found"), throw it
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      if (existing) {
        // Update existing reminder
        const { error: updateError } = await supabase
          .from('class_reminders')
          .update({
            scheduled_reminder_time: reminderTime.toISOString(),
            sent: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)

        if (updateError) throw updateError
      } else {
        // Insert new reminder
        const { error: insertError } = await supabase
          .from('class_reminders')
          .insert({
            user_id: user.id,
            live_class_id: liveClassId,
            notification_type: notificationType,
            reminder_minutes_before: reminderMinutesBefore,
            scheduled_reminder_time: reminderTime.toISOString(),
            sent: false
          })

        if (insertError) {
          console.error('Insert error details:', {
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code
          })
          throw insertError
        }
      }

      // Log success for debugging
      console.log('Email reminder saved successfully:', {
        type: notificationType,
        minutes: reminderMinutesBefore,
        reminderTime: reminderTime.toISOString()
      })

      return true
    } catch (err) {
      console.error('Error in setReminder - Full error object:', err)
      
      // Extract error details from Supabase error
      let errorMessage = 'Failed to set reminder. Please try again.'
      
      if (err && typeof err === 'object') {
        // Check if it's a Supabase PostgrestError
        if ('message' in err) {
          const msg = String(err.message)
          const code = 'code' in err ? String(err.code) : ''
          const details = 'details' in err ? String(err.details) : ''
          const hint = 'hint' in err ? String(err.hint) : ''
          
          console.error('Supabase error details:', { message: msg, code, details, hint })
          
          // Provide specific error messages
          if (code === '42P01' || msg.includes('relation') || msg.includes('does not exist')) {
            errorMessage = 'Database table not found. The reminders feature may not be set up yet. Please contact support.'
          } else if (code === '42501' || msg.includes('permission denied') || msg.includes('policy')) {
            errorMessage = 'Permission denied. Please make sure you are logged in and try again.'
          } else if (code === '23503' || msg.includes('foreign key') || msg.includes('constraint')) {
            errorMessage = 'Invalid class or user. Please refresh the page and try again.'
          } else if (code === '23505' || msg.includes('unique constraint') || msg.includes('duplicate')) {
            errorMessage = 'This reminder already exists. You can update it from your settings.'
          } else if (msg) {
            errorMessage = `Error: ${msg}`
          }
        } else if (err instanceof Error) {
          errorMessage = err.message
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      
      const error = new Error(errorMessage)
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { setReminder, loading, error }
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
    { minStreak: 7, name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: 'flame', category: 'streak' },
    { minStreak: 30, name: 'Consistency King', description: 'Maintain a 30-day streak', icon: 'trophy', category: 'streak' },
  ]

  for (const badge of streakBadges) {
    if (streak >= badge.minStreak) {
      await awardBadge(userId, {
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
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
      name: 'First Steps',
      description: 'Complete your first habit',
      icon: 'target',
      category: 'habit',
    },
    journal_entry: {
      name: 'Journaling Beginner',
      description: 'Write your first journal entry',
      icon: 'star',
      category: 'journal',
    },
    weight_log: {
      name: 'Track Star',
      description: 'Log your first weight entry',
      icon: 'star',
      category: 'special',
    },
    workout_complete: {
      name: 'Fitness Enthusiast',
      description: 'Complete your first workout',
      icon: 'zap',
      category: 'workout',
    },
  }

  const badge = firstTimeBadges[action]
  if (badge) {
    console.log(`Attempting to award badge: ${badge.name} to user ${userId}`);
    const result = await awardBadge(userId, badge);
    console.log(`Badge award result:`, result);
    return result;
  }
  return null;
}


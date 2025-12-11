import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Database } from '../types/database'

type Tables = Database['public']['Tables']

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
  return useUserData<Tables['user_badges']['Row']>('user_badges', {
    orderBy: { column: 'earned_date', ascending: false },
  })
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


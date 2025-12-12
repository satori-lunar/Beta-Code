import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface CourseWithSessions {
  id: string
  title: string
  description: string
  thumbnail_url: string | null
  instructor: string
  duration: string
  sessions: number
  category: string
  level: string
  tags: string[]
  created_at: string
  session_count: number
}

export function useCourses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<CourseWithSessions[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setCourses([])
      setLoading(false)
      return
    }

    async function fetchCourses() {
      try {
        setLoading(true)
        // Fetch courses with session count
        const { data, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false })

        if (coursesError) throw coursesError

        // For each course, get session count
        const coursesWithCounts: CourseWithSessions[] = await Promise.all(
          (data || []).map(async (course: any) => {
            const { count, error: countError } = await supabase
              .from('recorded_sessions')
              .select('*', { count: 'exact', head: true })
              .eq('course_id', course.id)

            if (countError) throw countError

            return {
              id: course.id,
              title: course.title,
              description: course.description,
              thumbnail_url: course.thumbnail_url,
              instructor: course.instructor,
              duration: course.duration,
              sessions: course.sessions,
              category: course.category,
              level: course.level,
              tags: course.tags || [],
              created_at: course.created_at || new Date().toISOString(),
              session_count: count || 0,
            }
          })
        )

        setCourses(coursesWithCounts)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()

    // Subscribe to changes
    const channel = supabase
      .channel('courses_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'courses',
        },
        fetchCourses
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return { courses, loading, error, refetch: () => {} }
}

import { createClient } from '@supabase/supabase-js'
import { Database } from './supabase-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
    'Please add NEXT_PUBLIC_SUPABASE_URL to your .env file'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
    'Please add NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper functions for common operations

/**
 * Get the current user's profile
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

/**
 * Update the current user's profile
 */
export async function updateUserProfile(userId: string, updates: Database['public']['Tables']['user_profiles']['Update']) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

/**
 * Get user's dashboard settings
 */
export async function getDashboardSettings(userId: string) {
  const { data, error } = await supabase
    .from('dashboard_settings')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

/**
 * Update user's dashboard settings
 */
export async function updateDashboardSettings(
  userId: string, 
  updates: Database['public']['Tables']['dashboard_settings']['Update']
) {
  const { data, error } = await supabase
    .from('dashboard_settings')
    .upsert({ user_id: userId, ...updates })
    .select()
    .single()
  
  return { data, error }
}

/**
 * Log user activity
 */
export async function logActivity(
  userId: string,
  action: string,
  description?: string,
  metadata?: Record<string, any>
) {
  const { data, error } = await supabase
    .from('activity_log')
    .insert({
      user_id: userId,
      action,
      description,
      metadata
    })
    .select()
    .single()
  
  return { data, error }
}

/**
 * Get user's activity log
 */
export async function getActivityLog(userId: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  return { data, error }
}


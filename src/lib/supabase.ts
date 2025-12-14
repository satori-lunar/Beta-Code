import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Log warning in development if env vars are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ Missing Supabase environment variables!\n' +
    'VITE_SUPABASE_URL: ' + (supabaseUrl ? '✓' : '✗') + '\n' +
    'VITE_SUPABASE_ANON_KEY: ' + (supabaseAnonKey ? '✓' : '✗') + '\n' +
    'Please set these in:\n' +
    '- Local development: .env.local file\n' +
    '- Production (Vercel): Project Settings > Environment Variables'
  )
}

// Create client with fallback values - will fail gracefully if env vars are missing
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

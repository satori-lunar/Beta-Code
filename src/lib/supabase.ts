import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error(
    'Missing VITE_SUPABASE_URL environment variable. ' +
    'Please create a .env.local file with VITE_SUPABASE_URL=your-project-url'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_ANON_KEY environment variable. ' +
    'Please create a .env.local file with VITE_SUPABASE_ANON_KEY=your-anon-key'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

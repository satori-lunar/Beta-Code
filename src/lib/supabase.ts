import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qbsrmbxuwacpqquorqaq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzyIX3'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

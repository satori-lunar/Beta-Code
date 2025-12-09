export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          join_date: string
          streak: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          join_date?: string
          streak?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          join_date?: string
          streak?: number
          created_at?: string
          updated_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon: string
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          category?: string
          created_at?: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          earned_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          earned_date?: string
          created_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string
          color: string
          frequency: string
          target_days: number[] | null
          streak: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          icon: string
          color: string
          frequency?: string
          target_days?: number[] | null
          streak?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          icon?: string
          color?: string
          frequency?: string
          target_days?: number[] | null
          streak?: number
          created_at?: string
          updated_at?: string
        }
      }
      habit_completions: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          completed_date: string
          created_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          completed_date: string
          created_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          completed_date?: string
          created_at?: string
        }
      }
      weight_entries: {
        Row: {
          id: string
          user_id: string
          weight: number
          unit: string
          notes: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          weight: number
          unit?: string
          notes?: string | null
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          weight?: number
          unit?: string
          notes?: string | null
          date?: string
          created_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          mood: string
          tags: string[]
          gratitude: string[] | null
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          mood: string
          tags?: string[]
          gratitude?: string[] | null
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          mood?: string
          tags?: string[]
          gratitude?: string[] | null
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
      nutrition_entries: {
        Row: {
          id: string
          user_id: string
          date: string
          total_calories: number
          total_protein: number
          total_carbs: number
          total_fat: number
          water_intake: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          total_calories?: number
          total_protein?: number
          total_carbs?: number
          total_fat?: number
          water_intake?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          total_calories?: number
          total_protein?: number
          total_carbs?: number
          total_fat?: number
          water_intake?: number
          created_at?: string
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          nutrition_entry_id: string
          user_id: string
          type: string
          name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          time: string
          created_at: string
        }
        Insert: {
          id?: string
          nutrition_entry_id: string
          user_id: string
          type: string
          name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          time: string
          created_at?: string
        }
        Update: {
          id?: string
          nutrition_entry_id?: string
          user_id?: string
          type?: string
          name?: string
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          time?: string
          created_at?: string
        }
      }
      courses: {
        Row: {
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
        }
        Insert: {
          id?: string
          title: string
          description: string
          thumbnail_url?: string | null
          instructor: string
          duration: string
          sessions: number
          category: string
          level: string
          tags?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          thumbnail_url?: string | null
          instructor?: string
          duration?: string
          sessions?: number
          category?: string
          level?: string
          tags?: string[]
          created_at?: string
        }
      }
      user_course_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          completed_sessions: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          completed_sessions?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          completed_sessions?: number
          created_at?: string
          updated_at?: string
        }
      }
      live_classes: {
        Row: {
          id: string
          title: string
          description: string
          instructor: string
          scheduled_at: string
          duration: number
          zoom_link: string | null
          thumbnail_url: string | null
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          instructor: string
          scheduled_at: string
          duration: number
          zoom_link?: string | null
          thumbnail_url?: string | null
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          instructor?: string
          scheduled_at?: string
          duration?: number
          zoom_link?: string | null
          thumbnail_url?: string | null
          category?: string
          created_at?: string
        }
      }
      recorded_sessions: {
        Row: {
          id: string
          title: string
          description: string
          instructor: string
          recorded_at: string
          duration: number
          video_url: string
          thumbnail_url: string | null
          category: string
          views: number
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          instructor: string
          recorded_at: string
          duration: number
          video_url: string
          thumbnail_url?: string | null
          category: string
          views?: number
          tags?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          instructor?: string
          recorded_at?: string
          duration?: number
          video_url?: string
          thumbnail_url?: string | null
          category?: string
          views?: number
          tags?: string[]
          created_at?: string
        }
      }
      user_favorite_sessions: {
        Row: {
          id: string
          user_id: string
          session_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          created_at?: string
        }
      }
      calendar_events: {
        Row: {
          id: string
          user_id: string
          title: string
          date: string
          time: string | null
          type: string
          color: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          date: string
          time?: string | null
          type: string
          color: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          date?: string
          time?: string | null
          type?: string
          color?: string
          description?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          read: boolean
          link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          read?: boolean
          link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          read?: boolean
          link?: string | null
          created_at?: string
        }
      }
      help_tickets: {
        Row: {
          id: string
          user_id: string
          subject: string
          message: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject: string
          message: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          message?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

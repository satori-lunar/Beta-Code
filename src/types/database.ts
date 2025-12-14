export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          color: string | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          time: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          time?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          time?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      course_progress: {
        Row: {
          completed_sessions: number | null
          course_id: string
          created_at: string | null
          id: string
          last_session_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_sessions?: number | null
          course_id: string
          created_at?: string | null
          id?: string
          last_session_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_sessions?: number | null
          course_id?: string
          created_at?: string | null
          id?: string
          last_session_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      dashboard_settings: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          settings_json: Json | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          settings_json?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          settings_json?: Json | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      favorite_sessions: {
        Row: {
          created_at: string | null
          id: string
          session_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      habits: {
        Row: {
          color: string | null
          completed_dates: Json | null
          created_at: string | null
          frequency: string | null
          icon: string | null
          id: string
          name: string
          streak: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          completed_dates?: Json | null
          created_at?: string | null
          frequency?: string | null
          icon?: string | null
          id?: string
          name: string
          streak?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          completed_dates?: Json | null
          created_at?: string | null
          frequency?: string | null
          icon?: string | null
          id?: string
          name?: string
          streak?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      health_metrics: {
        Row: {
          active_minutes: Json | null
          blood_pressure: Json | null
          bmi: Json | null
          body_fat: Json | null
          body_temperature: Json | null
          calories_burned: Json | null
          energy_level: Json | null
          heart_rate: Json | null
          height: Json | null
          hydration: Json | null
          id: string
          oxygen_saturation: Json | null
          respiratory_rate: Json | null
          sleep_hours: Json | null
          steps: Json | null
          stress_level: Json | null
          updated_at: string | null
          user_id: string
          weight: Json | null
        }
        Insert: {
          active_minutes?: Json | null
          blood_pressure?: Json | null
          bmi?: Json | null
          body_fat?: Json | null
          body_temperature?: Json | null
          calories_burned?: Json | null
          energy_level?: Json | null
          heart_rate?: Json | null
          height?: Json | null
          hydration?: Json | null
          id?: string
          oxygen_saturation?: Json | null
          respiratory_rate?: Json | null
          sleep_hours?: Json | null
          steps?: Json | null
          stress_level?: Json | null
          updated_at?: string | null
          user_id: string
          weight?: Json | null
        }
        Update: {
          active_minutes?: Json | null
          blood_pressure?: Json | null
          bmi?: Json | null
          body_fat?: Json | null
          body_temperature?: Json | null
          calories_burned?: Json | null
          energy_level?: Json | null
          heart_rate?: Json | null
          height?: Json | null
          hydration?: Json | null
          id?: string
          oxygen_saturation?: Json | null
          respiratory_rate?: Json | null
          sleep_hours?: Json | null
          steps?: Json | null
          stress_level?: Json | null
          updated_at?: string | null
          user_id?: string
          weight?: Json | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string | null
          date: string
          gratitude: string[] | null
          id: string
          mood: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          date: string
          gratitude?: string[] | null
          id?: string
          mood?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          date?: string
          gratitude?: string[] | null
          id?: string
          mood?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      nutrition_entries: {
        Row: {
          calories: number | null
          carbs: number | null
          created_at: string | null
          date: string
          fat: number | null
          id: string
          meal_type: string
          name: string
          notes: string | null
          protein: number | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          date: string
          fat?: number | null
          id?: string
          meal_type: string
          name: string
          notes?: string | null
          protein?: number | null
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          date?: string
          fat?: number | null
          id?: string
          meal_type?: string
          name?: string
          notes?: string | null
          protein?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          earned_date: string | null
          icon: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          earned_date?: string | null
          icon?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          earned_date?: string | null
          icon?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          goal_weight: number | null
          goal_weight_unit: string | null
          id: string
          join_date: string | null
          streak: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          goal_weight?: number | null
          goal_weight_unit?: string | null
          id: string
          join_date?: string | null
          streak?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          goal_weight?: number | null
          goal_weight_unit?: string | null
          id?: string
          join_date?: string | null
          streak?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      weight_entries: {
        Row: {
          created_at: string | null
          date: string
          id: string
          notes: string | null
          unit: string | null
          user_id: string
          weight: number
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          unit?: string | null
          user_id: string
          weight: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          unit?: string | null
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'reminder' | 'achievement' | 'class' | 'streak' | 'system'
          read: boolean
          link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'reminder' | 'achievement' | 'class' | 'streak' | 'system'
          read?: boolean
          link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'reminder' | 'achievement' | 'class' | 'streak' | 'system'
          read?: boolean
          link?: string | null
          created_at?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          category: 'streak' | 'habit' | 'workout' | 'nutrition' | 'mindfulness' | 'special'
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon: string
          category: 'streak' | 'habit' | 'workout' | 'nutrition' | 'mindfulness' | 'special'
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          category?: 'streak' | 'habit' | 'workout' | 'nutrition' | 'mindfulness' | 'special'
          created_at?: string | null
        }
        Relationships: []
      }
      workout_presets: {
        Row: {
          id: string
          user_id: string
          name: string
          activity_type: string
          goal_type: string
          target_time: number | null
          target_milestones: number | null
          milestone_mode: string
          auto_milestone_interval: number | null
          intensity: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          activity_type: string
          goal_type: string
          target_time?: number | null
          target_milestones?: number | null
          milestone_mode: string
          auto_milestone_interval?: number | null
          intensity: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          activity_type?: string
          goal_type?: string
          target_time?: number | null
          target_milestones?: number | null
          milestone_mode?: string
          auto_milestone_interval?: number | null
          intensity?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      workout_history: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          duration: number
          milestones: number
          calories: number
          goal_type: string | null
          milestone_mode: string | null
          auto_milestone_interval: number | null
          notes: string | null
          finished_at: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          duration: number
          milestones: number
          calories: number
          goal_type?: string | null
          milestone_mode?: string | null
          auto_milestone_interval?: number | null
          notes?: string | null
          finished_at: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          duration?: number
          milestones?: number
          calories?: number
          goal_type?: string | null
          milestone_mode?: string | null
          auto_milestone_interval?: number | null
          notes?: string | null
          finished_at?: string
          created_at?: string | null
        }
        Relationships: []
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
          created_at: string | null
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
          created_at?: string | null
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
          created_at?: string | null
        }
        Relationships: []
      }
      class_reminders: {
        Row: {
          id: string
          user_id: string
          live_class_id: string
          notification_type: 'email' | 'push'
          reminder_minutes_before: number
          scheduled_reminder_time: string
          sent: boolean
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          live_class_id: string
          notification_type: 'email' | 'push'
          reminder_minutes_before: number
          scheduled_reminder_time: string
          sent?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          live_class_id?: string
          notification_type?: 'email' | 'push'
          reminder_minutes_before?: number
          scheduled_reminder_time?: string
          sent?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          join_date: string | null
          streak: number | null
          role: 'member' | 'admin'
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          join_date?: string | null
          streak?: number | null
          role?: 'member' | 'admin'
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          join_date?: string | null
          streak?: number | null
          role?: 'member' | 'admin'
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          id: string
          user_id: string
          email: string
          assigned_by: string | null
          assigned_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          assigned_by?: string | null
          assigned_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          assigned_by?: string | null
          assigned_at?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          id: string
          user_id: string
          activity_type: 'video_view' | 'favorite_added' | 'favorite_removed' | 'reminder_set' | 'reminder_cancelled' | 'login' | 'weight_logged' | 'journal_entry_created' | 'journal_entry_updated' | 'habit_completed' | 'session_completed'
          entity_type: string | null
          entity_id: string | null
          activity_description: string | null
          entity_title: string | null
          metadata: Json
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: 'video_view' | 'favorite_added' | 'favorite_removed' | 'reminder_set' | 'reminder_cancelled' | 'login' | 'weight_logged' | 'journal_entry_created' | 'journal_entry_updated' | 'habit_completed' | 'session_completed'
          entity_type?: string | null
          entity_id?: string | null
          activity_description?: string | null
          entity_title?: string | null
          metadata?: Json
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: 'video_view' | 'favorite_added' | 'favorite_removed' | 'reminder_set' | 'reminder_cancelled' | 'login' | 'weight_logged' | 'journal_entry_created' | 'journal_entry_updated' | 'habit_completed' | 'session_completed'
          entity_type?: string | null
          entity_id?: string | null
          activity_description?: string | null
          entity_title?: string | null
          metadata?: Json
          created_at?: string | null
        }
        Relationships: []
      }
      video_views: {
        Row: {
          id: string
          user_id: string
          session_id: string | null
          viewed_at: string | null
          duration_seconds: number | null
          completed: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          session_id?: string | null
          viewed_at?: string | null
          duration_seconds?: number | null
          completed?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string | null
          viewed_at?: string | null
          duration_seconds?: number | null
          completed?: boolean
          created_at?: string | null
        }
        Relationships: []
      }
      user_logins: {
        Row: {
          id: string
          user_id: string
          login_at: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          login_at?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          login_at?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string | null
        }
        Relationships: []
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
          created_at: string | null
          kajabi_product_id: string | null
          kajabi_offering_id: string | null
          synced_from_kajabi: boolean | null
          course_id: string | null
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
          created_at?: string | null
          kajabi_product_id?: string | null
          kajabi_offering_id?: string | null
          synced_from_kajabi?: boolean | null
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
          created_at?: string | null
          kajabi_product_id?: string | null
          kajabi_offering_id?: string | null
          synced_from_kajabi?: boolean | null
          course_id?: string | null
        }
        Relationships: []
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
          created_at: string | null
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
          created_at?: string | null
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
          created_at?: string | null
        }
        Relationships: []
      }
      user_favorite_sessions: {
        Row: {
          id: string
          user_id: string
          session_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          created_at?: string | null
        }
        Relationships: []
      }
      user_session_completions: {
        Row: {
          id: string
          user_id: string
          session_id: string
          completed_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          completed_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          completed_at?: string | null
          created_at?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

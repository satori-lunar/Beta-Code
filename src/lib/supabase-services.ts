import { supabase } from './supabase';

// Auth services
export const authService = {
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// User services
export const userService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*, user_badges(*, badges(*))')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async updateProfile(userId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) return { error: uploadError };

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const { data, error } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  }
};

// Habit services
export const habitService = {
  async getHabits(userId: string) {
    const { data, error } = await supabase
      .from('habits')
      .select('*, habit_completions(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createHabit(habit: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('habits')
      .insert(habit)
      .select()
      .single();
    return { data, error };
  },

  async updateHabit(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteHabit(id: string) {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);
    return { error };
  },

  async toggleCompletion(habitId: string, userId: string, date: string) {
    // Check if completion exists
    const { data: existing } = await supabase
      .from('habit_completions')
      .select()
      .eq('habit_id', habitId)
      .eq('completed_date', date)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('habit_completions')
        .delete()
        .eq('id', (existing as { id: string }).id);
      return { added: false, error };
    } else {
      const { error } = await supabase
        .from('habit_completions')
        .insert({
          habit_id: habitId,
          user_id: userId,
          completed_date: date
        });
      return { added: true, error };
    }
  }
};

// Nutrition services
export const nutritionService = {
  async getEntries(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('nutrition_entries')
      .select('*, meals(*)')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data, error } = await query;
    return { data, error };
  },

  async upsertEntry(entry: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('nutrition_entries')
      .upsert(entry, { onConflict: 'user_id,date' })
      .select()
      .single();
    return { data, error };
  },

  async addMeal(meal: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('meals')
      .insert(meal)
      .select()
      .single();
    return { data, error };
  },

  async deleteMeal(id: string) {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Weight services
export const weightService = {
  async getEntries(userId: string) {
    const { data, error } = await supabase
      .from('weight_entries')
      .select()
      .eq('user_id', userId)
      .order('date', { ascending: false });
    return { data, error };
  },

  async addEntry(entry: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('weight_entries')
      .insert(entry)
      .select()
      .single();
    return { data, error };
  },

  async deleteEntry(id: string) {
    const { error } = await supabase
      .from('weight_entries')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Journal services
export const journalService = {
  async getEntries(userId: string) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select()
      .eq('user_id', userId)
      .order('date', { ascending: false });
    return { data, error };
  },

  async createEntry(entry: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert(entry)
      .select()
      .single();
    return { data, error };
  },

  async updateEntry(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('journal_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteEntry(id: string) {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Course services
export const courseService = {
  async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select()
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getUserProgress(userId: string) {
    const { data, error } = await supabase
      .from('user_course_progress')
      .select('*, courses(*)')
      .eq('user_id', userId);
    return { data, error };
  },

  async updateProgress(userId: string, courseId: string, completedSessions: number) {
    const { data, error } = await supabase
      .from('user_course_progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        completed_sessions: completedSessions
      }, { onConflict: 'user_id,course_id' })
      .select()
      .single();
    return { data, error };
  }
};

// Live class services
export const liveClassService = {
  async getUpcoming() {
    const { data, error } = await supabase
      .from('live_classes')
      .select()
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true });
    return { data, error };
  },

  async getTodaysClasses() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    const { data, error } = await supabase
      .from('live_classes')
      .select()
      .gte('scheduled_at', startOfDay)
      .lte('scheduled_at', endOfDay)
      .order('scheduled_at', { ascending: true });
    return { data, error };
  }
};

// Recorded session services
export const recordedSessionService = {
  async getSessions() {
    const { data, error } = await supabase
      .from('recorded_sessions')
      .select()
      .order('recorded_at', { ascending: false });
    return { data, error };
  },

  async getFavorites(userId: string) {
    const { data, error } = await supabase
      .from('user_favorite_sessions')
      .select('*, recorded_sessions(*)')
      .eq('user_id', userId);
    return { data, error };
  },

  async toggleFavorite(userId: string, sessionId: string) {
    const { data: existing } = await supabase
      .from('user_favorite_sessions')
      .select()
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('user_favorite_sessions')
        .delete()
        .eq('id', (existing as { id: string }).id);
      return { isFavorite: false, error };
    } else {
      const { error } = await supabase
        .from('user_favorite_sessions')
        .insert({ user_id: userId, session_id: sessionId });
      return { isFavorite: true, error };
    }
  }
};

// Calendar services
export const calendarService = {
  async getEvents(userId: string, month?: number, year?: number) {
    let query = supabase
      .from('calendar_events')
      .select()
      .eq('user_id', userId)
      .order('date', { ascending: true });

    if (month !== undefined && year !== undefined) {
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      query = query.gte('date', startDate).lte('date', endDate);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async createEvent(event: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert(event)
      .select()
      .single();
    return { data, error };
  },

  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Notification services
export const notificationService = {
  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async markAsRead(id: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    return { error };
  },

  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId);
    return { error };
  },

  async deleteNotification(id: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Help ticket services
export const helpService = {
  async getTickets(userId: string) {
    const { data, error } = await supabase
      .from('help_tickets')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createTicket(ticket: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('help_tickets')
      .insert(ticket)
      .select()
      .single();
    return { data, error };
  },

  async updateTicket(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('help_tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }
};

// Badge services
export const badgeService = {
  async getAllBadges() {
    const { data, error } = await supabase
      .from('badges')
      .select()
      .order('category');
    return { data, error };
  },

  async getUserBadges(userId: string) {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*, badges(*)')
      .eq('user_id', userId);
    return { data, error };
  },

  async awardBadge(userId: string, badgeId: string) {
    const { data, error } = await supabase
      .from('user_badges')
      .insert({ user_id: userId, badge_id: badgeId })
      .select()
      .single();
    return { data, error };
  }
};

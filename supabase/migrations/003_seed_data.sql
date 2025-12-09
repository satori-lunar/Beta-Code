-- Seed Data for Wellness Dashboard
-- Run this after the initial schema to populate default data

-- Insert default badges
INSERT INTO public.badges (id, name, description, icon, category) VALUES
  (uuid_generate_v4(), '7 Day Streak', 'Complete habits for 7 days straight', 'flame', 'streak'),
  (uuid_generate_v4(), '30 Day Streak', 'Complete habits for 30 days straight', 'fire', 'streak'),
  (uuid_generate_v4(), '100 Day Streak', 'Complete habits for 100 days straight', 'zap', 'streak'),
  (uuid_generate_v4(), 'Early Bird', 'Complete morning routine 5 times', 'sunrise', 'habit'),
  (uuid_generate_v4(), 'Night Owl', 'Complete evening routine 5 times', 'moon', 'habit'),
  (uuid_generate_v4(), 'Habit Master', 'Complete 50 habit check-ins', 'check-circle', 'habit'),
  (uuid_generate_v4(), 'Workout Warrior', 'Complete 15 workout sessions', 'dumbbell', 'workout'),
  (uuid_generate_v4(), 'Cardio Champion', 'Complete 10 cardio workouts', 'heart', 'workout'),
  (uuid_generate_v4(), 'Strength Star', 'Complete 10 strength workouts', 'trophy', 'workout'),
  (uuid_generate_v4(), 'Hydration Hero', 'Meet water goals for 10 days', 'droplet', 'nutrition'),
  (uuid_generate_v4(), 'Balanced Eater', 'Log meals for 7 consecutive days', 'utensils', 'nutrition'),
  (uuid_generate_v4(), 'Protein Power', 'Meet protein goals for 5 days', 'beef', 'nutrition'),
  (uuid_generate_v4(), 'Mindfulness Master', 'Complete 20 meditation sessions', 'brain', 'mindfulness'),
  (uuid_generate_v4(), 'Zen Seeker', 'Complete 5 meditation courses', 'lotus', 'mindfulness'),
  (uuid_generate_v4(), 'Gratitude Guru', 'Write 10 gratitude entries', 'heart-handshake', 'mindfulness'),
  (uuid_generate_v4(), 'First Steps', 'Complete your first habit', 'footprints', 'special'),
  (uuid_generate_v4(), 'Course Completer', 'Finish your first course', 'graduation-cap', 'special'),
  (uuid_generate_v4(), 'Community Member', 'Attend your first live class', 'users', 'special')
ON CONFLICT DO NOTHING;

-- Insert sample courses
INSERT INTO public.courses (id, title, description, instructor, duration, sessions, category, level, tags) VALUES
  (uuid_generate_v4(), 'Finding Calm', 'Learn to find inner peace through guided meditation and mindfulness practices. This course will teach you techniques to reduce stress and anxiety.', 'Dr. Emma Wilson', '4 weeks', 17, 'Meditation', 'beginner', ARRAY['calm', 'beginner', 'meditation']),
  (uuid_generate_v4(), 'Spiritual Growth', 'Explore your spiritual journey with practices from various traditions. Discover your inner self and connect with your higher purpose.', 'Mark Thompson', '6 weeks', 8, 'Spirituality', 'intermediate', ARRAY['growth', 'spiritual', 'mindfulness']),
  (uuid_generate_v4(), 'Motivation Mastery', 'Unlock your potential and learn the science behind motivation. Build lasting habits and achieve your goals.', 'Lisa Chen', '3 weeks', 11, 'Personal Growth', 'beginner', ARRAY['motivation', 'mindset', 'goals']),
  (uuid_generate_v4(), 'Breathe & Release', 'Master breathing techniques for relaxation and energy. Learn pranayama and modern breathing methods.', 'Dr. Emma Wilson', '2 weeks', 6, 'Wellness', 'beginner', ARRAY['breathing', 'relaxation', 'wellness']),
  (uuid_generate_v4(), 'Meaningful Life', 'Create purpose and meaning in your daily life. Design a life aligned with your values and passions.', 'John Davis', '8 weeks', 11, 'Life Purpose', 'advanced', ARRAY['purpose', 'life', 'meaning']),
  (uuid_generate_v4(), 'Yoga Fundamentals', 'Build a strong yoga foundation with proper alignment and breathing. Perfect for beginners.', 'Sarah Mitchell', '4 weeks', 20, 'Yoga', 'beginner', ARRAY['yoga', 'fitness', 'flexibility']),
  (uuid_generate_v4(), 'Sleep Better', 'Improve your sleep quality with proven techniques. Wake up refreshed and energized every day.', 'Dr. Emma Wilson', '2 weeks', 8, 'Sleep', 'beginner', ARRAY['sleep', 'rest', 'recovery']),
  (uuid_generate_v4(), 'Nutrition Essentials', 'Learn the fundamentals of balanced nutrition. Make informed food choices for optimal health.', 'Lisa Chen', '3 weeks', 12, 'Nutrition', 'beginner', ARRAY['nutrition', 'health', 'food'])
ON CONFLICT DO NOTHING;

-- Insert sample recorded sessions
INSERT INTO public.recorded_sessions (id, title, description, instructor, recorded_at, duration, video_url, category, views, tags) VALUES
  (uuid_generate_v4(), 'Morning Yoga Flow', 'Start your day with an energizing 45-minute yoga session. Focus on stretching and awakening your body.', 'Sarah Mitchell', CURRENT_DATE - INTERVAL '8 days', 45, '/videos/morning-yoga.mp4', 'Yoga', 234, ARRAY['yoga', 'morning', 'energy']),
  (uuid_generate_v4(), 'Stress Relief Meditation', 'Release tension and find inner peace with this guided meditation. Perfect for after a long day.', 'Dr. Emma Wilson', CURRENT_DATE - INTERVAL '6 days', 30, '/videos/stress-relief.mp4', 'Meditation', 567, ARRAY['meditation', 'stress', 'relaxation']),
  (uuid_generate_v4(), 'HIIT Workout for Beginners', 'High intensity interval training made accessible. Burn calories and build strength in 25 minutes.', 'Mike Johnson', CURRENT_DATE - INTERVAL '4 days', 25, '/videos/hiit-beginner.mp4', 'Fitness', 891, ARRAY['hiit', 'workout', 'cardio']),
  (uuid_generate_v4(), 'Sleep Better Tonight', 'Evening relaxation techniques for quality sleep. Wind down and prepare for restful night.', 'Dr. Emma Wilson', CURRENT_DATE - INTERVAL '2 days', 20, '/videos/sleep-better.mp4', 'Sleep', 432, ARRAY['sleep', 'relaxation', 'evening']),
  (uuid_generate_v4(), 'Nutrition Basics', 'Understanding macros, calories, and balanced eating. Build a healthy relationship with food.', 'Lisa Chen', CURRENT_DATE - INTERVAL '1 day', 40, '/videos/nutrition-basics.mp4', 'Nutrition', 321, ARRAY['nutrition', 'health', 'food']),
  (uuid_generate_v4(), 'Evening Stretch Routine', 'Gentle stretching to release tension and prepare for sleep. 20 minutes of relaxation.', 'Sarah Mitchell', CURRENT_DATE - INTERVAL '3 days', 20, '/videos/evening-stretch.mp4', 'Yoga', 445, ARRAY['stretch', 'evening', 'relaxation']),
  (uuid_generate_v4(), 'Core Strength Basics', 'Build a strong foundation with these core exercises. Suitable for all fitness levels.', 'Mike Johnson', CURRENT_DATE - INTERVAL '5 days', 30, '/videos/core-strength.mp4', 'Fitness', 678, ARRAY['core', 'strength', 'workout'])
ON CONFLICT DO NOTHING;

-- Insert sample live classes (scheduled for the next few days)
INSERT INTO public.live_classes (id, title, description, instructor, scheduled_at, duration, zoom_link, category) VALUES
  (uuid_generate_v4(), 'Live Yoga Session', 'Join our morning yoga class for all levels. Start your day with energy and positivity.', 'Sarah Mitchell', (CURRENT_DATE + INTERVAL '1 day')::date + TIME '09:00:00', 60, 'https://zoom.us/j/example1', 'Yoga'),
  (uuid_generate_v4(), 'Meditation Circle', 'Group meditation for inner peace. Connect with our community in stillness.', 'Dr. Emma Wilson', CURRENT_DATE::date + TIME '14:00:00', 45, 'https://zoom.us/j/example2', 'Meditation'),
  (uuid_generate_v4(), 'Strength Training Live', 'Build strength together with guided exercises. All equipment levels welcome.', 'Mike Johnson', (CURRENT_DATE + INTERVAL '1 day')::date + TIME '10:00:00', 50, 'https://zoom.us/j/example3', 'Fitness'),
  (uuid_generate_v4(), 'Healthy Cooking Demo', 'Learn to cook nutritious meals live. Q&A and recipe sharing included.', 'Lisa Chen', (CURRENT_DATE + INTERVAL '2 days')::date + TIME '18:00:00', 60, 'https://zoom.us/j/example4', 'Nutrition'),
  (uuid_generate_v4(), 'Morning Meditation', 'Start your day with clarity and focus. Guided meditation for all levels.', 'Dr. Emma Wilson', CURRENT_DATE::date + TIME '07:00:00', 30, 'https://zoom.us/j/example5', 'Meditation'),
  (uuid_generate_v4(), 'Evening Wind Down', 'Relaxation session to end your day peacefully. Gentle movement and breathing.', 'Sarah Mitchell', CURRENT_DATE::date + TIME '20:00:00', 45, 'https://zoom.us/j/example6', 'Wellness')
ON CONFLICT DO NOTHING;

-- Health Metrics Schema Extension
-- Adds tables for health tracking features

-- Health metrics readings (blood sugar, heart rate, blood pressure)
CREATE TABLE IF NOT EXISTS public.health_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('blood_sugar', 'heart_rate', 'blood_pressure')),
  value DECIMAL(10, 2) NOT NULL,
  secondary_value DECIMAL(10, 2), -- For blood pressure (diastolic)
  unit VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'normal' CHECK (status IN ('normal', 'warning', 'danger')),
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BMI history
CREATE TABLE IF NOT EXISTS public.bmi_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  height DECIMAL(5, 2) NOT NULL, -- in cm
  weight DECIMAL(5, 2) NOT NULL, -- in kg
  bmi DECIMAL(4, 1) NOT NULL,
  category VARCHAR(20) CHECK (category IN ('underweight', 'healthy', 'overweight', 'obese')),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Body measurements
CREATE TABLE IF NOT EXISTS public.body_measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  chest DECIMAL(5, 2),
  waist DECIMAL(5, 2),
  hip DECIMAL(5, 2),
  arm DECIMAL(5, 2),
  thigh DECIMAL(5, 2),
  unit VARCHAR(5) DEFAULT 'in' CHECK (unit IN ('in', 'cm')),
  body_shape VARCHAR(50),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs for chart data
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('aerobics', 'yoga', 'meditation', 'strength', 'cardio', 'stretching', 'other')),
  duration INTEGER NOT NULL, -- in minutes
  intensity VARCHAR(20) DEFAULT 'moderate' CHECK (intensity IN ('low', 'moderate', 'high')),
  calories_burned INTEGER,
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  doctor_name VARCHAR(255),
  specialty VARCHAR(100),
  appointment_type VARCHAR(20) DEFAULT 'in-person' CHECK (appointment_type IN ('in-person', 'video', 'phone')),
  location VARCHAR(255),
  video_link VARCHAR(500),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER DEFAULT 30, -- in minutes
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User dashboard preferences (widget layout, theme colors)
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  primary_color VARCHAR(7) DEFAULT '#f97316',
  secondary_color VARCHAR(7) DEFAULT '#84cc16',
  accent_color VARCHAR(7) DEFAULT '#0ea5e9',
  dashboard_layout JSONB DEFAULT '[]'::JSONB,
  notification_preferences JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_health_readings_user_date ON public.health_readings(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_readings_type ON public.health_readings(type);
CREATE INDEX IF NOT EXISTS idx_bmi_readings_user_date ON public.bmi_readings(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_body_measurements_user_date ON public.body_measurements(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_date ON public.activity_logs(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON public.activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_appointments_user_date ON public.appointments(user_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

-- Enable Row Level Security
ALTER TABLE public.health_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bmi_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for health_readings
CREATE POLICY "Users can view own health readings"
  ON public.health_readings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health readings"
  ON public.health_readings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health readings"
  ON public.health_readings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own health readings"
  ON public.health_readings FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for bmi_readings
CREATE POLICY "Users can view own BMI readings"
  ON public.bmi_readings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own BMI readings"
  ON public.bmi_readings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own BMI readings"
  ON public.bmi_readings FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for body_measurements
CREATE POLICY "Users can view own body measurements"
  ON public.body_measurements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own body measurements"
  ON public.body_measurements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own body measurements"
  ON public.body_measurements FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own body measurements"
  ON public.body_measurements FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for activity_logs
CREATE POLICY "Users can view own activity logs"
  ON public.activity_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity logs"
  ON public.activity_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own activity logs"
  ON public.activity_logs FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for appointments
CREATE POLICY "Users can view own appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments"
  ON public.appointments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fix nutrition_entries table structure
-- This migration ensures the table matches the expected schema

-- First, check if meal_type column exists and remove it if it does
DO $$
BEGIN
  -- Drop meal_type column if it exists (it shouldn't be in nutrition_entries)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'nutrition_entries'
    AND column_name = 'meal_type'
  ) THEN
    ALTER TABLE public.nutrition_entries DROP COLUMN meal_type;
  END IF;

  -- Drop name column if it exists (meals should be in meals table, not nutrition_entries)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'nutrition_entries'
    AND column_name = 'name'
  ) THEN
    ALTER TABLE public.nutrition_entries DROP COLUMN name;
  END IF;

  -- Drop calories, protein, carbs, fat if they exist (these should be in meals table)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'nutrition_entries'
    AND column_name = 'calories'
  ) THEN
    ALTER TABLE public.nutrition_entries DROP COLUMN calories;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'nutrition_entries'
    AND column_name = 'protein'
  ) THEN
    ALTER TABLE public.nutrition_entries DROP COLUMN protein;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'nutrition_entries'
    AND column_name = 'carbs'
  ) THEN
    ALTER TABLE public.nutrition_entries DROP COLUMN carbs;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'nutrition_entries'
    AND column_name = 'fat'
  ) THEN
    ALTER TABLE public.nutrition_entries DROP COLUMN fat;
  END IF;

  -- Add total_calories if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'nutrition_entries'
    AND column_name = 'total_calories'
  ) THEN
    ALTER TABLE public.nutrition_entries
    ADD COLUMN total_calories INTEGER DEFAULT 0;
  END IF;

  -- Add total_protein if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'nutrition_entries'
    AND column_name = 'total_protein'
  ) THEN
    ALTER TABLE public.nutrition_entries
    ADD COLUMN total_protein INTEGER DEFAULT 0;
  END IF;

  -- Add total_carbs if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'nutrition_entries'
    AND column_name = 'total_carbs'
  ) THEN
    ALTER TABLE public.nutrition_entries
    ADD COLUMN total_carbs INTEGER DEFAULT 0;
  END IF;

  -- Add total_fat if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'nutrition_entries'
    AND column_name = 'total_fat'
  ) THEN
    ALTER TABLE public.nutrition_entries
    ADD COLUMN total_fat INTEGER DEFAULT 0;
  END IF;

  -- Add water_intake if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'nutrition_entries'
    AND column_name = 'water_intake'
  ) THEN
    ALTER TABLE public.nutrition_entries
    ADD COLUMN water_intake INTEGER DEFAULT 0;
  END IF;
END $$;


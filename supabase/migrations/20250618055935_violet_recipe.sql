/*
  # Fix Assessment Type Enum

  1. Changes
    - Safely create assessment_type enum only if it doesn't exist
    - Add type column back to assessments table with proper enum type
    - Set default values for existing records

  2. Security
    - No changes to existing RLS policies
*/

-- Create assessment_type enum only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assessment_type') THEN
    CREATE TYPE assessment_type AS ENUM ('quiz', 'exam', 'assessment');
  END IF;
END $$;

-- Add the type column back to assessments table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assessments' AND column_name = 'type'
  ) THEN
    ALTER TABLE assessments ADD COLUMN type assessment_type NOT NULL DEFAULT 'assessment';
  END IF;
END $$;

-- Update any existing records that might have NULL type
UPDATE assessments SET type = 'assessment' WHERE type IS NULL;
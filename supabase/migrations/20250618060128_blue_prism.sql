/*
  # Fix UUID Error - Replace default-school-id with proper UUID

  1. Problem
    - The error shows 'default-school-id' is being used where a UUID is expected
    - This is likely in the get_default_school_id function or similar

  2. Solution
    - Create or update the default school with a proper UUID
    - Fix any functions that reference the invalid UUID string
    - Ensure all UUID columns have valid UUID values
*/

-- First, let's create a proper default school with a valid UUID
INSERT INTO schools (id, name, address, phone, email, settings)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Default School',
  'Default Address',
  'Default Phone',
  'default@school.edu',
  '{}'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  settings = EXCLUDED.settings;

-- Create or replace the get_default_school_id function to return a proper UUID
CREATE OR REPLACE FUNCTION get_default_school_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Return the UUID of the default school
  RETURN '00000000-0000-0000-0000-000000000001'::uuid;
END;
$$;

-- Create or replace the create_user_profile function to handle UUIDs properly
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id uuid,
  user_email text,
  user_role user_role,
  first_name text,
  last_name text,
  user_phone text DEFAULT NULL,
  user_address text DEFAULT NULL,
  school_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  final_school_id uuid;
  profile_id uuid;
BEGIN
  -- Use provided school_id or get default
  IF school_id IS NULL THEN
    final_school_id := get_default_school_id();
  ELSE
    final_school_id := school_id;
  END IF;

  -- Insert the user profile
  INSERT INTO user_profiles (
    id,
    school_id,
    role,
    first_name,
    last_name,
    email,
    phone,
    address
  ) VALUES (
    user_id,
    final_school_id,
    user_role,
    first_name,
    last_name,
    user_email,
    user_phone,
    user_address
  ) RETURNING id INTO profile_id;

  RETURN profile_id;
END;
$$;

-- Create a function to generate QR codes (returns a random string, not UUID)
CREATE OR REPLACE FUNCTION generate_qr_code()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  -- Generate a random 12-character alphanumeric string for QR codes
  RETURN upper(substring(md5(random()::text) from 1 for 12));
END;
$$;

-- Update any existing records that might have invalid UUIDs
-- This is a safety measure in case there are any existing problematic records
UPDATE user_profiles 
SET school_id = '00000000-0000-0000-0000-000000000001'::uuid 
WHERE school_id IS NULL OR school_id::text = 'default-school-id';

-- Ensure we have proper indexes
CREATE INDEX IF NOT EXISTS idx_schools_id ON schools(id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_school_id ON user_profiles(school_id);

-- Add developer policies for full access
CREATE POLICY IF NOT EXISTS "Developers have full access to schools" ON schools
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'developer'
  ));

CREATE POLICY IF NOT EXISTS "Developers have full access to user profiles" ON user_profiles
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles user_profiles_1
    WHERE user_profiles_1.id = auth.uid() AND user_profiles_1.role = 'developer'
  ));

CREATE POLICY IF NOT EXISTS "Developers have full access to school levels" ON school_levels
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'developer'
  ));

CREATE POLICY IF NOT EXISTS "Developers have full access to sections" ON sections
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'developer'
  ));

CREATE POLICY IF NOT EXISTS "Developers have full access to enrollments" ON enrollments
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'developer'
  ));

CREATE POLICY IF NOT EXISTS "Developers have full access to teacher sections" ON teacher_sections
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'developer'
  ));

CREATE POLICY IF NOT EXISTS "Developers have full access to learning modules" ON learning_modules
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'developer'
  ));

CREATE POLICY IF NOT EXISTS "Developers have full access to assessments" ON assessments
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'developer'
  ));

CREATE POLICY IF NOT EXISTS "Developers have full access to questions" ON questions
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'developer'
  ));

CREATE POLICY IF NOT EXISTS "Developers have full access to student responses" ON student_responses
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'developer'
  ));

CREATE POLICY IF NOT EXISTS "Developers have full access to grades" ON grades
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'developer'
  ));

CREATE POLICY IF NOT EXISTS "Developers have full access to payments" ON payments
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'developer'
  ));

CREATE POLICY IF NOT EXISTS "Developers have full access to announcements" ON announcements
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'developer'
  ));
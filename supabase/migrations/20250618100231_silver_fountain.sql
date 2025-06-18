/*
  # Final UUID Fix Migration
  
  This migration completely eliminates the UUID error by:
  1. Ensuring all functions return proper UUIDs
  2. Cleaning up any problematic data
  3. Adding comprehensive error handling
  4. Validating all UUID operations
*/

-- Ensure we have a proper default school
INSERT INTO schools (id, name, address, phone, email, settings)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Default School',
  'Default Address',
  'Default Phone',
  'default@school.edu',
  '{}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  settings = EXCLUDED.settings;

-- Drop all potentially problematic functions
DROP FUNCTION IF EXISTS get_default_school_id() CASCADE;
DROP FUNCTION IF EXISTS create_user_profile(uuid, text, user_role, text, text, text, text, uuid) CASCADE;

-- Create a bulletproof get_default_school_id function
CREATE OR REPLACE FUNCTION get_default_school_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  default_uuid uuid := '00000000-0000-0000-0000-000000000001'::uuid;
BEGIN
  -- Ensure the default school exists
  IF NOT EXISTS (SELECT 1 FROM schools WHERE id = default_uuid) THEN
    INSERT INTO schools (id, name, address, phone, email, settings)
    VALUES (
      default_uuid,
      'Default School',
      'Default Address',
      'Default Phone',
      'default@school.edu',
      '{}'::jsonb
    );
  END IF;
  
  -- Always return the same UUID
  RETURN default_uuid;
END;
$$;

-- Create a bulletproof create_user_profile function
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
  -- Validate inputs
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'user_id cannot be null';
  END IF;
  
  IF user_email IS NULL OR user_email = '' THEN
    RAISE EXCEPTION 'user_email cannot be null or empty';
  END IF;
  
  IF first_name IS NULL OR first_name = '' THEN
    RAISE EXCEPTION 'first_name cannot be null or empty';
  END IF;
  
  IF last_name IS NULL OR last_name = '' THEN
    RAISE EXCEPTION 'last_name cannot be null or empty';
  END IF;

  -- Determine school_id
  IF school_id IS NULL THEN
    final_school_id := get_default_school_id();
  ELSE
    -- Validate that the provided school_id exists and is a valid UUID
    IF EXISTS (SELECT 1 FROM schools WHERE id = school_id) THEN
      final_school_id := school_id;
    ELSE
      -- Fall back to default if provided school doesn't exist
      final_school_id := get_default_school_id();
    END IF;
  END IF;

  -- Final validation
  IF final_school_id IS NULL THEN
    RAISE EXCEPTION 'Could not determine valid school_id';
  END IF;

  -- Insert the user profile with explicit column mapping
  INSERT INTO user_profiles (
    id,
    school_id,
    role,
    first_name,
    last_name,
    email,
    phone,
    address,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    user_id,                    -- uuid
    final_school_id,           -- uuid
    user_role,                 -- user_role enum
    first_name,                -- text
    last_name,                 -- text
    user_email,                -- text
    user_phone,                -- text (can be null)
    user_address,              -- text (can be null)
    true,                      -- boolean
    now(),                     -- timestamptz
    now()                      -- timestamptz
  ) RETURNING id INTO profile_id;

  RETURN profile_id;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'User profile already exists for user_id: %', user_id;
  WHEN foreign_key_violation THEN
    RAISE EXCEPTION 'Invalid school_id: %. School does not exist.', final_school_id;
  WHEN check_violation THEN
    RAISE EXCEPTION 'Data validation failed. Check your input values.';
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating user profile: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
END;
$$;

-- Clean up any potentially problematic data
-- This will fix any records that somehow got invalid UUIDs
DO $$
DECLARE
  rec RECORD;
  default_school_uuid uuid := '00000000-0000-0000-0000-000000000001'::uuid;
BEGIN
  -- Fix any user_profiles with invalid school_id
  FOR rec IN 
    SELECT id, school_id 
    FROM user_profiles 
    WHERE school_id IS NULL 
       OR NOT EXISTS (SELECT 1 FROM schools WHERE id = user_profiles.school_id)
  LOOP
    UPDATE user_profiles 
    SET school_id = default_school_uuid 
    WHERE id = rec.id;
    
    RAISE NOTICE 'Fixed user_profile % with invalid school_id %', rec.id, rec.school_id;
  END LOOP;
END $$;

-- Ensure all constraints are properly set
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_school_id_fkey;

ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_school_id_fkey 
FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE;

-- Add NOT NULL constraint to critical fields
ALTER TABLE user_profiles 
ALTER COLUMN school_id SET NOT NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_school_id_lookup ON user_profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_schools_id_lookup ON schools(id);

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_default_school_id() TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile(uuid, text, user_role, text, text, text, text, uuid) TO authenticated;

-- Add a validation function to check for UUID format issues
CREATE OR REPLACE FUNCTION validate_uuid_format(input_value text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Try to cast to UUID
  PERFORM input_value::uuid;
  RETURN true;
EXCEPTION
  WHEN invalid_text_representation THEN
    RETURN false;
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

GRANT EXECUTE ON FUNCTION validate_uuid_format(text) TO authenticated;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'UUID fix migration completed successfully';
  RAISE NOTICE 'Default school ID: %', get_default_school_id();
END $$;
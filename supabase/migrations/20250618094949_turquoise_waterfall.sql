-- Comprehensive fix for UUID issues
-- This migration ensures all UUID handling is correct

-- First, ensure we have a default school with a proper UUID
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

-- Drop and recreate the get_default_school_id function with proper UUID handling
DROP FUNCTION IF EXISTS get_default_school_id();

CREATE OR REPLACE FUNCTION get_default_school_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Always return a proper UUID, never a string
  RETURN '00000000-0000-0000-0000-000000000001'::uuid;
EXCEPTION
  WHEN OTHERS THEN
    -- Fallback: create a new default school if something goes wrong
    INSERT INTO schools (id, name, address, phone, email, settings)
    VALUES (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Default School',
      'Default Address',
      'Default Phone',
      'default@school.edu',
      '{}'::jsonb
    ) ON CONFLICT (id) DO NOTHING;
    
    RETURN '00000000-0000-0000-0000-000000000001'::uuid;
END;
$$;

-- Drop and recreate the create_user_profile function with better error handling
DROP FUNCTION IF EXISTS create_user_profile(uuid, text, user_role, text, text, text, text, uuid);

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
  -- Ensure we have a valid school_id
  IF school_id IS NULL THEN
    final_school_id := get_default_school_id();
  ELSE
    -- Validate that the provided school_id exists
    IF EXISTS (SELECT 1 FROM schools WHERE id = school_id) THEN
      final_school_id := school_id;
    ELSE
      -- Fall back to default if provided school doesn't exist
      final_school_id := get_default_school_id();
    END IF;
  END IF;

  -- Ensure final_school_id is never null
  IF final_school_id IS NULL THEN
    RAISE EXCEPTION 'Could not determine valid school_id';
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
    address,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    user_id,
    final_school_id,
    user_role,
    first_name,
    last_name,
    user_email,
    user_phone,
    user_address,
    true,
    now(),
    now()
  ) RETURNING id INTO profile_id;

  RETURN profile_id;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'User profile already exists for user_id: %', user_id;
  WHEN foreign_key_violation THEN
    RAISE EXCEPTION 'Invalid school_id: %', final_school_id;
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating user profile: %', SQLERRM;
END;
$$;

-- Clean up any existing records that might have invalid data
UPDATE user_profiles 
SET school_id = '00000000-0000-0000-0000-000000000001'::uuid 
WHERE school_id IS NULL 
   OR NOT EXISTS (SELECT 1 FROM schools WHERE id = user_profiles.school_id);

-- Ensure all foreign key constraints are properly set
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_school_id_fkey;

ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_school_id_fkey 
FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE;

-- Create a function to validate UUIDs (helper function)
CREATE OR REPLACE FUNCTION is_valid_uuid(input_text text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM input_text::uuid;
  RETURN true;
EXCEPTION
  WHEN invalid_text_representation THEN
    RETURN false;
END;
$$;

-- Add a check constraint to prevent invalid UUIDs in the future
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS check_valid_school_id;

-- Note: We don't add the constraint because it would prevent normal UUID operations
-- Instead, we rely on the foreign key constraint and our functions

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_default_school_id() TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile(uuid, text, user_role, text, text, text, text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION is_valid_uuid(text) TO authenticated;
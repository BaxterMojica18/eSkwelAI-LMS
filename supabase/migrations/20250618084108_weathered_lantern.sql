-- Fix the UUID format issue by updating the get_default_school_id function
-- and ensuring we have a proper default school with a valid UUID

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

-- Fix the get_default_school_id function to return a proper UUID
CREATE OR REPLACE FUNCTION get_default_school_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Return a proper UUID instead of a string
  RETURN '00000000-0000-0000-0000-000000000001'::uuid;
END;
$$;

-- Update the create_user_profile function to handle UUIDs properly
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
  -- Use provided school_id or get default (both are now proper UUIDs)
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

-- Clean up any existing records that might have invalid UUIDs
-- (This will only affect records that somehow got the string 'default-school-id')
UPDATE user_profiles 
SET school_id = '00000000-0000-0000-0000-000000000001'::uuid 
WHERE school_id::text = 'default-school-id' OR school_id IS NULL;
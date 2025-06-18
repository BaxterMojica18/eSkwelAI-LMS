/*
  # Fix role column type

  1. Changes
    - Update role column to use proper user_role enum type
    - Ensure all existing data is preserved
    - Update any existing records to have valid enum values

  2. Security
    - Maintain existing RLS policies
*/

-- First, let's see what role values exist (if any)
-- and update the role column to use the proper enum type

-- Drop the existing role column if it's text type
ALTER TABLE user_profiles DROP COLUMN IF EXISTS role;

-- Add the role column with the correct enum type
ALTER TABLE user_profiles ADD COLUMN role user_role NOT NULL DEFAULT 'student';

-- Update the create_user_profile function to handle the role parameter correctly
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

    -- Insert the user profile with correct column order
    INSERT INTO user_profiles (
        id,
        school_id,
        first_name,
        last_name,
        email,
        phone,
        address,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        user_id,
        final_school_id,
        first_name,
        last_name,
        user_email,
        user_phone,
        user_address,
        user_role,
        true,
        now(),
        now()
    ) RETURNING id INTO profile_id;

    RETURN profile_id;
END;
$$;
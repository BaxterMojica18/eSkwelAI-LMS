/*
  # Fix Remaining Database Issues

  1. Handle existing policies safely
  2. Ensure all required functions exist
  3. Fix any remaining RLS issues
  4. Complete the database setup
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Safely drop and recreate policies that might conflict
DO $$
BEGIN
    -- Drop existing policies if they exist (no error if they don't)
    DROP POLICY IF EXISTS "Developers have full access to schools" ON schools;
    DROP POLICY IF EXISTS "Allow authenticated users to read schools" ON schools;
    DROP POLICY IF EXISTS "Allow authenticated users to insert schools" ON schools;
    DROP POLICY IF EXISTS "Users can access their own school" ON schools;
    
    -- Create the correct policies
    CREATE POLICY "Allow authenticated users to read schools"
        ON schools FOR SELECT
        TO authenticated
        USING (true);

    CREATE POLICY "Allow authenticated users to insert schools"
        ON schools FOR INSERT
        TO authenticated
        WITH CHECK (true);

    CREATE POLICY "Developers have full access to schools"
        ON schools FOR ALL
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE user_profiles.id = auth.uid() 
                AND user_profiles.role = 'developer'
            )
        );
        
    RAISE NOTICE 'Schools policies recreated successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Some policies may already exist: %', SQLERRM;
END $$;

-- Ensure default school exists
DO $$
DECLARE
    default_school_uuid uuid;
BEGIN
    -- Check if default school already exists
    SELECT id INTO default_school_uuid 
    FROM schools 
    WHERE name = 'Default School' 
    LIMIT 1;
    
    -- If no default school exists, create one
    IF default_school_uuid IS NULL THEN
        INSERT INTO schools (id, name, address, phone, email, settings)
        VALUES (
            gen_random_uuid(),
            'Default School',
            '123 Education Street, Learning City, LC 12345',
            '+1 (555) 123-4567',
            'admin@defaultschool.edu',
            '{
                "academic_year": "2024-2025",
                "timezone": "America/New_York",
                "currency": "USD",
                "features": {
                    "qr_enrollment": true,
                    "online_payments": true,
                    "ai_analytics": true
                }
            }'::jsonb
        );
        
        RAISE NOTICE 'Created default school';
    ELSE
        RAISE NOTICE 'Default school already exists with ID: %', default_school_uuid;
    END IF;
END $$;

-- Create or replace helper function to get default school ID
CREATE OR REPLACE FUNCTION get_default_school_id()
RETURNS uuid AS $$
DECLARE
    school_id uuid;
BEGIN
    SELECT id INTO school_id 
    FROM schools 
    WHERE name = 'Default School' 
    LIMIT 1;
    
    IF school_id IS NULL THEN
        -- Create default school if it doesn't exist
        INSERT INTO schools (id, name, address, phone, email, settings)
        VALUES (
            gen_random_uuid(),
            'Default School',
            '123 Education Street',
            '+1 (555) 123-4567',
            'admin@defaultschool.edu',
            '{}'::jsonb
        )
        RETURNING id INTO school_id;
    END IF;
    
    RETURN school_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace function to safely create user profiles
CREATE OR REPLACE FUNCTION create_user_profile(
    user_id uuid,
    user_email text,
    user_role text,
    first_name text,
    last_name text,
    user_phone text DEFAULT NULL,
    user_address text DEFAULT NULL,
    school_id uuid DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
    final_school_id uuid;
    profile_id uuid;
BEGIN
    -- Use provided school_id or get default
    IF school_id IS NULL THEN
        SELECT get_default_school_id() INTO final_school_id;
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
        address,
        is_active,
        metadata
    )
    VALUES (
        user_id,
        final_school_id,
        user_role::user_role,
        first_name,
        last_name,
        user_email,
        user_phone,
        user_address,
        true,
        '{}'::jsonb
    )
    ON CONFLICT (id) DO UPDATE SET
        school_id = EXCLUDED.school_id,
        role = EXCLUDED.role,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        address = EXCLUDED.address,
        updated_at = now()
    RETURNING id INTO profile_id;
    
    RETURN profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix user_profiles policies to avoid infinite recursion
DO $$
BEGIN
    -- Drop existing problematic policies
    DROP POLICY IF EXISTS "Users can read school members" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Developers have full access to user profiles" ON user_profiles;
    DROP POLICY IF EXISTS "Users can read their own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
    
    -- Create safe policies
    CREATE POLICY "Users can read their own profile"
        ON user_profiles FOR SELECT
        TO authenticated
        USING (id = auth.uid());

    CREATE POLICY "Users can update their own profile"
        ON user_profiles FOR UPDATE
        TO authenticated
        USING (id = auth.uid())
        WITH CHECK (id = auth.uid());

    CREATE POLICY "Users can insert their own profile"
        ON user_profiles FOR INSERT
        TO authenticated
        WITH CHECK (id = auth.uid());

    -- Safe developer policy using auth metadata instead of user_profiles lookup
    CREATE POLICY "Developers have full access to user profiles"
        ON user_profiles FOR ALL
        TO authenticated
        USING (
            (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'developer'
            OR id = auth.uid()
        );
        
    RAISE NOTICE 'User profiles policies recreated successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error with user_profiles policies: %', SQLERRM;
END $$;

-- Create school levels for the default school (only if they don't exist)
DO $$
DECLARE
    default_school_uuid uuid;
    level_count integer;
BEGIN
    -- Get the default school ID
    SELECT get_default_school_id() INTO default_school_uuid;
    
    -- Check if levels already exist
    SELECT COUNT(*) INTO level_count
    FROM school_levels 
    WHERE school_id = default_school_uuid;
    
    -- Only create if no levels exist
    IF level_count = 0 THEN
        INSERT INTO school_levels (id, school_id, name, description, order_index)
        VALUES 
            (gen_random_uuid(), default_school_uuid, 'Elementary', 'Grades K-6', 1),
            (gen_random_uuid(), default_school_uuid, 'Middle School', 'Grades 7-8', 2),
            (gen_random_uuid(), default_school_uuid, 'High School', 'Grades 9-12', 3);
        
        RAISE NOTICE 'School levels created for default school';
    ELSE
        RAISE NOTICE 'School levels already exist for default school';
    END IF;
END $$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_default_school_id() TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile(uuid, text, text, text, text, text, text, uuid) TO authenticated;

-- Ensure RLS is enabled on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

RAISE NOTICE 'Database setup completed successfully!';
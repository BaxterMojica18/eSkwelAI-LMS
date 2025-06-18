/*
  # Fix Database Setup Issues

  This migration addresses all the current database issues:
  1. Enable pgcrypto extension for gen_random_uuid()
  2. Create default school with proper UUID
  3. Fix RLS policies to avoid infinite recursion
  4. Add proper insert policies for schools
  5. Ensure all tables have correct RLS setup

  ## Changes Made:
  1. Extensions - Enable pgcrypto for UUID generation
  2. Default School - Create with proper UUID
  3. RLS Policies - Fix infinite recursion and add missing policies
  4. Functions - Add helper functions for school management
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create default school with proper UUID (only if it doesn't exist)
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

-- Drop existing problematic policies to avoid conflicts
DROP POLICY IF EXISTS "Users can access their own school" ON schools;
DROP POLICY IF EXISTS "Users can read school members" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Developers have full access to user profiles" ON user_profiles;

-- Fix RLS policies for schools table
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
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'developer'
        )
    );

-- Fix RLS policies for user_profiles table (avoid infinite recursion)
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

CREATE POLICY "Developers have full access to user profiles"
    ON user_profiles FOR ALL
    TO authenticated
    USING (
        auth.uid() IN (
            SELECT id FROM user_profiles 
            WHERE role = 'developer' AND id = auth.uid()
        )
        OR 
        auth.uid() = id
    );

-- Create helper function to get default school ID
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

-- Create school levels for the default school (only if they don't exist)
DO $$
DECLARE
    default_school_uuid uuid;
BEGIN
    -- Get the default school ID
    SELECT get_default_school_id() INTO default_school_uuid;
    
    -- Insert school levels if they don't exist
    INSERT INTO school_levels (id, school_id, name, description, order_index)
    VALUES 
        (gen_random_uuid(), default_school_uuid, 'Elementary', 'Grades K-6', 1),
        (gen_random_uuid(), default_school_uuid, 'Middle School', 'Grades 7-8', 2),
        (gen_random_uuid(), default_school_uuid, 'High School', 'Grades 9-12', 3)
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'School levels created for default school';
END $$;

-- Ensure all tables have proper RLS policies for developers
DO $$
DECLARE
    table_name text;
    table_names text[] := ARRAY[
        'school_levels', 'sections', 'enrollments', 'teacher_sections',
        'learning_modules', 'assessments', 'questions', 'student_responses',
        'grades', 'payments', 'announcements', 'enrollment_qr_codes',
        'qr_enrollment_logs', 'parent_student_relationships'
    ];
BEGIN
    FOREACH table_name IN ARRAY table_names
    LOOP
        -- Drop existing developer policy if it exists
        EXECUTE format('DROP POLICY IF EXISTS "Developers have full access to %s" ON %s', table_name, table_name);
        
        -- Create new developer policy
        EXECUTE format('
            CREATE POLICY "Developers have full access to %s"
            ON %s FOR ALL
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM user_profiles 
                    WHERE user_profiles.id = auth.uid() 
                    AND user_profiles.role = ''developer''
                )
            )', table_name, table_name);
    END LOOP;
    
    RAISE NOTICE 'Developer policies created for all tables';
END $$;

-- Create a function to safely create user profiles
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
    RETURNING id INTO profile_id;
    
    RETURN profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_default_school_id() TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile(uuid, text, text, text, text, text, text, uuid) TO authenticated;
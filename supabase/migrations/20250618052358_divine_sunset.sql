/*
  # Bulletproof Policy Management

  1. Database Setup
    - Enable required extensions
    - Create default school with proper UUID handling
    - Create school levels and basic structure

  2. Policy Management
    - Use conditional DO $$ blocks to prevent conflicts
    - Check pg_policies before creating any policy
    - Safe creation that works regardless of existing state

  3. Security
    - Proper RLS policies for all tables
    - Developer access controls
    - User profile management without infinite recursion
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Step 1: Check and verify current policy state
DO $$
BEGIN
    RAISE NOTICE 'Starting bulletproof policy setup...';
    RAISE NOTICE 'Checking existing policies for schools table...';
    
    -- Log existing policies
    FOR rec IN 
        SELECT policyname FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'schools'
    LOOP
        RAISE NOTICE 'Found existing policy: %', rec.policyname;
    END LOOP;
END $$;

-- Step 2: Force drop problematic policies (safe approach)
DO $$
BEGIN
    -- Drop all existing policies for schools to start clean
    DROP POLICY IF EXISTS "Developers have full access to schools" ON schools;
    DROP POLICY IF EXISTS "Allow authenticated users to read schools" ON schools;
    DROP POLICY IF EXISTS "Allow authenticated users to insert schools" ON schools;
    DROP POLICY IF EXISTS "Users can access their own school" ON schools;
    
    RAISE NOTICE 'Cleaned existing schools policies';
END $$;

-- Step 3: Create schools policies using bulletproof method
DO $$
BEGIN
    -- Policy 1: Allow authenticated users to read schools
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'schools'
          AND policyname = 'Allow authenticated users to read schools'
    ) THEN
        EXECUTE '
            CREATE POLICY "Allow authenticated users to read schools"
            ON schools FOR SELECT
            TO authenticated
            USING (true)
        ';
        RAISE NOTICE 'Created policy: Allow authenticated users to read schools';
    ELSE
        RAISE NOTICE 'Policy already exists: Allow authenticated users to read schools';
    END IF;

    -- Policy 2: Allow authenticated users to insert schools
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'schools'
          AND policyname = 'Allow authenticated users to insert schools'
    ) THEN
        EXECUTE '
            CREATE POLICY "Allow authenticated users to insert schools"
            ON schools FOR INSERT
            TO authenticated
            WITH CHECK (true)
        ';
        RAISE NOTICE 'Created policy: Allow authenticated users to insert schools';
    ELSE
        RAISE NOTICE 'Policy already exists: Allow authenticated users to insert schools';
    END IF;

    -- Policy 3: Developers have full access to schools
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'schools'
          AND policyname = 'Developers have full access to schools'
    ) THEN
        EXECUTE '
            CREATE POLICY "Developers have full access to schools"
            ON schools FOR ALL
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM user_profiles 
                    WHERE user_profiles.id = auth.uid() 
                    AND user_profiles.role = ''developer''
                )
            )
        ';
        RAISE NOTICE 'Created policy: Developers have full access to schools';
    ELSE
        RAISE NOTICE 'Policy already exists: Developers have full access to schools';
    END IF;
END $$;

-- Step 4: Create default school with proper UUID (only if it doesn't exist)
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

-- Step 5: Create helper functions
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

-- Step 6: Fix user_profiles policies (bulletproof method)
DO $$
BEGIN
    -- Clean existing user_profiles policies
    DROP POLICY IF EXISTS "Users can read school members" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Developers have full access to user profiles" ON user_profiles;
    DROP POLICY IF EXISTS "Users can read their own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
    
    RAISE NOTICE 'Cleaned existing user_profiles policies';
END $$;

DO $$
BEGIN
    -- Users can read their own profile
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'user_profiles'
          AND policyname = 'Users can read their own profile'
    ) THEN
        EXECUTE '
            CREATE POLICY "Users can read their own profile"
            ON user_profiles FOR SELECT
            TO authenticated
            USING (id = auth.uid())
        ';
        RAISE NOTICE 'Created policy: Users can read their own profile';
    END IF;

    -- Users can update their own profile
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'user_profiles'
          AND policyname = 'Users can update their own profile'
    ) THEN
        EXECUTE '
            CREATE POLICY "Users can update their own profile"
            ON user_profiles FOR UPDATE
            TO authenticated
            USING (id = auth.uid())
            WITH CHECK (id = auth.uid())
        ';
        RAISE NOTICE 'Created policy: Users can update their own profile';
    END IF;

    -- Users can insert their own profile
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'user_profiles'
          AND policyname = 'Users can insert their own profile'
    ) THEN
        EXECUTE '
            CREATE POLICY "Users can insert their own profile"
            ON user_profiles FOR INSERT
            TO authenticated
            WITH CHECK (id = auth.uid())
        ';
        RAISE NOTICE 'Created policy: Users can insert their own profile';
    END IF;

    -- Developers have full access (safe version using auth metadata)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'user_profiles'
          AND policyname = 'Developers have full access to user profiles'
    ) THEN
        EXECUTE '
            CREATE POLICY "Developers have full access to user profiles"
            ON user_profiles FOR ALL
            TO authenticated
            USING (
                (auth.jwt() ->> ''user_metadata'')::jsonb ->> ''role'' = ''developer''
                OR id = auth.uid()
            )
        ';
        RAISE NOTICE 'Created policy: Developers have full access to user profiles';
    END IF;
END $$;

-- Step 7: Create school levels for the default school
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
        RAISE NOTICE 'School levels already exist for default school (count: %)', level_count;
    END IF;
END $$;

-- Step 8: Create developer policies for all other tables (bulletproof method)
DO $$
DECLARE
    table_name text;
    policy_exists boolean;
    table_names text[] := ARRAY[
        'school_levels', 'sections', 'enrollments', 'teacher_sections',
        'learning_modules', 'assessments', 'questions', 'student_responses',
        'grades', 'payments', 'announcements', 'enrollment_qr_codes',
        'qr_enrollment_logs', 'parent_student_relationships'
    ];
BEGIN
    FOREACH table_name IN ARRAY table_names
    LOOP
        -- Check if developer policy exists for this table
        EXECUTE format('
            SELECT EXISTS (
                SELECT 1 FROM pg_policies 
                WHERE schemaname = ''public'' 
                AND tablename = ''%s'' 
                AND policyname = ''Developers have full access to %s''
            )', table_name, table_name) INTO policy_exists;
        
        -- Create policy if it doesn't exist
        IF NOT policy_exists THEN
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
            
            RAISE NOTICE 'Created developer policy for table: %', table_name;
        ELSE
            RAISE NOTICE 'Developer policy already exists for table: %', table_name;
        END IF;
    END LOOP;
END $$;

-- Step 9: Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_default_school_id() TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile(uuid, text, text, text, text, text, text, uuid) TO authenticated;

-- Step 10: Ensure RLS is enabled on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- Final verification
DO $$
DECLARE
    policy_count integer;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'schools';
    
    RAISE NOTICE 'Final verification: schools table has % policies', policy_count;
    
    -- List all policies for schools
    FOR rec IN 
        SELECT policyname FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'schools'
    LOOP
        RAISE NOTICE 'Schools policy: %', rec.policyname;
    END LOOP;
    
    RAISE NOTICE '🎉 Bulletproof database setup completed successfully!';
END $$;
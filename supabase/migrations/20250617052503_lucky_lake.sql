/*
  # Create Developer Account and Demo Data

  1. New Data
    - Default demo school with proper UUID
    - School levels (Elementary, Middle, High School)
    - Sample sections for testing
    - Developer profile creation function

  2. Security
    - Enhanced RLS policies for developer role
    - Full system access for developers
    - Secure function for profile creation

  3. Features
    - Demo school setup for development
    - Sample data for testing
    - Developer account with full privileges
*/

-- Create a default school for development using proper UUID
INSERT INTO schools (id, name, address, phone, email, settings)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'eSkwelAI Demo School',
  '123 Education Street, Learning City, LC 12345',
  '+1 (555) 123-4567',
  'admin@eskwelai-demo.com',
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
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  settings = EXCLUDED.settings,
  updated_at = now();

-- Create school levels for the demo school
INSERT INTO school_levels (id, school_id, name, description, order_index)
VALUES 
  ('00000000-0000-0000-0000-000000000011'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Elementary', 'Grades K-6', 1),
  ('00000000-0000-0000-0000-000000000012'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Middle School', 'Grades 7-8', 2),
  ('00000000-0000-0000-0000-000000000013'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'High School', 'Grades 9-12', 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index;

-- Create sample sections
INSERT INTO sections (id, school_level_id, name, section_number, capacity)
VALUES 
  ('00000000-0000-0000-0000-000000000021'::uuid, '00000000-0000-0000-0000-000000000011'::uuid, 'Grade 1 - Section A', 1, 25),
  ('00000000-0000-0000-0000-000000000022'::uuid, '00000000-0000-0000-0000-000000000011'::uuid, 'Grade 2 - Section A', 1, 25),
  ('00000000-0000-0000-0000-000000000023'::uuid, '00000000-0000-0000-0000-000000000012'::uuid, 'Grade 7 - Section A', 1, 30),
  ('00000000-0000-0000-0000-000000000024'::uuid, '00000000-0000-0000-0000-000000000013'::uuid, 'Grade 9 - Section A', 1, 35)
ON CONFLICT (id) DO NOTHING;

-- Function to create developer user (will be called after auth user is created)
CREATE OR REPLACE FUNCTION create_developer_profile(user_id uuid, user_email text)
RETURNS void AS $$
BEGIN
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
    '00000000-0000-0000-0000-000000000001'::uuid,
    'developer',
    'System',
    'Developer',
    user_email,
    '+1 (555) 999-0001',
    'Remote Access',
    true,
    '{
      "access_level": "full",
      "permissions": ["all"],
      "created_by": "system",
      "notes": "Primary developer account with full system access"
    }'::jsonb
  )
  ON CONFLICT (id) DO UPDATE SET
    school_id = EXCLUDED.school_id,
    role = EXCLUDED.role,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    is_active = EXCLUDED.is_active,
    metadata = EXCLUDED.metadata,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced RLS policies for developers
DO $$
BEGIN
  -- Schools
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'schools' AND policyname = 'Developers have full access to schools'
  ) THEN
    CREATE POLICY "Developers have full access to schools" ON schools
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND role = 'developer'
        )
      );
  END IF;

  -- User profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' AND policyname = 'Developers have full access to user profiles'
  ) THEN
    CREATE POLICY "Developers have full access to user profiles" ON user_profiles
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND role = 'developer'
        )
      );
  END IF;

  -- School levels
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'school_levels' AND policyname = 'Developers have full access to school levels'
  ) THEN
    CREATE POLICY "Developers have full access to school levels" ON school_levels
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND role = 'developer'
        )
      );
  END IF;

  -- Sections
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sections' AND policyname = 'Developers have full access to sections'
  ) THEN
    CREATE POLICY "Developers have full access to sections" ON sections
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND role = 'developer'
        )
      );
  END IF;

  -- Enrollments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'enrollments' AND policyname = 'Developers have full access to enrollments'
  ) THEN
    CREATE POLICY "Developers have full access to enrollments" ON enrollments
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND role = 'developer'
        )
      );
  END IF;

  -- Teacher sections
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'teacher_sections' AND policyname = 'Developers have full access to teacher sections'
  ) THEN
    CREATE POLICY "Developers have full access to teacher sections" ON teacher_sections
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND role = 'developer'
        )
      );
  END IF;

  -- Learning modules
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'learning_modules' AND policyname = 'Developers have full access to learning modules'
  ) THEN
    CREATE POLICY "Developers have full access to learning modules" ON learning_modules
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND role = 'developer'
        )
      );
  END IF;

  -- Assessments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'assessments' AND policyname = 'Developers have full access to assessments'
  ) THEN
    CREATE POLICY "Developers have full access to assessments" ON assessments
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND role = 'developer'
        )
      );
  END IF;

  -- Questions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'questions' AND policyname = 'Developers have full access to questions'
  ) THEN
    CREATE POLICY "Developers have full access to questions" ON questions
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND role = 'developer'
        )
      );
  END IF;

  -- Student responses
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'student_responses' AND policyname = 'Developers have full access to student responses'
  ) THEN
    CREATE POLICY "Developers have full access to student responses" ON student_responses
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND role = 'developer'
        )
      );
  END IF;

  -- Grades
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'grades' AND policyname = 'Developers have full access to grades'
  ) THEN
    CREATE POLICY "Developers have full access to grades" ON grades
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND role = 'developer'
        )
      );
  END IF;

  -- Payments
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payments' AND policyname = 'Developers have full access to payments'
  ) THEN
    CREATE POLICY "Developers have full access to payments" ON payments
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND role = 'developer'
        )
      );
  END IF;

  -- Announcements
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'announcements' AND policyname = 'Developers have full access to announcements'
  ) THEN
    CREATE POLICY "Developers have full access to announcements" ON announcements
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE id = auth.uid() AND role = 'developer'
        )
      );
  END IF;

  -- QR codes (if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enrollment_qr_codes') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'enrollment_qr_codes' AND policyname = 'Developers have full access to QR codes'
    ) THEN
      CREATE POLICY "Developers have full access to QR codes" ON enrollment_qr_codes
        FOR ALL TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'developer'
          )
        );
    END IF;
  END IF;

  -- QR logs (if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'qr_enrollment_logs') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'qr_enrollment_logs' AND policyname = 'Developers have full access to QR logs'
    ) THEN
      CREATE POLICY "Developers have full access to QR logs" ON qr_enrollment_logs
        FOR ALL TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'developer'
          )
        );
    END IF;
  END IF;

END $$;
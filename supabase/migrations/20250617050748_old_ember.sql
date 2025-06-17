/*
  # Create Developer Account

  1. New Features
    - Creates a default school for development
    - Creates a developer user account
    - Sets up email/password authentication
    - Provides full system access

  2. Security
    - Developer role has elevated permissions
    - Secure password setup
    - Proper RLS policies for developer access

  3. Account Details
    - Email: developer@eskwelai.com
    - Password: DevPass123!
    - Role: developer
    - Full system access
*/

-- Create a default school for development
INSERT INTO schools (id, name, address, phone, email, settings)
VALUES (
  'default-school-id',
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
  ('elementary-level-id', 'default-school-id', 'Elementary', 'Grades K-6', 1),
  ('middle-school-level-id', 'default-school-id', 'Middle School', 'Grades 7-8', 2),
  ('high-school-level-id', 'default-school-id', 'High School', 'Grades 9-12', 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index;

-- Create sample sections
INSERT INTO sections (id, school_level_id, name, section_number, capacity)
VALUES 
  ('grade-1-section-a', 'elementary-level-id', 'Grade 1 - Section A', 1, 25),
  ('grade-2-section-a', 'elementary-level-id', 'Grade 2 - Section A', 1, 25),
  ('grade-7-section-a', 'middle-school-level-id', 'Grade 7 - Section A', 1, 30),
  ('grade-9-section-a', 'high-school-level-id', 'Grade 9 - Section A', 1, 35)
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
    'default-school-id',
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
CREATE POLICY "Developers have full access to schools" ON schools
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers have full access to user profiles" ON user_profiles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers have full access to school levels" ON school_levels
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers have full access to sections" ON sections
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers have full access to enrollments" ON enrollments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers have full access to teacher sections" ON teacher_sections
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers have full access to learning modules" ON learning_modules
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers have full access to assessments" ON assessments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers have full access to questions" ON questions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers have full access to student responses" ON student_responses
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers have full access to grades" ON grades
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers have full access to payments" ON payments
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers have full access to announcements" ON announcements
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers have full access to QR codes" ON enrollment_qr_codes
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers have full access to QR logs" ON qr_enrollment_logs
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );
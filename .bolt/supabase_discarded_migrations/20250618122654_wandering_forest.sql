/*
  # Reset Database - Complete Fresh Start
  
  This migration creates the entire eSkwelAI-LMS database schema from scratch
  with proper UUID handling and clean RLS policies.
  
  1. Custom Types
  2. Core Tables (Schools, Users, etc.)
  3. Academic Tables (Sections, Enrollments, etc.)
  4. Learning Tables (Modules, Assessments, etc.)
  5. QR Enrollment System
  6. Row Level Security Policies
  7. Helper Functions
*/

-- Drop existing policies and tables if they exist
DROP POLICY IF EXISTS "Users can access their own school" ON schools;
DROP POLICY IF EXISTS "Developers have full access to schools" ON schools;
DROP POLICY IF EXISTS "Users can access school levels" ON school_levels;
DROP POLICY IF EXISTS "Developers have full access to school levels" ON school_levels;
DROP POLICY IF EXISTS "Users can access sections" ON sections;
DROP POLICY IF EXISTS "Developers have full access to sections" ON sections;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read school members" ON user_profiles;
DROP POLICY IF EXISTS "Developers have full access to user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Students can see their enrollments" ON enrollments;
DROP POLICY IF EXISTS "Teachers can see their section enrollments" ON enrollments;
DROP POLICY IF EXISTS "Parents can see their children's enrollments" ON enrollments;
DROP POLICY IF EXISTS "Developers have full access to enrollments" ON enrollments;
DROP POLICY IF EXISTS "Teachers can manage their sections" ON teacher_sections;
DROP POLICY IF EXISTS "Developers have full access to teacher sections" ON teacher_sections;
DROP POLICY IF EXISTS "Teachers can manage learning modules" ON learning_modules;
DROP POLICY IF EXISTS "Students can view section modules" ON learning_modules;
DROP POLICY IF EXISTS "Developers have full access to learning modules" ON learning_modules;
DROP POLICY IF EXISTS "Teachers can manage assessments" ON assessments;
DROP POLICY IF EXISTS "Students can view section assessments" ON assessments;
DROP POLICY IF EXISTS "Developers have full access to assessments" ON assessments;
DROP POLICY IF EXISTS "Users can access questions through assessments" ON questions;
DROP POLICY IF EXISTS "Developers have full access to questions" ON questions;
DROP POLICY IF EXISTS "Students can manage their responses" ON student_responses;
DROP POLICY IF EXISTS "Teachers can view student responses" ON student_responses;
DROP POLICY IF EXISTS "Developers have full access to student responses" ON student_responses;
DROP POLICY IF EXISTS "Students can see their grades" ON grades;
DROP POLICY IF EXISTS "Teachers can manage grades" ON grades;
DROP POLICY IF EXISTS "Parents can see their children's grades" ON grades;
DROP POLICY IF EXISTS "Developers have full access to grades" ON grades;
DROP POLICY IF EXISTS "Students can see their payments" ON payments;
DROP POLICY IF EXISTS "Parents can see their children's payments" ON payments;
DROP POLICY IF EXISTS "Accounting can manage payments" ON payments;
DROP POLICY IF EXISTS "Developers have full access to payments" ON payments;
DROP POLICY IF EXISTS "Users can see relevant announcements" ON announcements;
DROP POLICY IF EXISTS "Developers have full access to announcements" ON announcements;
DROP POLICY IF EXISTS "Teachers can manage their QR codes" ON enrollment_qr_codes;
DROP POLICY IF EXISTS "Students can view active QR codes for enrollment" ON enrollment_qr_codes;
DROP POLICY IF EXISTS "Developers have full access to QR codes" ON enrollment_qr_codes;
DROP POLICY IF EXISTS "Students can view their own QR logs" ON qr_enrollment_logs;
DROP POLICY IF EXISTS "Students can create QR enrollment logs" ON qr_enrollment_logs;
DROP POLICY IF EXISTS "Teachers can view their QR logs" ON qr_enrollment_logs;
DROP POLICY IF EXISTS "Developers have full access to QR logs" ON qr_enrollment_logs;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS qr_enrollment_logs CASCADE;
DROP TABLE IF EXISTS enrollment_qr_codes CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS student_responses CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS learning_modules CASCADE;
DROP TABLE IF EXISTS parent_student_relationships CASCADE;
DROP TABLE IF EXISTS teacher_sections CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS sections CASCADE;
DROP TABLE IF EXISTS school_levels CASCADE;
DROP TABLE IF EXISTS schools CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS assessment_type CASCADE;
DROP TYPE IF EXISTS question_type CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS module_type CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS get_default_school_id() CASCADE;
DROP FUNCTION IF EXISTS create_user_profile(uuid, text, user_role, text, text, text, text, uuid) CASCADE;
DROP FUNCTION IF EXISTS generate_qr_code() CASCADE;
DROP FUNCTION IF EXISTS enroll_student_via_qr(text, uuid) CASCADE;

-- Drop view
DROP VIEW IF EXISTS test_accounts CASCADE;

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'parent', 'admin', 'accounting', 'developer');
CREATE TYPE assessment_type AS ENUM ('quiz', 'exam', 'assessment');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'fill_blank', 'enumeration');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
CREATE TYPE module_type AS ENUM ('pdf', 'video');

-- Schools table
CREATE TABLE schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  phone text,
  email text,
  logo_url text,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default school with explicit UUID
INSERT INTO schools (id, name, address, phone, email, settings) 
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Default School',
  'Default Address',
  'Default Phone',
  'default@school.edu',
  '{}'::jsonb
);

-- School levels table
CREATE TABLE school_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Sections table
CREATE TABLE sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_level_id uuid REFERENCES school_levels(id) ON DELETE CASCADE,
  name text NOT NULL,
  section_number integer DEFAULT 1,
  capacity integer DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

-- User profiles table
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  date_of_birth date,
  profile_image_url text,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enrollments table
CREATE TABLE enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  school_year text NOT NULL,
  enrollment_date date DEFAULT CURRENT_DATE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, section_id, school_year)
);

-- Teacher sections table
CREATE TABLE teacher_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  subject text,
  school_year text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, section_id, subject, school_year)
);

-- Parent student relationships table
CREATE TABLE parent_student_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  relationship_type text DEFAULT 'parent',
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

-- Learning modules table
CREATE TABLE learning_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type module_type NOT NULL,
  content_url text NOT NULL,
  file_size bigint,
  duration_minutes integer,
  order_index integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assessments table
CREATE TABLE assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type assessment_type NOT NULL,
  instructions text,
  time_limit_minutes integer,
  total_points integer DEFAULT 0,
  passing_score integer DEFAULT 0,
  is_published boolean DEFAULT false,
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Questions table
CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  type question_type NOT NULL,
  options jsonb DEFAULT '[]',
  correct_answers jsonb NOT NULL,
  points integer DEFAULT 1,
  order_index integer DEFAULT 0,
  explanation text,
  created_at timestamptz DEFAULT now()
);

-- Student responses table
CREATE TABLE student_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  response jsonb NOT NULL,
  is_correct boolean,
  points_earned integer DEFAULT 0,
  submitted_at timestamptz DEFAULT now(),
  UNIQUE(student_id, question_id, assessment_id)
);

-- Grades table
CREATE TABLE grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  total_points integer NOT NULL,
  points_earned integer NOT NULL,
  percentage numeric(5,2) NOT NULL,
  letter_grade text,
  is_passed boolean DEFAULT false,
  submitted_at timestamptz,
  graded_at timestamptz DEFAULT now(),
  graded_by uuid REFERENCES user_profiles(id),
  feedback text,
  UNIQUE(student_id, assessment_id)
);

-- Payments table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  payer_id uuid REFERENCES user_profiles(id),
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  description text NOT NULL,
  payment_type text NOT NULL,
  status payment_status DEFAULT 'pending',
  due_date date,
  paid_date date,
  payment_method text,
  transaction_id text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Announcements table
CREATE TABLE announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  author_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  target_audience text[] DEFAULT '{}',
  section_ids uuid[] DEFAULT '{}',
  attachment_url text,
  attachment_type text,
  is_pinned boolean DEFAULT false,
  is_published boolean DEFAULT true,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enrollment QR codes table
CREATE TABLE enrollment_qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  school_year text NOT NULL,
  qr_code text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  max_uses integer,
  current_uses integer DEFAULT 0,
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- QR enrollment logs table
CREATE TABLE qr_enrollment_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id uuid REFERENCES enrollment_qr_codes(id) ON DELETE CASCADE,
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  enrollment_id uuid REFERENCES enrollments(id) ON DELETE CASCADE,
  scanned_at timestamptz DEFAULT now(),
  success boolean DEFAULT true,
  error_message text,
  ip_address text,
  user_agent text
);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_school_id ON user_profiles(school_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_section_id ON enrollments(section_id);
CREATE INDEX idx_teacher_sections_teacher_id ON teacher_sections(teacher_id);
CREATE INDEX idx_teacher_sections_section_id ON teacher_sections(section_id);
CREATE INDEX idx_assessments_section_id ON assessments(section_id);
CREATE INDEX idx_questions_assessment_id ON questions(assessment_id);
CREATE INDEX idx_student_responses_student_id ON student_responses(student_id);
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_announcements_school_id ON announcements(school_id);
CREATE INDEX idx_enrollment_qr_codes_teacher_id ON enrollment_qr_codes(teacher_id);
CREATE INDEX idx_enrollment_qr_codes_section_id ON enrollment_qr_codes(section_id);
CREATE INDEX idx_enrollment_qr_codes_qr_code ON enrollment_qr_codes(qr_code);
CREATE INDEX idx_qr_enrollment_logs_qr_code_id ON qr_enrollment_logs(qr_code_id);
CREATE INDEX idx_qr_enrollment_logs_student_id ON qr_enrollment_logs(student_id);

-- Enable Row Level Security on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment_qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_enrollment_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION get_default_school_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN '00000000-0000-0000-0000-000000000001'::uuid;
END;
$$;

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
    id, school_id, role, first_name, last_name, email, phone, address
  ) VALUES (
    user_id, final_school_id, user_role, first_name, last_name, user_email, user_phone, user_address
  ) RETURNING id INTO profile_id;

  RETURN profile_id;
END;
$$;

CREATE OR REPLACE FUNCTION generate_qr_code()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN upper(substring(md5(random()::text) from 1 for 12));
END;
$$;

-- Create enrollment function
CREATE OR REPLACE FUNCTION enroll_student_via_qr(
  qr_code_param text,
  student_id_param uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  qr_record enrollment_qr_codes%ROWTYPE;
  enrollment_record enrollments%ROWTYPE;
  log_id uuid;
  enrollment_id uuid;
  current_year text := date_part('year', CURRENT_DATE)::text;
BEGIN
  -- Find the QR code
  SELECT * INTO qr_record
  FROM enrollment_qr_codes
  WHERE qr_code = qr_code_param AND is_active = true;

  IF NOT FOUND THEN
    -- Log failed attempt
    INSERT INTO qr_enrollment_logs (student_id, scanned_at, success, error_message)
    VALUES (student_id_param, now(), false, 'QR code not found or inactive')
    RETURNING id INTO log_id;
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'QR code not found or inactive',
      'log_id', log_id
    );
  END IF;

  -- Check if QR code is expired
  IF qr_record.expires_at IS NOT NULL AND qr_record.expires_at < now() THEN
    INSERT INTO qr_enrollment_logs (qr_code_id, student_id, scanned_at, success, error_message)
    VALUES (qr_record.id, student_id_param, now(), false, 'QR code has expired')
    RETURNING id INTO log_id;
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'QR code has expired',
      'log_id', log_id
    );
  END IF;

  -- Check if max uses reached
  IF qr_record.max_uses IS NOT NULL AND qr_record.current_uses >= qr_record.max_uses THEN
    INSERT INTO qr_enrollment_logs (qr_code_id, student_id, scanned_at, success, error_message)
    VALUES (qr_record.id, student_id_param, now(), false, 'QR code usage limit reached')
    RETURNING id INTO log_id;
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'QR code usage limit reached',
      'log_id', log_id
    );
  END IF;

  -- Check if student is already enrolled
  SELECT * INTO enrollment_record
  FROM enrollments
  WHERE student_id = student_id_param 
    AND section_id = qr_record.section_id 
    AND school_year = current_year;

  IF FOUND THEN
    INSERT INTO qr_enrollment_logs (qr_code_id, student_id, enrollment_id, scanned_at, success, error_message)
    VALUES (qr_record.id, student_id_param, enrollment_record.id, now(), false, 'Student already enrolled in this section')
    RETURNING id INTO log_id;
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'You are already enrolled in this section',
      'log_id', log_id
    );
  END IF;

  -- Create enrollment
  INSERT INTO enrollments (student_id, section_id, school_year)
  VALUES (student_id_param, qr_record.section_id, current_year)
  RETURNING id INTO enrollment_id;

  -- Update QR code usage count
  UPDATE enrollment_qr_codes
  SET current_uses = current_uses + 1
  WHERE id = qr_record.id;

  -- Log successful enrollment
  INSERT INTO qr_enrollment_logs (qr_code_id, student_id, enrollment_id, scanned_at, success)
  VALUES (qr_record.id, student_id_param, enrollment_id, now(), true)
  RETURNING id INTO log_id;

  RETURN jsonb_build_object(
    'success', true,
    'enrollment_id', enrollment_id,
    'section_id', qr_record.section_id,
    'log_id', log_id
  );
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_default_school_id() TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile(uuid, text, user_role, text, text, text, text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_qr_code() TO authenticated;
GRANT EXECUTE ON FUNCTION enroll_student_via_qr(text, uuid) TO authenticated;

-- Create RLS policies (using standard CREATE POLICY syntax)

-- Schools policies
CREATE POLICY "Users can access their own school" ON schools
  FOR ALL TO authenticated
  USING (id IN (SELECT school_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Developers have full access to schools" ON schools
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'developer'));

-- School levels policies
CREATE POLICY "Users can access school levels" ON school_levels
  FOR ALL TO authenticated
  USING (school_id IN (SELECT school_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Developers have full access to school levels" ON school_levels
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'developer'));

-- Sections policies
CREATE POLICY "Users can access sections" ON sections
  FOR ALL TO authenticated
  USING (school_level_id IN (
    SELECT sl.id FROM school_levels sl
    JOIN user_profiles up ON sl.school_id = up.school_id
    WHERE up.id = auth.uid()
  ));

CREATE POLICY "Developers have full access to sections" ON sections
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'developer'));

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read school members" ON user_profiles
  FOR SELECT TO authenticated
  USING (school_id IN (SELECT school_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Developers have full access to user profiles" ON user_profiles
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles user_profiles_1 WHERE user_profiles_1.id = auth.uid() AND user_profiles_1.role = 'developer'));

-- Enrollments policies
CREATE POLICY "Students can see their enrollments" ON enrollments
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can see their section enrollments" ON enrollments
  FOR SELECT TO authenticated
  USING (section_id IN (SELECT section_id FROM teacher_sections WHERE teacher_id = auth.uid()));

CREATE POLICY "Parents can see their children's enrollments" ON enrollments
  FOR SELECT TO authenticated
  USING (student_id IN (SELECT student_id FROM parent_student_relationships WHERE parent_id = auth.uid()));

CREATE POLICY "Developers have full access to enrollments" ON enrollments
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'developer'));

-- Teacher sections policies
CREATE POLICY "Teachers can manage their sections" ON teacher_sections
  FOR ALL TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Developers have full access to teacher sections" ON teacher_sections
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'developer'));

-- Learning modules policies
CREATE POLICY "Teachers can manage learning modules" ON learning_modules
  FOR ALL TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Students can view section modules" ON learning_modules
  FOR SELECT TO authenticated
  USING (section_id IN (SELECT section_id FROM enrollments WHERE student_id = auth.uid() AND is_active = true));

CREATE POLICY "Developers have full access to learning modules" ON learning_modules
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'developer'));

-- Assessments policies
CREATE POLICY "Teachers can manage assessments" ON assessments
  FOR ALL TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Students can view section assessments" ON assessments
  FOR SELECT TO authenticated
  USING (section_id IN (SELECT section_id FROM enrollments WHERE student_id = auth.uid() AND is_active = true));

CREATE POLICY "Developers have full access to assessments" ON assessments
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'developer'));

-- Questions policies
CREATE POLICY "Users can access questions through assessments" ON questions
  FOR SELECT TO authenticated
  USING (assessment_id IN (
    SELECT id FROM assessments WHERE 
    teacher_id = auth.uid() OR 
    section_id IN (SELECT section_id FROM enrollments WHERE student_id = auth.uid() AND is_active = true)
  ));

CREATE POLICY "Developers have full access to questions" ON questions
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'developer'));

-- Student responses policies
CREATE POLICY "Students can manage their responses" ON student_responses
  FOR ALL TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view student responses" ON student_responses
  FOR SELECT TO authenticated
  USING (assessment_id IN (SELECT id FROM assessments WHERE teacher_id = auth.uid()));

CREATE POLICY "Developers have full access to student responses" ON student_responses
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'developer'));

-- Grades policies
CREATE POLICY "Students can see their grades" ON grades
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can manage grades" ON grades
  FOR ALL TO authenticated
  USING (assessment_id IN (SELECT id FROM assessments WHERE teacher_id = auth.uid()));

CREATE POLICY "Parents can see their children's grades" ON grades
  FOR SELECT TO authenticated
  USING (student_id IN (SELECT student_id FROM parent_student_relationships WHERE parent_id = auth.uid()));

CREATE POLICY "Developers have full access to grades" ON grades
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'developer'));

-- Payments policies
CREATE POLICY "Students can see their payments" ON payments
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Parents can see their children's payments" ON payments
  FOR SELECT TO authenticated
  USING (student_id IN (SELECT student_id FROM parent_student_relationships WHERE parent_id = auth.uid()) OR payer_id = auth.uid());

CREATE POLICY "Accounting can manage payments" ON payments
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role::text = ANY(ARRAY['accounting', 'admin'])));

CREATE POLICY "Developers have full access to payments" ON payments
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'developer'));

-- Announcements policies
CREATE POLICY "Users can see relevant announcements" ON announcements
  FOR SELECT TO authenticated
  USING (
    school_id IN (SELECT school_id FROM user_profiles WHERE id = auth.uid()) AND
    (
      target_audience = '{}' OR
      (SELECT role::text FROM user_profiles WHERE id = auth.uid()) = ANY(target_audience) OR
      section_ids && (
        SELECT array_agg(section_id) FROM enrollments WHERE student_id = auth.uid()
        UNION
        SELECT array_agg(section_id) FROM teacher_sections WHERE teacher_id = auth.uid()
      )
    )
  );

CREATE POLICY "Developers have full access to announcements" ON announcements
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'developer'));

-- QR codes policies
CREATE POLICY "Teachers can manage their QR codes" ON enrollment_qr_codes
  FOR ALL TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Students can view active QR codes for enrollment" ON enrollment_qr_codes
  FOR SELECT TO authenticated
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()) AND (max_uses IS NULL OR current_uses < max_uses));

CREATE POLICY "Developers have full access to QR codes" ON enrollment_qr_codes
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'developer'));

-- QR logs policies
CREATE POLICY "Students can view their own QR logs" ON qr_enrollment_logs
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can create QR enrollment logs" ON qr_enrollment_logs
  FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can view their QR logs" ON qr_enrollment_logs
  FOR SELECT TO authenticated
  USING (qr_code_id IN (SELECT id FROM enrollment_qr_codes WHERE teacher_id = auth.uid()));

CREATE POLICY "Developers have full access to QR logs" ON qr_enrollment_logs
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'developer'));

-- Create a view for test accounts (helpful for development)
CREATE VIEW test_accounts AS
SELECT 
  id,
  role,
  first_name,
  last_name,
  email,
  phone,
  is_active,
  created_at,
  CASE 
    WHEN role = 'developer' THEN 'dev123'
    WHEN role = 'teacher' THEN 'teach123'
    WHEN role = 'student' THEN 'student123'
    WHEN role = 'parent' THEN 'parent123'
    WHEN role = 'admin' THEN 'admin123'
    WHEN role = 'accounting' THEN 'account123'
    ELSE 'password123'
  END as suggested_password,
  metadata
FROM user_profiles
WHERE email LIKE '%@test.com' OR email LIKE '%@example.com'
ORDER BY created_at DESC;
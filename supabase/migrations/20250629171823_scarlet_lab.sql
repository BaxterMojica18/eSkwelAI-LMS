/*
  # Create eSkwelAI-LMS Database Schema

  1. New Tables
    - `schools` - School information and configuration
    - `user_profiles` - User profiles linked to auth.users
    - `school_levels` - Grade levels within schools
    - `sections` - Classes/sections within grade levels
    - `teacher_sections` - Teacher assignments to sections
    - `enrollments` - Student enrollments in sections
    - `learning_modules` - Learning content for sections
    - `assessments` - Quizzes, exams, and assignments
    - `questions` - Questions within assessments
    - `grades` - Student grades and feedback
    - `payments` - Student fee payments and tracking
    - `announcements` - School announcements
    - `enrollment_qr_codes` - QR codes for class enrollment
    - `qr_enrollment_logs` - Logs of QR code usage

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure functions for QR enrollment

  3. Functions
    - `enroll_student_via_qr` - Handle QR code enrollment process
*/

-- Schools Table
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  phone text,
  email text,
  website text,
  principal_name text,
  principal_email text,
  logo_url text,
  plan text NOT NULL CHECK (plan IN ('small', 'medium', 'large')),
  student_count text,
  teacher_count text,
  school_code text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('developer', 'admin', 'teacher', 'student', 'parent', 'accounting')),
  school_id uuid REFERENCES schools(id),
  phone text,
  date_of_birth date,
  address text,
  profile_image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- School Levels Table (Grades)
CREATE TABLE IF NOT EXISTS school_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(school_id, name)
);

-- Sections Table (Classes)
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id),
  school_level_id uuid REFERENCES school_levels(id),
  name text NOT NULL,
  description text,
  room text,
  schedule text,
  max_students integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(school_id, school_level_id, name)
);

-- Teacher Sections Table (Teacher-Class Assignments)
CREATE TABLE IF NOT EXISTS teacher_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES user_profiles(id),
  section_id uuid NOT NULL REFERENCES sections(id),
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, section_id)
);

-- Enrollments Table (Student-Class Enrollments)
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES user_profiles(id),
  section_id uuid NOT NULL REFERENCES sections(id),
  school_year text,
  enrollment_date date DEFAULT CURRENT_DATE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, section_id, school_year)
);

-- Learning Modules Table
CREATE TABLE IF NOT EXISTS learning_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES sections(id),
  title text NOT NULL,
  description text,
  content_url text,
  is_published boolean DEFAULT false,
  publish_date timestamptz,
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assessments Table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES sections(id),
  title text NOT NULL,
  description text,
  assessment_type text NOT NULL CHECK (assessment_type IN ('quiz', 'exam', 'assignment')),
  total_points integer NOT NULL,
  passing_score integer,
  time_limit_minutes integer,
  start_date timestamptz,
  due_date timestamptz,
  is_published boolean DEFAULT false,
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(id),
  question_text text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'essay', 'matching', 'fill_blank')),
  options jsonb,
  correct_answer text,
  points integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Grades Table
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES user_profiles(id),
  assessment_id uuid NOT NULL REFERENCES assessments(id),
  score numeric NOT NULL,
  feedback text,
  submitted_at timestamptz,
  graded_at timestamptz,
  graded_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, assessment_id)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id),
  student_id uuid NOT NULL REFERENCES user_profiles(id),
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  description text NOT NULL,
  payment_type text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  due_date date,
  paid_date date,
  payment_method text,
  transaction_id text,
  receipt_number text,
  notes text,
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category IN ('academic', 'event', 'urgent', 'general')),
  is_pinned boolean DEFAULT false,
  target_audience text[] DEFAULT '{all}',
  attachments jsonb,
  published_at timestamptz,
  expires_at timestamptz,
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enrollment QR Codes Table
CREATE TABLE IF NOT EXISTS enrollment_qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES sections(id),
  qr_code text NOT NULL UNIQUE,
  description text,
  max_uses integer,
  used_count integer DEFAULT 0,
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- QR Enrollment Logs Table
CREATE TABLE IF NOT EXISTS qr_enrollment_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id uuid REFERENCES enrollment_qr_codes(id),
  student_id uuid REFERENCES user_profiles(id),
  enrollment_id uuid REFERENCES enrollments(id),
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment_qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_enrollment_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Schools policies
CREATE POLICY "Public schools are viewable by everyone" ON schools
  FOR SELECT USING (true);

CREATE POLICY "Schools can be created by authenticated users" ON schools
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Schools can be updated by admins" ON schools
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE (role = 'admin' OR role = 'developer') 
      AND school_id = schools.id
    )
  );

-- User profiles policies
CREATE POLICY "User profiles are viewable by users in the same school" ON user_profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    (SELECT school_id FROM user_profiles WHERE id = auth.uid()) = school_id
  );

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- School levels policies
CREATE POLICY "School levels are viewable by school members" ON school_levels
  FOR SELECT USING (
    school_id IN (
      SELECT school_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "School levels can be managed by admins" ON school_levels
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE (role = 'admin' OR role = 'developer') 
      AND school_id = school_levels.school_id
    )
  );

-- Sections policies
CREATE POLICY "Sections are viewable by school members" ON sections
  FOR SELECT USING (
    school_id IN (
      SELECT school_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Sections can be managed by teachers and admins" ON sections
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE (role IN ('admin', 'developer', 'teacher')) 
      AND school_id = sections.school_id
    )
  );

-- Teacher sections policies
CREATE POLICY "Teacher sections are viewable by school members" ON teacher_sections
  FOR SELECT USING (
    teacher_id IN (
      SELECT id FROM user_profiles 
      WHERE school_id IN (
        SELECT school_id FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Teacher sections can be managed by admins and the teacher" ON teacher_sections
  FOR ALL USING (
    auth.uid() = teacher_id OR
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role IN ('admin', 'developer')
      AND school_id IN (
        SELECT school_id FROM user_profiles WHERE id = teacher_id
      )
    )
  );

-- Enrollments policies
CREATE POLICY "Enrollments are viewable by school members" ON enrollments
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM user_profiles 
      WHERE school_id IN (
        SELECT school_id FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Students can manage their own enrollments" ON enrollments
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Teachers and admins can manage enrollments" ON enrollments
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role IN ('admin', 'developer', 'teacher', 'accounting')
      AND school_id IN (
        SELECT school_id FROM user_profiles WHERE id = student_id
      )
    )
  );

-- Learning modules policies
CREATE POLICY "Learning modules are viewable by enrolled students and teachers" ON learning_modules
  FOR SELECT USING (
    section_id IN (
      SELECT section_id FROM enrollments WHERE student_id = auth.uid()
      UNION
      SELECT section_id FROM teacher_sections WHERE teacher_id = auth.uid()
    ) OR
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'developer')
    )
  );

CREATE POLICY "Learning modules can be managed by teachers and admins" ON learning_modules
  FOR ALL USING (
    section_id IN (
      SELECT section_id FROM teacher_sections WHERE teacher_id = auth.uid()
    ) OR
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'developer')
    )
  );

-- Assessments policies
CREATE POLICY "Assessments are viewable by enrolled students and teachers" ON assessments
  FOR SELECT USING (
    section_id IN (
      SELECT section_id FROM enrollments WHERE student_id = auth.uid()
      UNION
      SELECT section_id FROM teacher_sections WHERE teacher_id = auth.uid()
    ) OR
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'developer')
    )
  );

CREATE POLICY "Assessments can be managed by teachers and admins" ON assessments
  FOR ALL USING (
    section_id IN (
      SELECT section_id FROM teacher_sections WHERE teacher_id = auth.uid()
    ) OR
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'developer')
    )
  );

-- Questions policies
CREATE POLICY "Questions are viewable by teachers and admins" ON questions
  FOR SELECT USING (
    assessment_id IN (
      SELECT a.id FROM assessments a
      JOIN teacher_sections ts ON a.section_id = ts.section_id
      WHERE ts.teacher_id = auth.uid()
    ) OR
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'developer')
    )
  );

CREATE POLICY "Questions can be managed by teachers and admins" ON questions
  FOR ALL USING (
    assessment_id IN (
      SELECT a.id FROM assessments a
      JOIN teacher_sections ts ON a.section_id = ts.section_id
      WHERE ts.teacher_id = auth.uid()
    ) OR
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'developer')
    )
  );

-- Grades policies
CREATE POLICY "Students can view their own grades" ON grades
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view and manage grades for their students" ON grades
  FOR ALL USING (
    assessment_id IN (
      SELECT a.id FROM assessments a
      JOIN teacher_sections ts ON a.section_id = ts.section_id
      WHERE ts.teacher_id = auth.uid()
    ) OR
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'developer')
    )
  );

-- Payments policies
CREATE POLICY "Students and parents can view related payments" ON payments
  FOR SELECT USING (
    auth.uid() = student_id OR
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role = 'parent'
      AND school_id IN (
        SELECT school_id FROM user_profiles WHERE id = student_id
      )
    ) OR
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'developer', 'accounting')
      AND school_id = payments.school_id
    )
  );

CREATE POLICY "Accounting and admins can manage payments" ON payments
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role IN ('admin', 'developer', 'accounting')
      AND school_id = payments.school_id
    )
  );

-- Announcements policies
CREATE POLICY "Announcements are viewable by school members" ON announcements
  FOR SELECT USING (
    school_id IN (
      SELECT school_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Announcements can be managed by admins" ON announcements
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role IN ('admin', 'developer')
      AND school_id = announcements.school_id
    )
  );

-- QR codes policies
CREATE POLICY "QR codes are viewable by teachers and admins" ON enrollment_qr_codes
  FOR SELECT USING (
    section_id IN (
      SELECT section_id FROM teacher_sections WHERE teacher_id = auth.uid()
    ) OR
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'developer')
    )
  );

CREATE POLICY "QR codes can be managed by teachers and admins" ON enrollment_qr_codes
  FOR ALL USING (
    section_id IN (
      SELECT section_id FROM teacher_sections WHERE teacher_id = auth.uid()
    ) OR
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'developer')
    )
  );

-- QR logs policies
CREATE POLICY "QR logs are viewable by admins and teachers" ON qr_enrollment_logs
  FOR SELECT USING (
    qr_code_id IN (
      SELECT id FROM enrollment_qr_codes
      WHERE section_id IN (
        SELECT section_id FROM teacher_sections WHERE teacher_id = auth.uid()
      )
    ) OR
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'developer')
    )
  );

CREATE POLICY "QR logs can be inserted by students" ON qr_enrollment_logs
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Create function for QR code enrollment
CREATE OR REPLACE FUNCTION enroll_student_via_qr(
  qr_code_param TEXT,
  student_id_param UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  qr_code_record enrollment_qr_codes;
  section_record sections;
  enrollment_id UUID;
  log_id UUID;
  result JSONB;
BEGIN
  -- Find the QR code
  SELECT * INTO qr_code_record
  FROM enrollment_qr_codes
  WHERE qr_code = qr_code_param
  AND is_active = true
  AND (expires_at IS NULL OR expires_at > now());
  
  IF qr_code_record IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired QR code'
    );
  END IF;
  
  -- Check if max uses is reached
  IF qr_code_record.max_uses IS NOT NULL AND qr_code_record.used_count >= qr_code_record.max_uses THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'QR code has reached maximum usage limit'
    );
  END IF;
  
  -- Get section info
  SELECT * INTO section_record
  FROM sections
  WHERE id = qr_code_record.section_id;
  
  IF section_record IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Section not found'
    );
  END IF;
  
  -- Check if student is already enrolled
  IF EXISTS (
    SELECT 1 FROM enrollments
    WHERE student_id = student_id_param
    AND section_id = qr_code_record.section_id
    AND is_active = true
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Student is already enrolled in this section'
    );
  END IF;
  
  -- Create enrollment
  INSERT INTO enrollments (
    student_id,
    section_id,
    school_year,
    enrollment_date,
    is_active
  ) VALUES (
    student_id_param,
    qr_code_record.section_id,
    EXTRACT(YEAR FROM CURRENT_DATE)::text,
    CURRENT_DATE,
    true
  )
  RETURNING id INTO enrollment_id;
  
  -- Update QR code used count
  UPDATE enrollment_qr_codes
  SET used_count = used_count + 1
  WHERE id = qr_code_record.id;
  
  -- Log the enrollment
  INSERT INTO qr_enrollment_logs (
    qr_code_id,
    student_id,
    enrollment_id
  ) VALUES (
    qr_code_record.id,
    student_id_param,
    enrollment_id
  )
  RETURNING id INTO log_id;
  
  -- Return success
  RETURN jsonb_build_object(
    'success', true,
    'section_id', qr_code_record.section_id,
    'enrollment_id', enrollment_id,
    'log_id', log_id
  );
END;
$$;

-- Insert demo data
INSERT INTO schools (name, address, phone, email, website, principal_name, principal_email, plan, school_code)
VALUES (
  'Demo Elementary School',
  '123 Education Street, Learning City, LC 12345',
  '+1 (555) 123-4567',
  'admin@demoschool.edu',
  'https://www.demoschool.edu',
  'Dr. Jane Smith',
  'principal@demoschool.edu',
  'medium',
  'DEM1234'
) ON CONFLICT (school_code) DO NOTHING;

-- Insert demo school levels
INSERT INTO school_levels (school_id, name, description)
SELECT 
  s.id,
  level_name,
  level_description
FROM schools s,
(VALUES 
  ('Kindergarten', 'Kindergarten level'),
  ('Grade 1', 'First grade level'),
  ('Grade 2', 'Second grade level'),
  ('Grade 3', 'Third grade level'),
  ('Grade 4', 'Fourth grade level'),
  ('Grade 5', 'Fifth grade level')
) AS levels(level_name, level_description)
WHERE s.school_code = 'DEM1234'
ON CONFLICT (school_id, name) DO NOTHING;
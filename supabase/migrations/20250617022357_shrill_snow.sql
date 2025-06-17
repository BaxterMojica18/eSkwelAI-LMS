/*
  # Complete School Management System Database Schema

  1. New Tables
    - `schools` - School information and settings
    - `school_levels` - Elementary, High School, Senior High School
    - `sections` - Class sections within each level
    - `users` - All system users (students, teachers, parents, staff)
    - `user_profiles` - Extended user information
    - `enrollments` - Student-section relationships
    - `learning_modules` - Educational content (PDFs, videos)
    - `assessments` - Quizzes, exams, assessments
    - `questions` - Individual questions within assessments
    - `student_responses` - Student answers to questions
    - `grades` - Student grades and scores
    - `payments` - Financial transactions
    - `announcements` - School-wide communications
    - `parent_student_relationships` - Parent-child connections
    - `teacher_sections` - Teacher-section assignments

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure data based on school membership and user roles

  3. Features
    - Multi-school support
    - Role-based permissions
    - Comprehensive academic tracking
    - Financial management
    - Communication system
*/

-- Create custom types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'teacher', 'parent', 'admin', 'accounting', 'developer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE assessment_type AS ENUM ('quiz', 'exam', 'assessment');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE question_type AS ENUM ('multiple_choice', 'fill_blank', 'enumeration');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE module_type AS ENUM ('pdf', 'video');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
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

-- School levels (Elementary, High School, etc.)
CREATE TABLE IF NOT EXISTS school_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Sections within each level
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_level_id uuid REFERENCES school_levels(id) ON DELETE CASCADE,
  name text NOT NULL,
  section_number integer DEFAULT 1,
  capacity integer DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
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

-- Student enrollments in sections
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  school_year text NOT NULL,
  enrollment_date date DEFAULT CURRENT_DATE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, section_id, school_year)
);

-- Teacher-section assignments
CREATE TABLE IF NOT EXISTS teacher_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  subject text,
  school_year text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, section_id, subject, school_year)
);

-- Parent-student relationships
CREATE TABLE IF NOT EXISTS parent_student_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  relationship_type text DEFAULT 'parent',
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

-- Learning modules
CREATE TABLE IF NOT EXISTS learning_modules (
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

-- Assessments (quizzes, exams, assessments)
CREATE TABLE IF NOT EXISTS assessments (
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

-- Questions within assessments
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  type question_type NOT NULL,
  options jsonb DEFAULT '[]', -- For multiple choice options
  correct_answers jsonb NOT NULL, -- Array of correct answers
  points integer DEFAULT 1,
  order_index integer DEFAULT 0,
  explanation text,
  created_at timestamptz DEFAULT now()
);

-- Student responses to questions
CREATE TABLE IF NOT EXISTS student_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  response jsonb NOT NULL, -- Student's answer(s)
  is_correct boolean,
  points_earned integer DEFAULT 0,
  submitted_at timestamptz DEFAULT now(),
  UNIQUE(student_id, question_id, assessment_id)
);

-- Grades and scores
CREATE TABLE IF NOT EXISTS grades (
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

-- Payment records
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  payer_id uuid REFERENCES user_profiles(id), -- Usually parent
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  description text NOT NULL,
  payment_type text NOT NULL, -- tuition, fees, books, etc.
  status payment_status DEFAULT 'pending',
  due_date date,
  paid_date date,
  payment_method text,
  transaction_id text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- School announcements and communications
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  author_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  target_audience text[] DEFAULT '{}', -- roles that can see this
  section_ids uuid[] DEFAULT '{}', -- specific sections if applicable
  attachment_url text,
  attachment_type text,
  is_pinned boolean DEFAULT false,
  is_published boolean DEFAULT true,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
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

-- RLS Policies

-- Schools: Users can only access their own school
CREATE POLICY "Users can access their own school" ON schools
  FOR ALL TO authenticated
  USING (id IN (SELECT school_id FROM user_profiles WHERE id = auth.uid()));

-- User profiles: Users can read their own profile and school members
CREATE POLICY "Users can read school members" ON user_profiles
  FOR SELECT TO authenticated
  USING (school_id IN (SELECT school_id FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- School levels: Users can access levels in their school
CREATE POLICY "Users can access school levels" ON school_levels
  FOR ALL TO authenticated
  USING (school_id IN (SELECT school_id FROM user_profiles WHERE id = auth.uid()));

-- Sections: Users can access sections in their school
CREATE POLICY "Users can access sections" ON sections
  FOR ALL TO authenticated
  USING (school_level_id IN (
    SELECT sl.id FROM school_levels sl
    JOIN user_profiles up ON sl.school_id = up.school_id
    WHERE up.id = auth.uid()
  ));

-- Enrollments: Students see their own, teachers see their sections, parents see their children
CREATE POLICY "Students can see their enrollments" ON enrollments
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can see their section enrollments" ON enrollments
  FOR SELECT TO authenticated
  USING (section_id IN (
    SELECT section_id FROM teacher_sections WHERE teacher_id = auth.uid()
  ));

CREATE POLICY "Parents can see their children's enrollments" ON enrollments
  FOR SELECT TO authenticated
  USING (student_id IN (
    SELECT student_id FROM parent_student_relationships WHERE parent_id = auth.uid()
  ));

-- Teacher sections: Teachers can manage their assignments
CREATE POLICY "Teachers can manage their sections" ON teacher_sections
  FOR ALL TO authenticated
  USING (teacher_id = auth.uid());

-- Learning modules: Teachers can manage, students can view their section modules
CREATE POLICY "Teachers can manage learning modules" ON learning_modules
  FOR ALL TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Students can view section modules" ON learning_modules
  FOR SELECT TO authenticated
  USING (section_id IN (
    SELECT section_id FROM enrollments WHERE student_id = auth.uid() AND is_active = true
  ));

-- Assessments: Teachers can manage, students can view their section assessments
CREATE POLICY "Teachers can manage assessments" ON assessments
  FOR ALL TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Students can view section assessments" ON assessments
  FOR SELECT TO authenticated
  USING (section_id IN (
    SELECT section_id FROM enrollments WHERE student_id = auth.uid() AND is_active = true
  ));

-- Questions: Linked to assessment permissions
CREATE POLICY "Users can access questions through assessments" ON questions
  FOR SELECT TO authenticated
  USING (assessment_id IN (
    SELECT id FROM assessments WHERE 
    teacher_id = auth.uid() OR 
    section_id IN (
      SELECT section_id FROM enrollments WHERE student_id = auth.uid() AND is_active = true
    )
  ));

-- Student responses: Students can manage their own responses
CREATE POLICY "Students can manage their responses" ON student_responses
  FOR ALL TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view student responses" ON student_responses
  FOR SELECT TO authenticated
  USING (assessment_id IN (
    SELECT id FROM assessments WHERE teacher_id = auth.uid()
  ));

-- Grades: Students see their own, teachers see their students, parents see their children
CREATE POLICY "Students can see their grades" ON grades
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can manage grades" ON grades
  FOR ALL TO authenticated
  USING (assessment_id IN (
    SELECT id FROM assessments WHERE teacher_id = auth.uid()
  ));

CREATE POLICY "Parents can see their children's grades" ON grades
  FOR SELECT TO authenticated
  USING (student_id IN (
    SELECT student_id FROM parent_student_relationships WHERE parent_id = auth.uid()
  ));

-- Payments: Students and parents can see relevant payments, accounting can manage all
CREATE POLICY "Students can see their payments" ON payments
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Parents can see their children's payments" ON payments
  FOR SELECT TO authenticated
  USING (student_id IN (
    SELECT student_id FROM parent_student_relationships WHERE parent_id = auth.uid()
  ) OR payer_id = auth.uid());

CREATE POLICY "Accounting can manage payments" ON payments
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role::text IN ('accounting', 'admin')
  ));

-- Announcements: Users can see announcements for their role/sections
CREATE POLICY "Users can see relevant announcements" ON announcements
  FOR SELECT TO authenticated
  USING (
    school_id IN (SELECT school_id FROM user_profiles WHERE id = auth.uid()) AND
    (
      target_audience = '{}' OR 
      (SELECT role::text FROM user_profiles WHERE id = auth.uid()) = ANY(target_audience) OR
      section_ids && (
        SELECT ARRAY_AGG(section_id) FROM enrollments WHERE student_id = auth.uid()
        UNION
        SELECT ARRAY_AGG(section_id) FROM teacher_sections WHERE teacher_id = auth.uid()
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_school_id ON user_profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_section_id ON enrollments(section_id);
CREATE INDEX IF NOT EXISTS idx_teacher_sections_teacher_id ON teacher_sections(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_sections_section_id ON teacher_sections(section_id);
CREATE INDEX IF NOT EXISTS idx_assessments_section_id ON assessments(section_id);
CREATE INDEX IF NOT EXISTS idx_questions_assessment_id ON questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_student_responses_student_id ON student_responses(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_announcements_school_id ON announcements(school_id);
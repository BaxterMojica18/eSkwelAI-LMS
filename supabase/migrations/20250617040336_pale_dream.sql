/*
  # QR Code Enrollment System

  1. New Tables
    - `enrollment_qr_codes` - QR codes for class enrollment
    - `qr_enrollment_logs` - Track QR code usage and enrollments

  2. Security
    - Enable RLS on new tables
    - Add policies for teachers and students

  3. Features
    - QR code generation with expiration
    - Usage tracking and limits
    - Automatic enrollment via QR scan
*/

-- QR codes for class enrollment
CREATE TABLE IF NOT EXISTS enrollment_qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  school_year text NOT NULL,
  qr_code text UNIQUE NOT NULL, -- Unique QR code identifier
  title text NOT NULL,
  description text,
  max_uses integer, -- NULL for unlimited
  current_uses integer DEFAULT 0,
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- QR enrollment activity logs
CREATE TABLE IF NOT EXISTS qr_enrollment_logs (
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

-- Enable RLS
ALTER TABLE enrollment_qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_enrollment_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for QR codes
CREATE POLICY "Teachers can manage their QR codes" ON enrollment_qr_codes
  FOR ALL TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Students can view active QR codes for enrollment" ON enrollment_qr_codes
  FOR SELECT TO authenticated
  USING (
    is_active = true AND 
    (expires_at IS NULL OR expires_at > now()) AND
    (max_uses IS NULL OR current_uses < max_uses)
  );

-- RLS Policies for QR logs
CREATE POLICY "Teachers can view their QR logs" ON qr_enrollment_logs
  FOR SELECT TO authenticated
  USING (qr_code_id IN (
    SELECT id FROM enrollment_qr_codes WHERE teacher_id = auth.uid()
  ));

CREATE POLICY "Students can view their own QR logs" ON qr_enrollment_logs
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can create QR enrollment logs" ON qr_enrollment_logs
  FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_enrollment_qr_codes_teacher_id ON enrollment_qr_codes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_qr_codes_section_id ON enrollment_qr_codes(section_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_qr_codes_qr_code ON enrollment_qr_codes(qr_code);
CREATE INDEX IF NOT EXISTS idx_qr_enrollment_logs_qr_code_id ON qr_enrollment_logs(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_qr_enrollment_logs_student_id ON qr_enrollment_logs(student_id);

-- Function to generate unique QR code
CREATE OR REPLACE FUNCTION generate_qr_code()
RETURNS text AS $$
BEGIN
  RETURN 'QR_' || upper(substring(gen_random_uuid()::text from 1 for 8)) || '_' || extract(epoch from now())::bigint;
END;
$$ LANGUAGE plpgsql;

-- Function to enroll student via QR code
CREATE OR REPLACE FUNCTION enroll_student_via_qr(
  qr_code_param text,
  student_id_param uuid
)
RETURNS jsonb AS $$
DECLARE
  qr_record enrollment_qr_codes%ROWTYPE;
  enrollment_record enrollments%ROWTYPE;
  log_id uuid;
BEGIN
  -- Get QR code record
  SELECT * INTO qr_record
  FROM enrollment_qr_codes
  WHERE qr_code = qr_code_param
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND (max_uses IS NULL OR current_uses < max_uses);

  -- Check if QR code exists and is valid
  IF NOT FOUND THEN
    -- Log failed attempt
    INSERT INTO qr_enrollment_logs (qr_code_id, student_id, success, error_message)
    VALUES (NULL, student_id_param, false, 'Invalid or expired QR code')
    RETURNING id INTO log_id;
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired QR code',
      'log_id', log_id
    );
  END IF;

  -- Check if student is already enrolled
  SELECT * INTO enrollment_record
  FROM enrollments
  WHERE student_id = student_id_param
    AND section_id = qr_record.section_id
    AND school_year = qr_record.school_year;

  IF FOUND THEN
    -- Log failed attempt
    INSERT INTO qr_enrollment_logs (qr_code_id, student_id, success, error_message)
    VALUES (qr_record.id, student_id_param, false, 'Student already enrolled')
    RETURNING id INTO log_id;
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Student already enrolled in this section',
      'log_id', log_id
    );
  END IF;

  -- Create enrollment
  INSERT INTO enrollments (student_id, section_id, school_year)
  VALUES (student_id_param, qr_record.section_id, qr_record.school_year)
  RETURNING * INTO enrollment_record;

  -- Update QR code usage count
  UPDATE enrollment_qr_codes
  SET current_uses = current_uses + 1,
      updated_at = now()
  WHERE id = qr_record.id;

  -- Log successful enrollment
  INSERT INTO qr_enrollment_logs (qr_code_id, student_id, enrollment_id, success)
  VALUES (qr_record.id, student_id_param, enrollment_record.id, true)
  RETURNING id INTO log_id;

  RETURN jsonb_build_object(
    'success', true,
    'enrollment_id', enrollment_record.id,
    'section_id', qr_record.section_id,
    'log_id', log_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
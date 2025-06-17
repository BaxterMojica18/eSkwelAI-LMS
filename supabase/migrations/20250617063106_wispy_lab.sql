/*
  # Create Test User Profiles and Sample Data

  1. Test User Profiles
    - Creates 5 test user profiles for different roles
    - Uses predefined UUIDs for consistency
    - Includes realistic sample data

  2. Sample Relationships
    - Parent-student relationship
    - Teacher-section assignment
    - Student enrollment

  3. Sample Data
    - Payment records
    - Announcements
    - Complete profiles with metadata

  Note: The actual auth users need to be created through Supabase Auth API.
  These profiles will be linked when users sign up with the corresponding emails.
*/

-- Create test user profiles with predefined UUIDs
-- These will be linked to auth users when they sign up

-- 1. Developer Profile
INSERT INTO user_profiles (
  id,
  school_id,
  role,
  first_name,
  last_name,
  email,
  phone,
  address,
  date_of_birth,
  is_active,
  metadata
) VALUES (
  '10000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'developer',
  'Alex',
  'Developer',
  'developer@eskwelai.com',
  '+1 (555) 100-0001',
  '123 Tech Street, Silicon Valley, CA 94000',
  '1990-01-15'::date,
  true,
  '{
    "created_by": "system",
    "account_type": "test",
    "access_level": "full",
    "permissions": ["all"],
    "notes": "Primary developer account with full system access"
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  school_id = EXCLUDED.school_id,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  date_of_birth = EXCLUDED.date_of_birth,
  is_active = EXCLUDED.is_active,
  metadata = EXCLUDED.metadata,
  updated_at = now();

-- 2. Teacher Profile
INSERT INTO user_profiles (
  id,
  school_id,
  role,
  first_name,
  last_name,
  email,
  phone,
  address,
  date_of_birth,
  is_active,
  metadata
) VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'teacher',
  'Sarah',
  'Johnson',
  'teacher@eskwelai.com',
  '+1 (555) 100-0002',
  '456 Education Ave, Learning City, LC 12345',
  '1985-03-22'::date,
  true,
  '{
    "created_by": "system",
    "account_type": "test",
    "subjects": ["Mathematics", "Science"],
    "experience_years": 8,
    "certifications": ["Elementary Education", "Mathematics Specialist"]
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  school_id = EXCLUDED.school_id,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  date_of_birth = EXCLUDED.date_of_birth,
  is_active = EXCLUDED.is_active,
  metadata = EXCLUDED.metadata,
  updated_at = now();

-- 3. Student Profile
INSERT INTO user_profiles (
  id,
  school_id,
  role,
  first_name,
  last_name,
  email,
  phone,
  address,
  date_of_birth,
  is_active,
  metadata
) VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'student',
  'Emma',
  'Wilson',
  'student@eskwelai.com',
  '+1 (555) 100-0003',
  '789 Student Lane, Learning City, LC 12345',
  '2017-09-10'::date,
  true,
  '{
    "created_by": "system",
    "account_type": "test",
    "grade_level": "1st Grade",
    "student_id": "STU2024001",
    "emergency_contact": "Michael Wilson",
    "allergies": [],
    "special_needs": false
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  school_id = EXCLUDED.school_id,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  date_of_birth = EXCLUDED.date_of_birth,
  is_active = EXCLUDED.is_active,
  metadata = EXCLUDED.metadata,
  updated_at = now();

-- 4. Parent Profile
INSERT INTO user_profiles (
  id,
  school_id,
  role,
  first_name,
  last_name,
  email,
  phone,
  address,
  date_of_birth,
  is_active,
  metadata
) VALUES (
  '10000000-0000-0000-0000-000000000004'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'parent',
  'Michael',
  'Wilson',
  'parent@eskwelai.com',
  '+1 (555) 100-0004',
  '789 Student Lane, Learning City, LC 12345',
  '1982-07-18'::date,
  true,
  '{
    "created_by": "system",
    "account_type": "test",
    "occupation": "Software Engineer",
    "employer": "Tech Solutions Inc.",
    "preferred_contact": "email",
    "emergency_contact": true
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  school_id = EXCLUDED.school_id,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  date_of_birth = EXCLUDED.date_of_birth,
  is_active = EXCLUDED.is_active,
  metadata = EXCLUDED.metadata,
  updated_at = now();

-- 5. Accounting Profile
INSERT INTO user_profiles (
  id,
  school_id,
  role,
  first_name,
  last_name,
  email,
  phone,
  address,
  date_of_birth,
  is_active,
  metadata
) VALUES (
  '10000000-0000-0000-0000-000000000005'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'accounting',
  'Jennifer',
  'Martinez',
  'accounting@eskwelai.com',
  '+1 (555) 100-0005',
  '321 Finance Blvd, Learning City, LC 12345',
  '1988-11-05'::date,
  true,
  '{
    "created_by": "system",
    "account_type": "test",
    "department": "Finance",
    "certifications": ["CPA", "QuickBooks Certified"],
    "access_level": "financial_management"
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  school_id = EXCLUDED.school_id,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  date_of_birth = EXCLUDED.date_of_birth,
  is_active = EXCLUDED.is_active,
  metadata = EXCLUDED.metadata,
  updated_at = now();

-- Create teacher-section assignment
INSERT INTO teacher_sections (
  teacher_id,
  section_id,
  subject,
  school_year,
  is_primary
) VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid, -- Teacher Sarah Johnson
  '00000000-0000-0000-0000-000000000021'::uuid, -- Grade 1 Section A
  'Mathematics',
  extract(year from now())::text,
  true
) ON CONFLICT (teacher_id, section_id, subject, school_year) DO NOTHING;

-- Create student enrollment
INSERT INTO enrollments (
  student_id,
  section_id,
  school_year,
  enrollment_date,
  is_active
) VALUES (
  '10000000-0000-0000-0000-000000000003'::uuid, -- Student Emma Wilson
  '00000000-0000-0000-0000-000000000021'::uuid, -- Grade 1 Section A
  extract(year from now())::text,
  CURRENT_DATE,
  true
) ON CONFLICT (student_id, section_id, school_year) DO NOTHING;

-- Create parent-student relationship
INSERT INTO parent_student_relationships (
  parent_id,
  student_id,
  relationship_type,
  is_primary
) VALUES (
  '10000000-0000-0000-0000-000000000004'::uuid, -- Parent Michael Wilson
  '10000000-0000-0000-0000-000000000003'::uuid, -- Student Emma Wilson
  'parent',
  true
) ON CONFLICT (parent_id, student_id) DO NOTHING;

-- Create sample payment for the student
INSERT INTO payments (
  school_id,
  student_id,
  payer_id,
  amount,
  currency,
  description,
  payment_type,
  status,
  due_date,
  notes
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '10000000-0000-0000-0000-000000000003'::uuid, -- Student Emma Wilson
  '10000000-0000-0000-0000-000000000004'::uuid, -- Parent Michael Wilson
  250.00,
  'USD',
  'Monthly Tuition Fee - ' || to_char(now(), 'Month YYYY'),
  'tuition',
  'pending',
  (CURRENT_DATE + INTERVAL '30 days')::date,
  'Test payment record for demonstration purposes'
);

-- Create additional sample payments for variety
INSERT INTO payments (
  school_id,
  student_id,
  payer_id,
  amount,
  currency,
  description,
  payment_type,
  status,
  due_date,
  paid_date,
  payment_method,
  transaction_id,
  notes
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '10000000-0000-0000-0000-000000000003'::uuid, -- Student Emma Wilson
  '10000000-0000-0000-0000-000000000004'::uuid, -- Parent Michael Wilson
  75.00,
  'USD',
  'School Supplies Fee',
  'supplies',
  'paid',
  (CURRENT_DATE - INTERVAL '15 days')::date,
  (CURRENT_DATE - INTERVAL '10 days')::date,
  'credit_card',
  'txn_' || substr(md5(random()::text), 1, 10),
  'Payment for school supplies and materials'
);

-- Create sample announcement
INSERT INTO announcements (
  school_id,
  author_id,
  title,
  content,
  target_audience,
  section_ids,
  is_pinned,
  is_published
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '10000000-0000-0000-0000-000000000002'::uuid, -- Teacher Sarah Johnson
  'Welcome to the New School Year!',
  'Dear students and parents,

Welcome to the new academic year! We are excited to have you in our learning community. This year promises to be filled with exciting learning opportunities, new discoveries, and personal growth.

Important reminders:
• Classes begin at 8:00 AM sharp
• Please ensure students have all required supplies
• Parent-teacher conferences will be scheduled next month
• Don''t forget to check the online portal regularly for updates

We look forward to working together to make this an amazing year of learning and growth.

Best regards,
Ms. Sarah Johnson
Mathematics Teacher',
  ARRAY['student', 'parent']::text[],
  ARRAY['00000000-0000-0000-0000-000000000021'::uuid]::uuid[],
  true,
  true
);

-- Create a sample QR code for enrollment (teacher can create these)
INSERT INTO enrollment_qr_codes (
  teacher_id,
  section_id,
  school_year,
  qr_code,
  title,
  description,
  max_uses,
  current_uses,
  expires_at,
  is_active
) VALUES (
  '10000000-0000-0000-0000-000000000002'::uuid, -- Teacher Sarah Johnson
  '00000000-0000-0000-0000-000000000021'::uuid, -- Grade 1 Section A
  extract(year from now())::text,
  'DEMO_QR_' || substr(md5(random()::text), 1, 8),
  'Grade 1 Math Class Enrollment',
  'Scan this QR code to join our Grade 1 Mathematics class',
  30,
  1, -- Emma is already enrolled
  (CURRENT_DATE + INTERVAL '90 days')::timestamptz,
  true
);

-- Create a view for easy account reference
CREATE OR REPLACE VIEW test_accounts AS
SELECT 
  up.id,
  up.role,
  up.first_name,
  up.last_name,
  up.email,
  up.phone,
  up.is_active,
  up.created_at,
  CASE up.role
    WHEN 'developer' THEN 'DevPass123!'
    WHEN 'teacher' THEN 'TeachPass123!'
    WHEN 'student' THEN 'StudentPass123!'
    WHEN 'parent' THEN 'ParentPass123!'
    WHEN 'accounting' THEN 'AccountPass123!'
    ELSE 'Unknown'
  END as suggested_password,
  up.metadata
FROM user_profiles up
WHERE up.email IN (
  'developer@eskwelai.com',
  'teacher@eskwelai.com',
  'student@eskwelai.com',
  'parent@eskwelai.com',
  'accounting@eskwelai.com'
)
ORDER BY 
  CASE up.role
    WHEN 'developer' THEN 1
    WHEN 'teacher' THEN 2
    WHEN 'student' THEN 3
    WHEN 'parent' THEN 4
    WHEN 'accounting' THEN 5
    ELSE 6
  END;

-- Grant access to the view
GRANT SELECT ON test_accounts TO authenticated;

-- Create a helpful function to display account information
CREATE OR REPLACE FUNCTION get_test_account_info()
RETURNS TABLE (
  role text,
  email text,
  password text,
  full_name text,
  description text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ta.role::text,
    ta.email,
    ta.suggested_password,
    ta.first_name || ' ' || ta.last_name as full_name,
    CASE ta.role
      WHEN 'developer' THEN 'Full system access - Developer console'
      WHEN 'teacher' THEN 'Teaching tools - Create QR codes, manage students'
      WHEN 'student' THEN 'Learning portal - View grades, join classes'
      WHEN 'parent' THEN 'Parent portal - Monitor child progress, payments'
      WHEN 'accounting' THEN 'Financial management - Handle payments, reports'
      ELSE 'Unknown role'
    END as description
  FROM test_accounts ta
  ORDER BY 
    CASE ta.role
      WHEN 'developer' THEN 1
      WHEN 'teacher' THEN 2
      WHEN 'student' THEN 3
      WHEN 'parent' THEN 4
      WHEN 'accounting' THEN 5
      ELSE 6
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_test_account_info() TO authenticated;
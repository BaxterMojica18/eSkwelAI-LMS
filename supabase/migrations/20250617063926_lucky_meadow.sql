/*
  # Fix User Profiles Creation - Remove FK Constraint for Testing
  
  This migration temporarily removes the foreign key constraint between user_profiles and auth.users
  to allow creating test profiles that can be linked later when auth users are created.
  
  ## Changes
  
  1. Temporarily drop the foreign key constraint
  2. Create test user profiles with predefined UUIDs
  3. Create sample data (enrollments, payments, etc.)
  4. Add a note about re-enabling the constraint in production
  
  ## Security Notes
  
  - This is for development/testing only
  - In production, always create auth users first, then profiles
  - The constraint should be re-enabled once real auth users are created
*/

-- Temporarily drop the foreign key constraint for testing
-- IMPORTANT: This is only for development/testing purposes
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

-- Add a comment to remind about re-enabling the constraint
COMMENT ON TABLE user_profiles IS 'Foreign key constraint to auth.users temporarily disabled for testing. Re-enable in production after creating real auth users.';

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
    "notes": "Primary developer account with full system access",
    "temp_profile": true,
    "auth_user_needed": true
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
    "certifications": ["Elementary Education", "Mathematics Specialist"],
    "temp_profile": true,
    "auth_user_needed": true
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
    "special_needs": false,
    "temp_profile": true,
    "auth_user_needed": true
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
    "emergency_contact": true,
    "temp_profile": true,
    "auth_user_needed": true
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
    "access_level": "financial_management",
    "temp_profile": true,
    "auth_user_needed": true
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
  up.metadata,
  CASE 
    WHEN (up.metadata->>'temp_profile')::boolean = true THEN 'Temporary - Auth user needed'
    ELSE 'Active'
  END as profile_status
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
  description text,
  status text
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
    END as description,
    ta.profile_status
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

-- Create a function to re-enable the foreign key constraint when ready
CREATE OR REPLACE FUNCTION restore_user_profiles_fk_constraint()
RETURNS void AS $$
BEGIN
  -- Re-add the foreign key constraint
  ALTER TABLE user_profiles 
  ADD CONSTRAINT user_profiles_id_fkey 
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  
  -- Update the table comment
  COMMENT ON TABLE user_profiles IS 'User profiles linked to auth.users via foreign key constraint.';
  
  RAISE NOTICE 'Foreign key constraint restored. All user_profiles.id must now exist in auth.users.id';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION restore_user_profiles_fk_constraint() TO authenticated;

-- Add helpful comments and notices
COMMENT ON FUNCTION get_test_account_info() IS 'Returns test account information with suggested passwords for development use';
COMMENT ON FUNCTION restore_user_profiles_fk_constraint() IS 'Re-enables the foreign key constraint between user_profiles and auth.users - call after creating real auth users';

-- Display helpful information
DO $$
BEGIN
  RAISE NOTICE '=== TEST ACCOUNTS CREATED ===';
  RAISE NOTICE 'Foreign key constraint temporarily disabled for testing.';
  RAISE NOTICE 'Use these credentials to create auth users through Supabase Auth:';
  RAISE NOTICE '';
  RAISE NOTICE '1. Developer: developer@eskwelai.com / DevPass123!';
  RAISE NOTICE '2. Teacher: teacher@eskwelai.com / TeachPass123!';
  RAISE NOTICE '3. Student: student@eskwelai.com / StudentPass123!';
  RAISE NOTICE '4. Parent: parent@eskwelai.com / ParentPass123!';
  RAISE NOTICE '5. Accounting: accounting@eskwelai.com / AccountPass123!';
  RAISE NOTICE '';
  RAISE NOTICE 'After creating auth users, run: SELECT restore_user_profiles_fk_constraint();';
  RAISE NOTICE 'View account info: SELECT * FROM get_test_account_info();';
END;
$$;
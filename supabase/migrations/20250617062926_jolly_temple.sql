/*
  # Create Test Accounts for All User Roles

  1. Test Accounts
    - Developer: developer@eskwelai.com / DevPass123!
    - Teacher: teacher@eskwelai.com / TeachPass123!
    - Student: student@eskwelai.com / StudentPass123!
    - Parent: parent@eskwelai.com / ParentPass123!
    - Accounting: accounting@eskwelai.com / AccountPass123!

  2. User Profiles
    - Complete profile information for each role
    - Proper school assignments
    - Realistic personal information

  3. Relationships
    - Parent-student relationship
    - Teacher-section assignments
    - Student enrollments
*/

-- Function to create auth users and profiles
CREATE OR REPLACE FUNCTION create_test_user(
  user_email text,
  user_password text,
  user_role user_role,
  first_name text,
  last_name text,
  phone_number text DEFAULT NULL,
  user_address text DEFAULT NULL,
  birth_date date DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  new_user_id uuid;
  school_uuid uuid := '00000000-0000-0000-0000-000000000001'::uuid;
BEGIN
  -- Generate a new UUID for the user
  new_user_id := gen_random_uuid();
  
  -- Insert into auth.users (simulating Supabase auth)
  -- Note: In production, users would be created through Supabase Auth API
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
  ) VALUES (
    new_user_id,
    user_email,
    crypt(user_password, gen_salt('bf')), -- Simple password hashing for demo
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    jsonb_build_object(
      'first_name', first_name,
      'last_name', last_name,
      'phone', phone_number
    ),
    false,
    'authenticated'
  ) ON CONFLICT (email) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    updated_at = now();

  -- Create user profile
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
    new_user_id,
    school_uuid,
    user_role,
    first_name,
    last_name,
    user_email,
    phone_number,
    user_address,
    birth_date,
    true,
    jsonb_build_object(
      'created_by', 'system',
      'account_type', 'test',
      'role', user_role::text
    )
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

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create test accounts
DO $$
DECLARE
  developer_id uuid;
  teacher_id uuid;
  student_id uuid;
  parent_id uuid;
  accounting_id uuid;
  current_year text := extract(year from now())::text;
  section_id uuid := '00000000-0000-0000-0000-000000000021'::uuid; -- Grade 1 Section A
BEGIN
  -- 1. Developer Account
  developer_id := create_test_user(
    'developer@eskwelai.com',
    'DevPass123!',
    'developer',
    'Alex',
    'Developer',
    '+1 (555) 100-0001',
    '123 Tech Street, Silicon Valley, CA 94000',
    '1990-01-15'::date
  );

  -- 2. Teacher Account
  teacher_id := create_test_user(
    'teacher@eskwelai.com',
    'TeachPass123!',
    'teacher',
    'Sarah',
    'Johnson',
    '+1 (555) 100-0002',
    '456 Education Ave, Learning City, LC 12345',
    '1985-03-22'::date
  );

  -- 3. Student Account
  student_id := create_test_user(
    'student@eskwelai.com',
    'StudentPass123!',
    'student',
    'Emma',
    'Wilson',
    '+1 (555) 100-0003',
    '789 Student Lane, Learning City, LC 12345',
    '2017-09-10'::date
  );

  -- 4. Parent Account
  parent_id := create_test_user(
    'parent@eskwelai.com',
    'ParentPass123!',
    'parent',
    'Michael',
    'Wilson',
    '+1 (555) 100-0004',
    '789 Student Lane, Learning City, LC 12345',
    '1982-07-18'::date
  );

  -- 5. Accounting Account
  accounting_id := create_test_user(
    'accounting@eskwelai.com',
    'AccountPass123!',
    'accounting',
    'Jennifer',
    'Martinez',
    '+1 (555) 100-0005',
    '321 Finance Blvd, Learning City, LC 12345',
    '1988-11-05'::date
  );

  -- Create teacher-section assignment
  INSERT INTO teacher_sections (
    teacher_id,
    section_id,
    subject,
    school_year,
    is_primary
  ) VALUES (
    teacher_id,
    section_id,
    'Mathematics',
    current_year,
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
    student_id,
    section_id,
    current_year,
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
    parent_id,
    student_id,
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
    due_date
  ) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    student_id,
    parent_id,
    250.00,
    'USD',
    'Monthly Tuition Fee - ' || to_char(now(), 'Month YYYY'),
    'tuition',
    'pending',
    (CURRENT_DATE + INTERVAL '30 days')::date
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
    teacher_id,
    'Welcome to the New School Year!',
    'Dear students and parents, welcome to the new academic year. We are excited to have you in our learning community. Please check your schedules and prepare for an amazing year of learning and growth.',
    ARRAY['student', 'parent']::text[],
    ARRAY[section_id]::uuid[],
    true,
    true
  );

  RAISE NOTICE 'Test accounts created successfully:';
  RAISE NOTICE 'Developer ID: %', developer_id;
  RAISE NOTICE 'Teacher ID: %', teacher_id;
  RAISE NOTICE 'Student ID: %', student_id;
  RAISE NOTICE 'Parent ID: %', parent_id;
  RAISE NOTICE 'Accounting ID: %', accounting_id;
END;
$$;

-- Clean up the helper function
DROP FUNCTION IF EXISTS create_test_user(text, text, user_role, text, text, text, text, date);

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
  END as test_password
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
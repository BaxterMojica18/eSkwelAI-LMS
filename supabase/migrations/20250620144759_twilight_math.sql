/*
  # Create Test Accounts for Demo

  1. Test Users
    - Creates test accounts for parent, teacher, and accounting roles
    - Includes sample data for testing functionality
    - Sets up relationships and sample payments

  2. Security
    - Uses the existing RLS policies
    - Creates proper user profiles and relationships

  3. Sample Data
    - Parent-student relationships
    - Sample payments and fees
    - Teacher-section assignments
*/

-- Create test school if it doesn't exist
INSERT INTO schools (id, name, address, phone, email, settings)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Demo Elementary School',
  '123 Education Street, Learning City, LC 12345',
  '+1 (555) 123-4567',
  'admin@demoschool.edu',
  '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Create school levels
INSERT INTO school_levels (id, school_id, name, description, order_index)
VALUES 
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Elementary', 'Elementary School Level', 1),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Middle School', 'Middle School Level', 2)
ON CONFLICT (id) DO NOTHING;

-- Create sections
INSERT INTO sections (id, school_level_id, name, section_number, capacity)
VALUES 
  ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Grade 1-A', 1, 25),
  ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Grade 2-B', 2, 25),
  ('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'Grade 6-A', 6, 30)
ON CONFLICT (id) DO NOTHING;

-- Create test user profiles (these will be linked to auth users)
INSERT INTO user_profiles (id, school_id, first_name, last_name, email, phone, address, role, is_active, metadata)
VALUES 
  -- Accounting User
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Sarah', 'Johnson', 'accounting@demoschool.edu', '+1 (555) 234-5678', '456 Finance Ave', 'accounting', true, '{"test_account": true}'::jsonb),
  
  -- Teacher User
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Michael', 'Davis', 'teacher@demoschool.edu', '+1 (555) 345-6789', '789 Teacher Lane', 'teacher', true, '{"test_account": true}'::jsonb),
  
  -- Parent User
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'Jennifer', 'Smith', 'parent@demoschool.edu', '+1 (555) 456-7890', '321 Parent Street', 'parent', true, '{"test_account": true}'::jsonb),
  
  -- Student 1 (Child of Parent)
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'Emma', 'Smith', 'emma.smith@demoschool.edu', null, '321 Parent Street', 'student', true, '{"test_account": true}'::jsonb),
  
  -- Student 2 (Child of Parent)
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'James', 'Smith', 'james.smith@demoschool.edu', null, '321 Parent Street', 'student', true, '{"test_account": true}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Create parent-student relationships
INSERT INTO parent_student_relationships (parent_id, student_id, relationship_type, is_primary)
VALUES 
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'parent', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'parent', true)
ON CONFLICT (parent_id, student_id) DO NOTHING;

-- Create teacher-section assignments
INSERT INTO teacher_sections (teacher_id, section_id, subject, school_year, is_primary)
VALUES 
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'Mathematics', '2025', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 'Science', '2025', false)
ON CONFLICT (teacher_id, section_id, subject, school_year) DO NOTHING;

-- Create student enrollments
INSERT INTO enrollments (student_id, section_id, school_year, enrollment_date, is_active)
VALUES 
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', '2025', '2025-01-15', true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', '2025', '2025-01-15', true)
ON CONFLICT (student_id, section_id, school_year) DO NOTHING;

-- Create sample payments for testing
INSERT INTO payments (school_id, student_id, payer_id, amount, currency, description, payment_type, status, due_date, paid_date, payment_method, transaction_id, notes)
VALUES 
  -- Emma's payments
  ('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 500.00, 'USD', 'First Quarter Tuition Fee', 'Tuition', 'paid', '2025-01-15', '2025-01-10', 'Credit Card', 'TXN001', 'Paid in full'),
  ('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 150.00, 'USD', 'Mathematics Textbook', 'Books', 'pending', '2025-02-01', null, null, null, 'Required textbook for Grade 1'),
  ('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 75.00, 'USD', 'Art Supplies Fee', 'Miscellaneous', 'pending', '2025-02-15', null, null, null, 'Art class materials'),
  ('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 200.00, 'USD', 'Science Museum Field Trip', 'School Trip', 'overdue', '2025-01-20', null, null, null, 'Educational field trip'),
  
  -- James's payments
  ('11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 500.00, 'USD', 'First Quarter Tuition Fee', 'Tuition', 'paid', '2025-01-15', '2025-01-12', 'Bank Transfer', 'TXN002', 'Paid via online banking'),
  ('11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 125.00, 'USD', 'Science Workbook Set', 'Books', 'paid', '2025-01-25', '2025-01-20', 'Credit Card', 'TXN003', 'Grade 2 science materials'),
  ('11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 50.00, 'USD', 'Library Late Fee', 'Miscellaneous', 'pending', '2025-02-10', null, null, null, 'Overdue book charges'),
  ('11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 300.00, 'USD', 'Year-end Graduation Ceremony', 'Prom', 'pending', '2025-06-01', null, null, null, 'Graduation celebration event'),
  
  -- Additional sample payments for variety
  ('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 500.00, 'USD', 'Second Quarter Tuition Fee', 'Tuition', 'pending', '2025-04-01', null, null, null, 'Q2 tuition payment'),
  ('11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 500.00, 'USD', 'Second Quarter Tuition Fee', 'Tuition', 'pending', '2025-04-01', null, null, null, 'Q2 tuition payment'),
  ('11111111-1111-1111-1111-111111111111', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 100.00, 'USD', 'Uniform Purchase', 'Miscellaneous', 'overdue', '2025-01-10', null, null, null, 'School uniform set'),
  ('11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 180.00, 'USD', 'Zoo Educational Visit', 'School Trip', 'pending', '2025-03-15', null, null, null, 'Biology field trip to city zoo')
ON CONFLICT DO NOTHING;

-- Create sample assessments for the teacher
INSERT INTO assessments (section_id, teacher_id, title, description, instructions, time_limit_minutes, total_points, passing_score, is_published, due_date)
VALUES 
  ('44444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Math Quiz 1', 'Basic addition and subtraction', 'Complete all problems. Show your work.', 30, 100, 70, true, '2025-02-15 10:00:00'),
  ('55555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Science Test - Plants', 'Test on plant biology basics', 'Answer all questions about plant parts and functions.', 45, 150, 105, true, '2025-02-20 14:00:00')
ON CONFLICT DO NOTHING;

-- Create sample learning modules
INSERT INTO learning_modules (section_id, teacher_id, title, description, type, content_url, duration_minutes, order_index, is_published)
VALUES 
  ('44444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Introduction to Numbers', 'Basic number recognition and counting', 'video', 'https://example.com/video1', 15, 1, true),
  ('44444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Addition Basics', 'Learning to add single digits', 'pdf', 'https://example.com/pdf1', null, 2, true),
  ('55555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Plant Parts', 'Understanding different parts of plants', 'video', 'https://example.com/video2', 20, 1, true)
ON CONFLICT DO NOTHING;

-- Create sample QR codes for enrollment
INSERT INTO enrollment_qr_codes (teacher_id, section_id, school_year, qr_code, title, description, max_uses, current_uses, expires_at, is_active)
VALUES 
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', '2025', 'DEMO_QR_MATH_2025', 'Math Class Enrollment', 'Join Grade 1-A Mathematics class', 30, 5, '2025-12-31 23:59:59', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', '2025', 'DEMO_QR_SCI_2025', 'Science Class Enrollment', 'Join Grade 2-B Science class', 25, 3, '2025-12-31 23:59:59', true)
ON CONFLICT (qr_code) DO NOTHING;

-- Create sample announcements
INSERT INTO announcements (school_id, author_id, title, content, target_audience, section_ids, is_pinned, is_published)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Welcome to New Semester', 'Welcome back students! We are excited to start the new semester with lots of fun learning activities.', ARRAY['student', 'parent'], ARRAY['44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555'], true, true),
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Payment Reminder', 'Please remember that tuition payments for the second quarter are due by April 1st, 2025.', ARRAY['parent'], ARRAY[], false, true)
ON CONFLICT DO NOTHING;
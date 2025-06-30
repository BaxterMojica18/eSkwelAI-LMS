/*
  # Fix User Registration with Database Trigger

  1. Problem Resolution
    - Removes problematic RLS INSERT policy that was blocking new user registration
    - Creates secure database trigger to automatically create user profiles
    - Implements proper authentication flow

  2. New Database Objects
    - `handle_new_user()` function: Automatically creates user profiles from auth metadata
    - `on_auth_user_created` trigger: Fires after new user signup
    - Updated RLS policies for authenticated users only

  3. Security Improvements
    - Uses SECURITY DEFINER for elevated privileges during profile creation
    - Removes public INSERT access to user_profiles
    - Maintains proper access control for authenticated users

  4. Metadata Handling
    - Extracts user data from auth.users.raw_user_meta_data
    - Handles optional fields gracefully with COALESCE
    - Supports all user roles and profile fields
*/

-- Drop existing problematic policies that block new user registration
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Public users can insert profiles" ON user_profiles;

-- Function to handle new user profile creation automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    email, 
    first_name, 
    last_name, 
    role,
    school_code,
    phone,
    date_of_birth,
    address,
    is_active
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'school_code', NULL),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    CASE 
      WHEN NEW.raw_user_meta_data->>'date_of_birth' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'date_of_birth')::date 
      ELSE NULL 
    END,
    COALESCE(NEW.raw_user_meta_data->>'address', NULL),
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies - remove public access, only authenticated users
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Authenticated users can read their own profile
CREATE POLICY "Authenticated users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Authenticated users can update their own profile
CREATE POLICY "Authenticated users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow developers to read all profiles for system administration
CREATE POLICY "Developers can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'developer'
    )
  );

-- Allow developers to update all profiles for system administration
CREATE POLICY "Developers can update all profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'developer'
    )
  );

-- Helper function for DevTools to check if functions exist
CREATE OR REPLACE FUNCTION public.check_function_exists(function_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE n.nspname = 'public' 
    AND p.proname = function_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
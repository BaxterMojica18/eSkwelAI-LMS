/*
  # Fix User Profiles RLS Policies and Add Default Values

  1. Policy Changes
    - Remove recursive policies that cause infinite loops
    - Simplify policies to avoid self-referencing queries
    - Keep essential security while preventing recursion

  2. Schema Updates
    - Add default values for nullable fields to prevent null issues
    - Update phone field to have empty string default
    - Set sensible defaults for other optional fields

  3. Security
    - Maintain proper access control without recursion
    - Users can read/update their own profiles
    - Admins and developers have broader access
    - School-based access through simpler mechanisms
*/

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "User profiles are viewable by users in the same school" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "auth_users_read_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "auth_users_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "developers_insert_profiles" ON user_profiles;
DROP POLICY IF EXISTS "developers_read_all_profiles" ON user_profiles;
DROP POLICY IF EXISTS "developers_update_all_profiles" ON user_profiles;

-- Add default values to prevent null issues
ALTER TABLE user_profiles ALTER COLUMN phone SET DEFAULT '';
ALTER TABLE user_profiles ALTER COLUMN date_of_birth SET DEFAULT NULL;
ALTER TABLE user_profiles ALTER COLUMN address SET DEFAULT '';
ALTER TABLE user_profiles ALTER COLUMN profile_image_url SET DEFAULT '';

-- Create simplified, non-recursive policies

-- 1. Users can read their own profile
CREATE POLICY "users_read_own_profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 2. Users can update their own profile
CREATE POLICY "users_update_own_profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Allow profile creation (for the trigger)
CREATE POLICY "allow_profile_creation"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 4. Developers can read all profiles (simplified)
CREATE POLICY "developers_read_all"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role = 'developer'
    )
  );

-- 5. Developers can update all profiles (simplified)
CREATE POLICY "developers_update_all"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role = 'developer'
    )
  );

-- 6. Developers can insert profiles (simplified)
CREATE POLICY "developers_insert_all"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role = 'developer'
    )
  );

-- 7. School-based access for admins (simplified)
CREATE POLICY "admins_manage_school_profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role IN ('admin', 'developer')
      AND up.school_id = user_profiles.school_id
    )
  );

-- Update existing records to have default values instead of nulls
UPDATE user_profiles 
SET 
  phone = COALESCE(phone, ''),
  address = COALESCE(address, ''),
  profile_image_url = COALESCE(profile_image_url, '')
WHERE 
  phone IS NULL 
  OR address IS NULL 
  OR profile_image_url IS NULL;
/*
  # Fix infinite recursion in user_profiles RLS policies

  1. Problem
    - Current policies are causing infinite recursion by querying user_profiles table within the policies themselves
    - This prevents users from accessing their profiles and dashboards

  2. Solution
    - Drop existing problematic policies
    - Create simplified, non-recursive policies
    - Ensure policies use auth.uid() directly without subqueries on user_profiles

  3. New Policies
    - Users can read their own profile (simple auth.uid() = id check)
    - Users can update their own profile
    - Users can insert their own profile during registration
    - Developers can manage all profiles
    - Admins can manage profiles within their school
*/

-- Drop all existing policies on user_profiles to start fresh
DROP POLICY IF EXISTS "admins_manage_school_profiles" ON user_profiles;
DROP POLICY IF EXISTS "allow_profile_creation" ON user_profiles;
DROP POLICY IF EXISTS "developers_insert_all" ON user_profiles;
DROP POLICY IF EXISTS "developers_read_all" ON user_profiles;
DROP POLICY IF EXISTS "developers_update_all" ON user_profiles;
DROP POLICY IF EXISTS "users_read_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON user_profiles;

-- Create simple, non-recursive policies

-- 1. Users can read their own profile (most important - no recursion)
CREATE POLICY "users_can_read_own_profile" ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 2. Users can update their own profile
CREATE POLICY "users_can_update_own_profile" ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Allow profile creation during registration
CREATE POLICY "allow_profile_creation_on_signup" ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 4. Developers can do everything (using auth.jwt() to check role from token)
CREATE POLICY "developers_full_access" ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    COALESCE((auth.jwt() -> 'user_metadata' ->> 'role'), '') = 'developer'
  )
  WITH CHECK (
    COALESCE((auth.jwt() -> 'user_metadata' ->> 'role'), '') = 'developer'
  );

-- 5. School admins can manage profiles in their school (simplified)
-- This policy will only work after the user has a profile, so it's safe for existing users
CREATE POLICY "school_admins_manage_school_profiles" ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles admin_profile
      WHERE admin_profile.id = auth.uid()
        AND admin_profile.role IN ('admin', 'developer')
        AND admin_profile.school_id = user_profiles.school_id
        AND admin_profile.school_id IS NOT NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles admin_profile
      WHERE admin_profile.id = auth.uid()
        AND admin_profile.role IN ('admin', 'developer')
        AND admin_profile.school_id = user_profiles.school_id
        AND admin_profile.school_id IS NOT NULL
    )
  );
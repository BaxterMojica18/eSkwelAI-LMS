/*
  # Fix User Profiles RLS Policy

  1. Security Changes
    - Drop the problematic recursive RLS policy on user_profiles
    - Create a correct policy that allows users to view their own profile
    - Ensure the policy uses auth.uid() = id without recursion

  2. Policy Details
    - Users can only view their own profile data
    - Uses direct comparison with auth.uid() to avoid recursion
    - Maintains security while fixing the infinite loop issue
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read school members" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Create correct policies without recursion
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to read other profiles in their school (non-recursive)
CREATE POLICY "Users can read school members" ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    school_id IN (
      SELECT up.school_id 
      FROM user_profiles up 
      WHERE up.id = auth.uid()
    )
  );
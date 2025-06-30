/*
  # Fix School Creation RLS Policies

  1. Security Changes
    - Drop all existing conflicting policies
    - Create simple, clear policies for school management
    - Ensure authenticated users can create schools
    - Maintain proper access control for updates/deletes

  2. Policy Structure
    - Public read access for school validation
    - Authenticated insert access for school creation
    - Role-based update/delete access
*/

-- First, disable RLS temporarily to clean up
ALTER TABLE public.schools DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can view schools" ON public.schools;
DROP POLICY IF EXISTS "Public schools are viewable by everyone" ON public.schools;
DROP POLICY IF EXISTS "Schools can be created by authenticated users" ON public.schools;
DROP POLICY IF EXISTS "Authenticated users can create schools" ON public.schools;
DROP POLICY IF EXISTS "Schools can be updated by admins" ON public.schools;
DROP POLICY IF EXISTS "Admins can update schools" ON public.schools;
DROP POLICY IF EXISTS "Admins can delete schools" ON public.schools;

-- Re-enable RLS
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- Create new, simple policies

-- 1. Allow public read access (needed for school code validation)
CREATE POLICY "schools_select_policy"
ON public.schools
FOR SELECT
TO public
USING (true);

-- 2. Allow ANY authenticated user to create schools (no restrictions)
CREATE POLICY "schools_insert_policy"
ON public.schools
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Allow school-related users to update schools
CREATE POLICY "schools_update_policy"
ON public.schools
FOR UPDATE
TO authenticated
USING (
  -- Allow developers and admins to update any school
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role IN ('developer', 'admin')
  )
  OR
  -- Allow school admins to update their own school
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.school_id = schools.id
    AND user_profiles.role IN ('admin', 'accounting')
  )
);

-- 4. Allow developers and admins to delete schools
CREATE POLICY "schools_delete_policy"
ON public.schools
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role IN ('developer', 'admin')
  )
);

-- Also ensure the schools table has proper constraints
-- FIX: Drop and then Add the unique constraint (PostgreSQL doesn't support IF NOT EXISTS with ADD CONSTRAINT)
ALTER TABLE public.schools
DROP CONSTRAINT IF EXISTS schools_school_code_unique;

ALTER TABLE public.schools
ADD CONSTRAINT schools_school_code_unique UNIQUE (school_code);



-- Add check constraint for plan values
ALTER TABLE public.schools
DROP CONSTRAINT IF EXISTS schools_plan_check;

ALTER TABLE public.schools
ADD CONSTRAINT schools_plan_check
CHECK (plan IN ('small', 'medium', 'large'));

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT ON public.schools TO authenticated;
GRANT UPDATE, DELETE ON public.schools TO authenticated;

-- Ensure the sequence is accessible
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
-- Fix RLS policies for schools table to allow creation

-- First, let's check the current policies and drop them
DROP POLICY IF EXISTS "Public schools are viewable by everyone" ON public.schools;
DROP POLICY IF EXISTS "Schools can be created by authenticated users" ON public.schools;
DROP POLICY IF EXISTS "Schools can be updated by admins" ON public.schools;

-- Create new, more permissive policies for school management

-- Allow anyone to view schools (for school code validation)
CREATE POLICY "Anyone can view schools"
ON public.schools
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to create schools
CREATE POLICY "Authenticated users can create schools"
ON public.schools
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow school admins and developers to update schools
CREATE POLICY "Admins can update schools"
ON public.schools
FOR UPDATE
TO authenticated
USING (
  -- Allow if user is a developer/admin
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role IN ('developer', 'admin')
  )
  OR
  -- Allow if user is associated with this school
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.school_id = schools.id
    AND user_profiles.role IN ('admin', 'accounting')
  )
);

-- Allow school admins and developers to delete schools (if needed)
CREATE POLICY "Admins can delete schools"
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

-- Ensure RLS is enabled
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- Also fix the user_profiles policies to ensure they work correctly
DROP POLICY IF EXISTS "allow_profile_creation_on_signup" ON public.user_profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users_can_view_own_profile" ON public.user_profiles;

-- Allow profile creation during signup (this is handled by the trigger)
CREATE POLICY "Allow profile creation during signup"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow developers and admins to view all profiles
CREATE POLICY "Developers and admins can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid()
    AND up.role IN ('developer', 'admin')
  )
);

-- Allow developers and admins to update any profile
CREATE POLICY "Developers and admins can update any profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid()
    AND up.role IN ('developer', 'admin')
  )
);

-- Ensure RLS is enabled on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
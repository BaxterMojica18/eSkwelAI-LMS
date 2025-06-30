/*
  # Fix User Registration Trigger

  1. Updates
    - Drop and recreate the handle_new_user function to properly handle metadata
    - Ensure the trigger can handle all the fields passed during signup
    - Add proper error handling and logging
    - Make school_code lookup more robust

  2. Security
    - Maintains RLS policies
    - Uses SECURITY DEFINER for proper permissions
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_user_profile();

-- Create improved function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_first_name TEXT;
  user_last_name TEXT;
  user_role TEXT;
  user_school_code TEXT;
  user_phone TEXT;
  user_date_of_birth DATE;
  user_address TEXT;
  found_school_id UUID;
BEGIN
  -- Extract metadata from the new user
  user_first_name := COALESCE(NEW.raw_user_meta_data ->> 'firstName', NEW.raw_user_meta_data ->> 'first_name', '');
  user_last_name := COALESCE(NEW.raw_user_meta_data ->> 'lastName', NEW.raw_user_meta_data ->> 'last_name', '');
  user_role := COALESCE(NEW.raw_user_meta_data ->> 'role', 'student');
  user_school_code := NEW.raw_user_meta_data ->> 'schoolCode';
  user_phone := NEW.raw_user_meta_data ->> 'phone';
  user_date_of_birth := (NEW.raw_user_meta_data ->> 'dateOfBirth')::DATE;
  user_address := NEW.raw_user_meta_data ->> 'address';

  -- Log the extracted data for debugging
  RAISE LOG 'Creating profile for user: %, email: %, role: %, school_code: %', 
    NEW.id, NEW.email, user_role, user_school_code;

  -- If school_code is provided, try to find the school
  IF user_school_code IS NOT NULL AND user_school_code != '' THEN
    SELECT id INTO found_school_id 
    FROM public.schools 
    WHERE school_code = user_school_code;
    
    -- Log if school not found
    IF found_school_id IS NULL THEN
      RAISE LOG 'School not found for code: %', user_school_code;
    ELSE
      RAISE LOG 'Found school: % for code: %', found_school_id, user_school_code;
    END IF;
  END IF;

  -- Insert into user_profiles with all available data
  INSERT INTO public.user_profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    school_id,
    phone,
    date_of_birth,
    address,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    user_first_name,
    user_last_name,
    user_role,
    found_school_id, -- This can be NULL if school not found
    user_phone,
    user_date_of_birth,
    user_address,
    true,
    NOW(),
    NOW()
  );

  RAISE LOG 'Successfully created profile for user: %', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error details
    RAISE LOG 'Error creating user profile for %: % - %', NEW.id, SQLERRM, SQLSTATE;
    -- Re-raise the exception to fail the auth signup
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure the user_profiles table has the right structure
-- Make school_id nullable since users might not always have a school
ALTER TABLE public.user_profiles 
ALTER COLUMN school_id DROP NOT NULL;

-- Add a check constraint for valid roles
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_role_check;

ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('developer', 'admin', 'teacher', 'student', 'parent', 'accounting'));

-- Update the signUp function in useAuth to pass metadata correctly
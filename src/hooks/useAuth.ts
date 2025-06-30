import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  role: 'developer' | 'admin' | 'teacher' | 'student' | 'parent' | 'accounting'
  school_id: string | null
  school_code: string | null
  phone: string | null
  date_of_birth: string | null
  address: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface School {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  principal_name: string | null
  principal_email: string | null
  logo_url: string | null
  plan: 'small' | 'medium' | 'large'
  student_count: string | null
  teacher_count: string | null
  school_code: string
  created_at: string
  updated_at: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    if (!supabase) {
      console.log('Supabase not configured, setting loading to false')
      setLoading(false)
      return
    }

    let mounted = true

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return

        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }

        console.log('Session:', session?.user?.id)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log('Auth state change:', event, session?.user?.id)
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // For new signups, wait a bit for the trigger to create the profile
        if (event === 'SIGNED_UP') {
          console.log('New user signed up, waiting for profile creation...')
          // Wait 3 seconds for the trigger to complete
          setTimeout(() => {
            if (mounted) {
              fetchUserProfile(session.user.id, 5) // More retries for new users
            }
          }, 3000)
        } else {
          await fetchUserProfile(session.user.id)
        }
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string, maxRetries = 3) => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let retries = 0
    
    const attemptFetch = async () => {
      try {
        console.log(`Fetching profile for user ${userId}, attempt ${retries + 1}/${maxRetries}`)

        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (profileError) {
          console.log('Profile fetch error:', profileError)
          
          // If profile doesn't exist yet and we have retries left, try again
          if (profileError.code === 'PGRST116' && retries < maxRetries - 1) {
            retries++
            console.log(`Profile not found, retrying in 2 seconds... (${retries}/${maxRetries})`)
            setTimeout(attemptFetch, 2000)
            return
          }
          
          // If we've exhausted retries, stop loading but don't error
          console.error('Failed to fetch profile after retries:', profileError)
          setLoading(false)
          return
        }

        console.log('Profile fetched successfully:', profileData)
        setProfile(profileData)
        setLoading(false)
      } catch (error) {
        console.error('Error in fetchUserProfile:', error)
        if (retries < maxRetries - 1) {
          retries++
          setTimeout(attemptFetch, 2000)
        } else {
          setLoading(false)
        }
      }
    }

    attemptFetch()
  }

  const signUp = async (email: string, password: string, userData: {
    firstName: string
    lastName: string
    role: string
    schoolCode?: string
    phone?: string
    dateOfBirth?: string
    address?: string
  }) => {
    try {
      if (!supabase) {
        return { user: null, error: 'Supabase not configured' }
      }

      setLoading(true)

      console.log('Signing up user with data:', { email, ...userData })

      // Validate school code if provided
      if (userData.schoolCode && userData.schoolCode.trim() !== '') {
        console.log('Validating school code:', userData.schoolCode)
        
        const { data: school, error: schoolError } = await supabase
          .from('schools')
          .select('id, name, school_code')
          .eq('school_code', userData.schoolCode.trim())
          .single()

        if (schoolError || !school) {
          console.error('School validation error:', schoolError)
          setLoading(false)
          return { user: null, error: 'Invalid school code. Please check with your school administration.' }
        }

        console.log('School found:', school)
      }

      // Sign up the user with metadata - the trigger will create the profile
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            schoolCode: userData.schoolCode?.trim() || null,
            phone: userData.phone || null,
            dateOfBirth: userData.dateOfBirth || null,
            address: userData.address || null,
          }
        }
      })

      if (authError) {
        console.error('Auth signup error:', authError)
        setLoading(false)
        return { user: null, error: authError.message }
      }

      console.log('User signed up successfully:', authData.user?.id)
      return { user: authData.user, error: null }
    } catch (error: any) {
      console.error('Sign up error:', error)
      setLoading(false)
      return { user: null, error: error.message }
    }
  }

  const createSchool = async (schoolData: {
    name: string
    address: string
    phone: string
    email: string
    website: string
    principalName: string
    principalEmail: string
    logoUrl: string
    plan: 'small' | 'medium' | 'large'
    studentCount: string
    teacherCount: string
  }) => {
    try {
      if (!supabase) {
        return { school: null, error: 'Supabase not configured' }
      }

      setLoading(true)

      // Generate a unique school code
      const generateSchoolCode = () => {
        const prefix = schoolData.name
          .replace(/[^a-zA-Z]/g, '')
          .substring(0, 3)
          .toUpperCase();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}${randomNum}`;
      };

      const schoolCode = generateSchoolCode();

      console.log('Creating school with data:', { ...schoolData, school_code: schoolCode })

      // Ensure we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        console.error('No valid session for school creation:', sessionError)
        setLoading(false)
        return { school: null, error: 'You must be logged in to create a school' }
      }

      console.log('User session valid, proceeding with school creation...')

      // Insert the school into the database
      const { data: school, error: schoolError } = await supabase
        .from('schools')
        .insert({
          name: schoolData.name,
          address: schoolData.address || null,
          phone: schoolData.phone || null,
          email: schoolData.email || null,
          website: schoolData.website || null,
          principal_name: schoolData.principalName || null,
          principal_email: schoolData.principalEmail || null,
          logo_url: schoolData.logoUrl || null,
          plan: schoolData.plan,
          student_count: schoolData.studentCount || null,
          teacher_count: schoolData.teacherCount || null,
          school_code: schoolCode
        })
        .select()
        .single()

      if (schoolError) {
        console.error('School creation error:', schoolError)
        console.error('Error details:', {
          code: schoolError.code,
          message: schoolError.message,
          details: schoolError.details,
          hint: schoolError.hint
        })
        setLoading(false)
        
        // Provide more specific error messages
        if (schoolError.code === '42501') {
          return { school: null, error: 'Permission denied. Please ensure you are logged in and try again.' }
        } else if (schoolError.code === '23505') {
          return { school: null, error: 'A school with this information already exists.' }
        } else {
          return { school: null, error: `Failed to create school: ${schoolError.message}` }
        }
      }

      console.log('School created successfully:', school)
      
      // Update the user's profile to link them to the school
      if (user?.id) {
        console.log('Updating user profile with school information...')
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ 
            school_id: school.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (updateError) {
          console.error('Error updating user profile with school:', updateError)
          // Don't fail the school creation for this
        } else {
          console.log('User profile updated with school information')
          // Refresh the profile
          await fetchUserProfile(user.id)
        }
      }

      setLoading(false)
      return { school, error: null }
    } catch (error: any) {
      console.error('Create school error:', error)
      setLoading(false)
      return { school: null, error: error.message || 'An unexpected error occurred while creating the school' }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      if (!supabase) {
        return { user: null, error: 'Supabase not configured' }
      }

      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setLoading(false)
        throw error
      }

      return { user: data.user, error: null }
    } catch (error: any) {
      setLoading(false)
      return { user: null, error: error.message }
    }
  }

  const signOut = async () => {
    if (!supabase) {
      return { error: 'Supabase not configured' }
    }

    console.log('Signing out user...')
    const { error } = await supabase.auth.signOut()
    
    if (!error) {
      setUser(null)
      setProfile(null)
      setSession(null)
      setLoading(false)
      console.log('User signed out successfully')
    } else {
      console.error('Sign out error:', error)
    }
    
    return { error }
  }

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: 'Supabase not configured' }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!supabase || !profile?.id) {
      return { error: 'Not authenticated or Supabase not configured' }
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)

      if (error) throw error

      // Refresh profile data
      await fetchUserProfile(profile.id)
      
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  return {
    user,
    profile,
    session,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    createSchool,
  }
}
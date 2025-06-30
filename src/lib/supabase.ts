import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are properly configured
const isConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-supabase-project-url.supabase.co' &&
  supabaseAnonKey !== 'your-supabase-anon-key'

if (!isConfigured) {
  console.error('Supabase configuration error:', {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isPlaceholder: supabaseUrl === 'https://your-supabase-project-url.supabase.co'
  })
}

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseConfigured = isConfigured

// Database Types
export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
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
        Insert: {
          id?: string
          name: string
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          principal_name?: string | null
          principal_email?: string | null
          logo_url?: string | null
          plan?: 'small' | 'medium' | 'large'
          student_count?: string | null
          teacher_count?: string | null
          school_code: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          principal_name?: string | null
          principal_email?: string | null
          logo_url?: string | null
          plan?: 'small' | 'medium' | 'large'
          student_count?: string | null
          teacher_count?: string | null
          school_code?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: 'developer' | 'admin' | 'teacher' | 'student' | 'parent' | 'accounting'
          school_id: string | null
          phone: string | null
          date_of_birth: string | null
          address: string | null
          profile_image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: 'developer' | 'admin' | 'teacher' | 'student' | 'parent' | 'accounting'
          school_id?: string | null
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          profile_image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: 'developer' | 'admin' | 'teacher' | 'student' | 'parent' | 'accounting'
          school_id?: string | null
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          profile_image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
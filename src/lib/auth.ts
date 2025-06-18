import { supabase } from './supabase';
import type { Database } from './supabase';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export interface AuthError {
  message: string;
  code?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'parent' | 'admin' | 'accounting' | 'developer';
  schoolId?: string; // Made optional
  dateOfBirth?: string;
  address?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email?: string;
  phone?: string;
}

class AuthService {
  // Get or create default school
  private async getDefaultSchool(): Promise<string> {
    try {
      // First, try to find an existing default school
      const { data: existingSchool, error: findError } = await supabase
        .from('schools')
        .select('id')
        .eq('name', 'Default School')
        .single();

      if (!findError && existingSchool) {
        return existingSchool.id;
      }

      // If no default school exists, create one
      const { data: newSchool, error: createError } = await supabase
        .from('schools')
        .insert({
          name: 'Default School',
          address: '123 Education Street',
          phone: '+1 (555) 123-4567',
          email: 'admin@defaultschool.edu',
          settings: {}
        })
        .select('id')
        .single();

      if (createError) {
        throw createError;
      }

      return newSchool.id;
    } catch (error) {
      console.error('Error getting/creating default school:', error);
      // Fallback: generate a UUID for the school
      const { data } = await supabase.rpc('gen_random_uuid');
      return data || '11111111-1111-1111-1111-111111111111';
    }
  }

  // Sign up with email and password
  async signUp(data: SignUpData): Promise<{ user: any; profile: UserProfile | null; error: AuthError | null }> {
    try {
      // Get or create default school
      const schoolId = data.schoolId || await this.getDefaultSchool();

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
          }
        }
      });

      if (authError) {
        return { user: null, profile: null, error: { message: authError.message, code: authError.message } };
      }

      if (!authData.user) {
        return { user: null, profile: null, error: { message: 'Failed to create user account' } };
      }

      // Create user profile
      const profileData = {
        id: authData.user.id,
        school_id: schoolId, // Now using a proper UUID
        role: data.role,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
        date_of_birth: data.dateOfBirth || null,
        is_active: true,
        metadata: {}
      };

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) {
        // Clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { user: null, profile: null, error: { message: 'Failed to create user profile', code: profileError.code } };
      }

      return { user: authData.user, profile, error: null };
    } catch (error: any) {
      return { user: null, profile: null, error: { message: error.message || 'An unexpected error occurred' } };
    }
  }

  // Sign in with email and password
  async signIn(data: SignInData): Promise<{ user: any; profile: UserProfile | null; error: AuthError | null }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return { user: null, profile: null, error: { message: authError.message, code: authError.message } };
      }

      if (!authData.user) {
        return { user: null, profile: null, error: { message: 'Invalid credentials' } };
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        return { user: authData.user, profile: null, error: { message: 'Failed to fetch user profile' } };
      }

      return { user: authData.user, profile, error: null };
    } catch (error: any) {
      return { user: null, profile: null, error: { message: error.message || 'An unexpected error occurred' } };
    }
  }

  // Sign out
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: { message: error.message, code: error.message } };
      }
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  }

  // Reset password via email
  async resetPasswordEmail(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error: { message: error.message, code: error.message } };
      }

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  }

  // Reset password via SMS (using phone number)
  async resetPasswordSMS(phone: string): Promise<{ error: AuthError | null }> {
    try {
      // First, find user by phone number
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('phone', phone)
        .limit(1);

      if (profileError || !profiles || profiles.length === 0) {
        return { error: { message: 'Phone number not found in our records' } };
      }

      // Generate a 6-digit reset code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store the reset code temporarily (you might want to use a separate table for this)
      const { error: codeError } = await supabase
        .from('user_profiles')
        .update({ 
          metadata: { 
            reset_code: resetCode, 
            reset_code_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
          } 
        })
        .eq('phone', phone);

      if (codeError) {
        return { error: { message: 'Failed to generate reset code' } };
      }

      // Here you would integrate with an SMS service like Twilio
      // For now, we'll simulate sending SMS
      console.log(`SMS Reset Code for ${phone}: ${resetCode}`);
      
      // In production, you would call your SMS service here:
      // await this.sendSMS(phone, `Your password reset code is: ${resetCode}`);

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  }

  // Verify SMS reset code and update password
  async verifyResetCodeAndUpdatePassword(phone: string, code: string, newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      // Get user profile with reset code
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('phone', phone)
        .single();

      if (profileError || !profile) {
        return { error: { message: 'Phone number not found' } };
      }

      const metadata = profile.metadata as any;
      if (!metadata?.reset_code || metadata.reset_code !== code) {
        return { error: { message: 'Invalid reset code' } };
      }

      // Check if code is expired
      const expiresAt = new Date(metadata.reset_code_expires);
      if (expiresAt < new Date()) {
        return { error: { message: 'Reset code has expired' } };
      }

      // Update password using admin API (you'll need service role key for this)
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        profile.id,
        { password: newPassword }
      );

      if (updateError) {
        return { error: { message: 'Failed to update password' } };
      }

      // Clear reset code
      await supabase
        .from('user_profiles')
        .update({ 
          metadata: { 
            ...metadata, 
            reset_code: null, 
            reset_code_expires: null 
          } 
        })
        .eq('id', profile.id);

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  }

  // Update password for authenticated user
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { error: { message: error.message, code: error.message } };
      }

      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  }

  // Get current session
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        return { session: null, error: { message: error.message } };
      }
      return { session, error: null };
    } catch (error: any) {
      return { session: null, error: { message: error.message || 'An unexpected error occurred' } };
    }
  }

  // Get current user profile
  async getCurrentUserProfile(): Promise<{ profile: UserProfile | null; error: AuthError | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { profile: null, error: { message: 'No authenticated user' } };
      }

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        return { profile: null, error: { message: 'Failed to fetch user profile' } };
      }

      return { profile, error: null };
    } catch (error: any) {
      return { profile: null, error: { message: error.message || 'An unexpected error occurred' } };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Helper method to send SMS (integrate with your SMS provider)
  private async sendSMS(phone: string, message: string): Promise<boolean> {
    // Integrate with SMS service like Twilio, AWS SNS, etc.
    // Example with Twilio:
    /*
    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message })
      });
      return response.ok;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
    */
    
    // For development, just log the message
    console.log(`SMS to ${phone}: ${message}`);
    return true;
  }
}

export const authService = new AuthService();
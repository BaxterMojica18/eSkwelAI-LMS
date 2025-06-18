import { createClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Create a service role client for admin operations
// Note: In production, this should be done server-side with proper security
const getServiceRoleClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('Service role key not found. Please add VITE_SUPABASE_SERVICE_ROLE_KEY to your .env file');
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

interface TestUser {
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const testUsers: TestUser[] = [
  {
    email: 'developer@eskwelai.com',
    password: 'DevPass123!',
    role: 'developer',
    firstName: 'Alex',
    lastName: 'Developer',
    phone: '+1 (555) 100-0001'
  },
  {
    email: 'teacher@eskwelai.com',
    password: 'TeachPass123!',
    role: 'teacher',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+1 (555) 100-0002'
  },
  {
    email: 'student@eskwelai.com',
    password: 'StudentPass123!',
    role: 'student',
    firstName: 'Emma',
    lastName: 'Wilson',
    phone: '+1 (555) 100-0003'
  },
  {
    email: 'parent@eskwelai.com',
    password: 'ParentPass123!',
    role: 'parent',
    firstName: 'Michael',
    lastName: 'Wilson',
    phone: '+1 (555) 100-0004'
  },
  {
    email: 'accounting@eskwelai.com',
    password: 'AccountPass123!',
    role: 'accounting',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    phone: '+1 (555) 100-0005'
  }
];

// Helper function to get or create default school
const getDefaultSchool = async () => {
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
    // Return a fallback UUID
    return '11111111-1111-1111-1111-111111111111';
  }
};

export const createTestAuthUsers = async () => {
  console.log('🚀 Creating test authentication users...');
  
  try {
    const serviceSupabase = getServiceRoleClient();
    console.log('✅ Service role client initialized');
  } catch (error: any) {
    console.error('❌ Failed to initialize service role client:', error.message);
    return [{ 
      email: 'Service Setup', 
      success: false, 
      error: 'Service role key not configured. Please add VITE_SUPABASE_SERVICE_ROLE_KEY to your .env file' 
    }];
  }
  
  const serviceSupabase = getServiceRoleClient();
  const results = [];
  
  // Get or create default school
  const defaultSchoolId = await getDefaultSchool();
  console.log(`📚 Using school ID: ${defaultSchoolId}`);
  
  for (const user of testUsers) {
    try {
      console.log(`Creating auth user for ${user.email}...`);
      
      // Create the auth user using admin API
      const { data, error } = await serviceSupabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          role: user.role
        }
      });

      if (error) {
        console.error(`❌ Error creating ${user.email}:`, error.message);
        results.push({ email: user.email, success: false, error: error.message });
        continue;
      }

      if (!data.user) {
        console.error(`❌ No user data returned for ${user.email}`);
        results.push({ email: user.email, success: false, error: 'No user data returned' });
        continue;
      }

      console.log(`✅ Successfully created auth user for ${user.email}`);
      console.log(`   User ID: ${data.user.id}`);
      
      // Create user profile with proper UUID school_id
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          school_id: defaultSchoolId, // Using proper UUID
          role: user.role as any,
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          phone: user.phone,
          is_active: true,
          metadata: {
            auth_user_created: true,
            auth_user_id: data.user.id,
            temp_profile: false,
            auth_user_needed: false
          }
        });

      if (profileError) {
        console.error(`❌ Error creating profile for ${user.email}:`, profileError.message);
        results.push({ 
          email: user.email, 
          success: false, 
          error: `Auth user created but profile creation failed: ${profileError.message}` 
        });
      } else {
        console.log(`✅ Profile created for ${user.email}`);
        results.push({ 
          email: user.email, 
          success: true, 
          authId: data.user.id,
          schoolId: defaultSchoolId,
          message: 'Auth user and profile created successfully'
        });
      }
    } catch (error: any) {
      console.error(`❌ Unexpected error for ${user.email}:`, error.message);
      results.push({ email: user.email, success: false, error: error.message });
    }
  }

  console.log('\n📊 Summary:');
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.email} - Created successfully`);
    } else {
      console.log(`❌ ${result.email} - Failed: ${result.error}`);
    }
  });

  return results;
};

// Helper function to check if users already exist
export const checkExistingUsers = async () => {
  console.log('🔍 Checking for existing test users...');
  
  const results = [];
  
  for (const user of testUsers) {
    try {
      // Check profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, email, role, metadata, school_id')
        .eq('email', user.email)
        .single();

      if (profileError) {
        console.log(`❌ ${user.email} - Profile not found`);
        results.push({ email: user.email, profileExists: false, authExists: false });
        continue;
      }

      console.log(`✅ ${user.email} - Profile exists (ID: ${profile.id}, School: ${profile.school_id})`);
      
      // Check if auth user exists by trying to get user info
      try {
        const serviceSupabase = getServiceRoleClient();
        const { data: authUser, error: authError } = await serviceSupabase.auth.admin.getUserById(profile.id);
        
        if (authError || !authUser.user) {
          console.log(`⚠️ ${user.email} - Profile exists but no auth user found`);
          results.push({ email: user.email, profileExists: true, authExists: false, profileId: profile.id });
        } else {
          console.log(`✅ ${user.email} - Both profile and auth user exist`);
          results.push({ email: user.email, profileExists: true, authExists: true, profileId: profile.id, authId: authUser.user.id });
        }
      } catch (error) {
        console.log(`⚠️ ${user.email} - Could not check auth user (service role needed)`);
        results.push({ email: user.email, profileExists: true, authExists: 'unknown', profileId: profile.id });
      }
    } catch (error: any) {
      console.log(`❌ ${user.email} - Error checking: ${error.message}`);
      results.push({ email: user.email, profileExists: false, authExists: false, error: error.message });
    }
  }

  return results;
};

// Helper function to clean up test users (for development)
export const cleanupTestUsers = async () => {
  console.log('🧹 Cleaning up test users...');
  
  try {
    const serviceSupabase = getServiceRoleClient();
    const results = [];
    
    for (const user of testUsers) {
      try {
        // Get the current profile to find the auth user ID
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('email', user.email)
          .single();

        if (profile) {
          // Delete auth user
          const { error: authError } = await serviceSupabase.auth.admin.deleteUser(profile.id);
          if (authError) {
            console.error(`❌ Error deleting auth user for ${user.email}:`, authError.message);
          } else {
            console.log(`✅ Deleted auth user for ${user.email}`);
          }
        }

        // Delete profile (this will cascade due to foreign key)
        const { error: profileError } = await supabase
          .from('user_profiles')
          .delete()
          .eq('email', user.email);

        if (profileError) {
          console.error(`❌ Error deleting profile for ${user.email}:`, profileError.message);
          results.push({ email: user.email, success: false, error: profileError.message });
        } else {
          console.log(`✅ Deleted profile for ${user.email}`);
          results.push({ email: user.email, success: true });
        }
      } catch (error: any) {
        console.error(`❌ Error cleaning up ${user.email}:`, error.message);
        results.push({ email: user.email, success: false, error: error.message });
      }
    }

    return results;
  } catch (error: any) {
    console.error('❌ Cleanup failed:', error.message);
    return [{ email: 'Cleanup', success: false, error: error.message }];
  }
};

// Export the test users data for reference
export { testUsers };
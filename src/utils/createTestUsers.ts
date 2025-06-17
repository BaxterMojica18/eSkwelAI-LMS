import { supabase } from '../lib/supabase';

interface TestUser {
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  profileId: string;
}

const testUsers: TestUser[] = [
  {
    email: 'developer@eskwelai.com',
    password: 'DevPass123!',
    role: 'developer',
    firstName: 'Alex',
    lastName: 'Developer',
    profileId: '10000000-0000-0000-0000-000000000001'
  },
  {
    email: 'teacher@eskwelai.com',
    password: 'TeachPass123!',
    role: 'teacher',
    firstName: 'Sarah',
    lastName: 'Johnson',
    profileId: '10000000-0000-0000-0000-000000000002'
  },
  {
    email: 'student@eskwelai.com',
    password: 'StudentPass123!',
    role: 'student',
    firstName: 'Emma',
    lastName: 'Wilson',
    profileId: '10000000-0000-0000-0000-000000000003'
  },
  {
    email: 'parent@eskwelai.com',
    password: 'ParentPass123!',
    role: 'parent',
    firstName: 'Michael',
    lastName: 'Wilson',
    profileId: '10000000-0000-0000-0000-000000000004'
  },
  {
    email: 'accounting@eskwelai.com',
    password: 'AccountPass123!',
    role: 'accounting',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    profileId: '10000000-0000-0000-0000-000000000005'
  }
];

export const createTestAuthUsers = async () => {
  console.log('🚀 Creating test authentication users...');
  
  const results = [];
  
  for (const user of testUsers) {
    try {
      console.log(`Creating auth user for ${user.email}...`);
      
      // Create the auth user
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            first_name: user.firstName,
            last_name: user.lastName,
            role: user.role
          }
        }
      });

      if (error) {
        console.error(`❌ Error creating ${user.email}:`, error.message);
        results.push({ email: user.email, success: false, error: error.message });
      } else if (data.user) {
        console.log(`✅ Successfully created auth user for ${user.email}`);
        console.log(`   User ID: ${data.user.id}`);
        
        // Update the user profile with the correct auth user ID
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ id: data.user.id })
          .eq('id', user.profileId);

        if (updateError) {
          console.error(`❌ Error updating profile for ${user.email}:`, updateError.message);
          results.push({ 
            email: user.email, 
            success: false, 
            error: `Auth user created but profile update failed: ${updateError.message}` 
          });
        } else {
          console.log(`✅ Profile updated for ${user.email}`);
          results.push({ 
            email: user.email, 
            success: true, 
            authId: data.user.id,
            profileId: user.profileId
          });
        }
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
  
  for (const user of testUsers) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, role')
        .eq('email', user.email)
        .single();

      if (error) {
        console.log(`❌ ${user.email} - Profile not found`);
      } else {
        console.log(`✅ ${user.email} - Profile exists (ID: ${data.id})`);
      }
    } catch (error) {
      console.log(`❌ ${user.email} - Error checking profile`);
    }
  }
};

// Export the test users data for reference
export { testUsers };
export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  dateOfBirth: string;
  address: string;
}

// Demo users for different roles
const demoUsers = {
  'developer@demo.com': {
    id: 'dev-001',
    email: 'developer@demo.com',
    first_name: 'Alex',
    last_name: 'Developer',
    role: 'developer'
  },
  'admin@demo.com': {
    id: 'admin-001',
    email: 'admin@demo.com',
    first_name: 'Sarah',
    last_name: 'Admin',
    role: 'admin',
    school_id: 'school-001'
  },
  'teacher@demo.com': {
    id: 'teacher-001',
    email: 'teacher@demo.com',
    first_name: 'Michael',
    last_name: 'Davis',
    role: 'teacher',
    school_id: 'school-001'
  },
  'student@demo.com': {
    id: 'student-001',
    email: 'student@demo.com',
    first_name: 'Alex',
    last_name: 'Johnson',
    role: 'student',
    school_id: 'school-001'
  },
  'parent@demo.com': {
    id: 'parent-001',
    email: 'parent@demo.com',
    first_name: 'Jennifer',
    last_name: 'Smith',
    role: 'parent',
    school_id: 'school-001'
  },
  'accounting@demo.com': {
    id: 'accounting-001',
    email: 'accounting@demo.com',
    first_name: 'Lisa',
    last_name: 'Finance',
    role: 'accounting',
    school_id: 'school-001'
  }
};

class AuthService {
  async signIn(data: SignInData) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = demoUsers[data.email.toLowerCase()];
      if (user && data.password === 'demo123') {
        const profile = { ...user };
        return { user, profile, error: null };
      } else {
        return { user: null, profile: null, error: { message: 'Invalid credentials' } };
      }
    } catch (error: any) {
      return { user: null, profile: null, error: { message: error.message || 'An error occurred during sign in' } };
    }
  }

  async signUp(data: SignUpData) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if user already exists
      if (demoUsers[data.email.toLowerCase()]) {
        return { user: null, profile: null, error: { message: 'User already registered with this email' } };
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
        school_id: 'school-001' // Default school for demo
      };
      
      // In a real app, we would save this to the database
      // For demo, we'll just return the user
      return { user: newUser, profile: newUser, error: null };
    } catch (error: any) {
      return { user: null, profile: null, error: { message: error.message || 'An error occurred during sign up' } };
    }
  }

  async resetPasswordEmail(email: string) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists
      if (!demoUsers[email.toLowerCase()]) {
        return { error: { message: 'No account found with this email' } };
      }
      
      // In a real app, we would send a reset email
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'An error occurred while sending reset email' } };
    }
  }

  async resetPasswordSMS(phone: string) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would send an SMS with a code
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'An error occurred while sending SMS' } };
    }
  }

  async verifyResetCodeAndUpdatePassword(phone: string, code: string, newPassword: string) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would verify the code and update the password
      if (code !== '123456') { // Demo verification code
        return { error: { message: 'Invalid verification code' } };
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'An error occurred while updating password' } };
    }
  }
}

export const authService = new AuthService();
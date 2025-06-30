export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'developer' | 'admin' | 'teacher' | 'student' | 'parent' | 'accounting';
  school_id?: string;
  school_name?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  created_at: string;
  is_active: boolean;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

class RealAuthService {
  private currentUser: User | null = null;

  constructor() {
    // Check for existing session on initialization
    this.loadSession();
  }

  private loadSession() {
    const savedUser = localStorage.getItem('current-user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  private saveSession(user: User) {
    this.currentUser = user;
    localStorage.setItem('current-user', JSON.stringify(user));
  }

  private clearSession() {
    this.currentUser = null;
    localStorage.removeItem('current-user');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get registered users from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]');
      
      // Demo users for testing
      const demoUsers = [
        {
          id: 'demo-dev-001',
          email: 'developer@demo.com',
          first_name: 'Alex',
          last_name: 'Developer',
          role: 'developer',
          created_at: new Date().toISOString(),
          is_active: true
        },
        {
          id: 'demo-admin-001',
          email: 'admin@demo.com',
          first_name: 'Sarah',
          last_name: 'Admin',
          role: 'admin',
          school_id: 'DEM1234',
          school_name: 'Demo Elementary School',
          created_at: new Date().toISOString(),
          is_active: true
        }
      ];

      // Combine registered users with demo users
      const allUsers = [...registeredUsers, ...demoUsers];

      // Find user by email
      const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return { user: null, error: 'No account found with this email address' };
      }

      // Check password (demo password is 'demo123', registered users use their set password)
      const isValidPassword = user.password === password || 
                             (user.id.startsWith('demo-') && password === 'demo123');

      if (!isValidPassword) {
        return { user: null, error: 'Invalid password' };
      }

      if (!user.is_active) {
        return { user: null, error: 'Account is inactive. Please contact support.' };
      }

      // Create clean user object (remove password)
      const cleanUser: User = {
        id: user.id,
        email: user.email,
        first_name: user.first_name || user.firstName,
        last_name: user.last_name || user.lastName,
        role: user.role,
        school_id: user.school_id || user.schoolId,
        school_name: user.school_name || user.schoolName,
        phone: user.phone,
        date_of_birth: user.date_of_birth || user.dateOfBirth,
        address: user.address,
        created_at: user.created_at || user.registeredAt || new Date().toISOString(),
        is_active: user.is_active !== false
      };

      this.saveSession(cleanUser);
      return { user: cleanUser, error: null };

    } catch (error: any) {
      return { user: null, error: error.message || 'An error occurred during sign in' };
    }
  }

  async signUp(userData: any): Promise<AuthResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('registered-users') || '[]');

      // Check if user already exists
      const existingUser = existingUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (existingUser) {
        return { user: null, error: 'An account with this email already exists' };
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        school_id: userData.schoolId,
        school_name: userData.schoolName,
        phone: userData.phone,
        date_of_birth: userData.dateOfBirth,
        address: userData.address,
        created_at: new Date().toISOString(),
        is_active: true,
        status: 'verified' // Auto-verify for demo
      };

      // Save to localStorage
      existingUsers.push(newUser);
      localStorage.setItem('registered-users', JSON.stringify(existingUsers));

      // Create clean user object for return
      const cleanUser: User = {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        role: newUser.role,
        school_id: newUser.school_id,
        school_name: newUser.school_name,
        phone: newUser.phone,
        date_of_birth: newUser.date_of_birth,
        address: newUser.address,
        created_at: newUser.created_at,
        is_active: newUser.is_active
      };

      return { user: cleanUser, error: null };

    } catch (error: any) {
      return { user: null, error: error.message || 'An error occurred during registration' };
    }
  }

  async signOut(): Promise<void> {
    this.clearSession();
  }

  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists
      const registeredUsers = JSON.parse(localStorage.getItem('registered-users') || '[]');
      const user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return { error: 'No account found with this email address' };
      }

      // In real app, would send reset email
      return { error: null };

    } catch (error: any) {
      return { error: error.message || 'An error occurred while sending reset email' };
    }
  }
}

export const realAuthService = new RealAuthService();
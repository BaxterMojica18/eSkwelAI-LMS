import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'developer' | 'admin' | 'teacher' | 'student' | 'parent' | 'accounting';
  school_id?: string;
  profile_image_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Demo users for different roles
  const demoUsers: Record<string, User> = {
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

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('ai-lms-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = demoUsers[email.toLowerCase()];
    if (user && password === 'demo123') {
      setUser(user);
      localStorage.setItem('ai-lms-user', JSON.stringify(user));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setLoading(false);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('ai-lms-user');
  };

  const value = {
    user,
    loading,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
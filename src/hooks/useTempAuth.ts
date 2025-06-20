import { useState, useEffect } from 'react';

interface TempUser {
  id: string;
  email: string;
  role: 'accounting' | 'teacher' | 'parent';
  first_name: string;
  last_name: string;
  school_id: string;
}

interface TempProfile extends TempUser {
  phone?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
}

export const useTempAuth = () => {
  const [user, setUser] = useState<TempUser | null>(null);
  const [profile, setProfile] = useState<TempProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(true);

  useEffect(() => {
    // Check if there's a stored user in localStorage
    const storedUser = localStorage.getItem('tempUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setProfile({
          ...userData,
          phone: '+1 (555) 123-4567',
          address: '123 Demo Street',
          is_active: true,
          created_at: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('tempUser');
      }
    }
  }, []);

  const signIn = async (userData: TempUser) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(userData);
    const profileData = {
      ...userData,
      phone: '+1 (555) 123-4567',
      address: '123 Demo Street',
      is_active: true,
      created_at: new Date().toISOString()
    };
    setProfile(profileData);
    
    // Store in localStorage for persistence
    localStorage.setItem('tempUser', JSON.stringify(userData));
    
    setLoading(false);
    return { user: userData, profile: profileData, error: null };
  };

  const signOut = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setUser(null);
    setProfile(null);
    localStorage.removeItem('tempUser');
    
    setLoading(false);
    return { error: null };
  };

  return {
    user,
    profile,
    loading,
    initialized,
    signIn,
    signOut,
    isAuthenticated: !!user && !!profile,
    isStudent: profile?.role === 'student',
    isTeacher: profile?.role === 'teacher',
    isParent: profile?.role === 'parent',
    isAdmin: profile?.role === 'admin',
    isAccounting: profile?.role === 'accounting',
    isDeveloper: profile?.role === 'developer',
  };
};
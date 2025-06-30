import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  school_id?: string;
  school_name?: string;
}

interface Profile {
  id: string;
  role: string;
  first_name: string;
  last_name: string;
  email: string;
  school_id?: string;
  school_name?: string;
}

export function useTempAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('ai-lms-user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setProfile({
        id: parsedUser.id,
        role: parsedUser.role,
        first_name: parsedUser.first_name,
        last_name: parsedUser.last_name,
        email: parsedUser.email,
        school_id: parsedUser.school_id,
        school_name: parsedUser.school_name
      });
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const signIn = async (userData: any) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create user and profile objects
    const newUser = {
      id: userData.id || `user-${Date.now()}`,
      email: userData.email,
      role: userData.role,
      first_name: userData.first_name,
      last_name: userData.last_name,
      school_id: userData.school_id,
      school_name: userData.school_name
    };
    
    const newProfile = {
      id: newUser.id,
      role: newUser.role,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      school_id: newUser.school_id,
      school_name: newUser.school_name
    };
    
    setUser(newUser);
    setProfile(newProfile);
    setIsAuthenticated(true);
    localStorage.setItem('ai-lms-user', JSON.stringify(newUser));
    
    setLoading(false);
    return { user: newUser, profile: newProfile };
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ai-lms-user');
  };

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    signIn,
    signOut
  };
}
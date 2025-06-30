import { useState, useEffect } from 'react';
import { realAuthService, User } from '../lib/realAuth';

export function useRealAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const currentUser = realAuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { user: signedInUser, error } = await realAuthService.signIn(email, password);
    
    if (signedInUser) {
      setUser(signedInUser);
    }
    
    setLoading(false);
    return { user: signedInUser, error };
  };

  const signUp = async (userData: any) => {
    setLoading(true);
    const { user: newUser, error } = await realAuthService.signUp(userData);
    
    if (newUser) {
      setUser(newUser);
    }
    
    setLoading(false);
    return { user: newUser, error };
  };

  const signOut = async () => {
    await realAuthService.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    return await realAuthService.resetPassword(email);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword
  };
}
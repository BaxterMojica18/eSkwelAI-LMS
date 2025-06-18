import { useState, useEffect } from 'react';
import { authService } from '../lib/auth';
import type { Database } from '../lib/supabase';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get current session
        const { session, error } = await authService.getCurrentSession();
        
        if (error) {
          console.error('Session error:', error);
          if (mounted) {
            setLoading(false);
            setInitialized(true);
          }
          return;
        }

        if (session?.user && mounted) {
          setUser(session.user);
          
          // Get user profile with retry logic for RLS policy issues
          let retryCount = 0;
          const maxRetries = 3;
          
          while (retryCount < maxRetries) {
            try {
              const { profile: userProfile, error: profileError } = await authService.getCurrentUserProfile();
              
              if (profileError) {
                if (profileError.message.includes('infinite recursion') && retryCount < maxRetries - 1) {
                  console.warn(`Profile fetch attempt ${retryCount + 1} failed with recursion error, retrying...`);
                  retryCount++;
                  // Wait a bit before retrying
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  continue;
                } else {
                  console.error('Profile error:', profileError);
                  break;
                }
              } else if (userProfile) {
                setProfile(userProfile);
                break;
              }
            } catch (err) {
              console.error('Profile fetch error:', err);
              if (retryCount < maxRetries - 1) {
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
              }
              break;
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.id);

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          
          // Get user profile with retry logic
          let retryCount = 0;
          const maxRetries = 3;
          
          while (retryCount < maxRetries) {
            try {
              const { profile: userProfile, error } = await authService.getCurrentUserProfile();
              
              if (error) {
                if (error.message.includes('infinite recursion') && retryCount < maxRetries - 1) {
                  console.warn(`Profile fetch attempt ${retryCount + 1} failed with recursion error, retrying...`);
                  retryCount++;
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  continue;
                } else {
                  console.error('Profile fetch error:', error);
                  break;
                }
              } else if (userProfile) {
                setProfile(userProfile);
                break;
              }
            } catch (err) {
              console.error('Profile fetch error:', err);
              if (retryCount < maxRetries - 1) {
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
              }
              break;
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await authService.signIn({ email, password });
    
    if (result.user && result.profile) {
      setUser(result.user);
      setProfile(result.profile);
    }
    
    setLoading(false);
    return result;
  };

  const signUp = async (signUpData: any) => {
    setLoading(true);
    const result = await authService.signUp(signUpData);
    
    if (result.user && result.profile) {
      setUser(result.user);
      setProfile(result.profile);
    }
    
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    const result = await authService.signOut();
    
    if (!result.error) {
      setUser(null);
      setProfile(null);
    }
    
    setLoading(false);
    return result;
  };

  const resetPasswordEmail = async (email: string) => {
    return await authService.resetPasswordEmail(email);
  };

  const resetPasswordSMS = async (phone: string) => {
    return await authService.resetPasswordSMS(phone);
  };

  const verifyResetCode = async (phone: string, code: string, newPassword: string) => {
    return await authService.verifyResetCodeAndUpdatePassword(phone, code, newPassword);
  };

  const updatePassword = async (newPassword: string) => {
    return await authService.updatePassword(newPassword);
  };

  return {
    user,
    profile,
    loading: loading || !initialized,
    initialized,
    signIn,
    signUp,
    signOut,
    resetPasswordEmail,
    resetPasswordSMS,
    verifyResetCode,
    updatePassword,
    isAuthenticated: !!user && !!profile,
    isStudent: profile?.role === 'student',
    isTeacher: profile?.role === 'teacher',
    isParent: profile?.role === 'parent',
    isAdmin: profile?.role === 'admin',
    isAccounting: profile?.role === 'accounting',
    isDeveloper: profile?.role === 'developer',
  };
};
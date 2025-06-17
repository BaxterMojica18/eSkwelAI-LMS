import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

// Authentication hook
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState<Tables['user_profiles']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, profileData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (data.user && !error) {
      // Create profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          email,
          ...profileData,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };
};

// School levels hook
export const useSchoolLevels = (schoolId?: string) => {
  const [levels, setLevels] = useState<Tables['school_levels']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) return;

    const fetchLevels = async () => {
      try {
        const { data, error } = await supabase
          .from('school_levels')
          .select('*')
          .eq('school_id', schoolId)
          .order('order_index');

        if (error) throw error;
        setLevels(data || []);
      } catch (error) {
        console.error('Error fetching school levels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, [schoolId]);

  const createLevel = async (levelData: Tables['school_levels']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('school_levels')
        .insert(levelData)
        .select()
        .single();

      if (error) throw error;
      setLevels(prev => [...prev, data]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return { levels, loading, createLevel };
};

// Sections hook
export const useSections = (levelId?: string) => {
  const [sections, setSections] = useState<Tables['sections']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!levelId) return;

    const fetchSections = async () => {
      try {
        const { data, error } = await supabase
          .from('sections')
          .select('*')
          .eq('school_level_id', levelId)
          .order('section_number');

        if (error) throw error;
        setSections(data || []);
      } catch (error) {
        console.error('Error fetching sections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [levelId]);

  const createSection = async (sectionData: Tables['sections']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .insert(sectionData)
        .select()
        .single();

      if (error) throw error;
      setSections(prev => [...prev, data]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return { sections, loading, createSection };
};

// Learning modules hook
export const useLearningModules = (sectionId?: string) => {
  const [modules, setModules] = useState<Tables['learning_modules']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sectionId) return;

    const fetchModules = async () => {
      try {
        const { data, error } = await supabase
          .from('learning_modules')
          .select('*')
          .eq('section_id', sectionId)
          .order('order_index');

        if (error) throw error;
        setModules(data || []);
      } catch (error) {
        console.error('Error fetching learning modules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [sectionId]);

  const createModule = async (moduleData: Tables['learning_modules']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('learning_modules')
        .insert(moduleData)
        .select()
        .single();

      if (error) throw error;
      setModules(prev => [...prev, data]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return { modules, loading, createModule };
};

// Assessments hook
export const useAssessments = (sectionId?: string) => {
  const [assessments, setAssessments] = useState<Tables['assessments']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sectionId) return;

    const fetchAssessments = async () => {
      try {
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('section_id', sectionId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAssessments(data || []);
      } catch (error) {
        console.error('Error fetching assessments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [sectionId]);

  const createAssessment = async (assessmentData: Tables['assessments']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .insert(assessmentData)
        .select()
        .single();

      if (error) throw error;
      setAssessments(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return { assessments, loading, createAssessment };
};

// Students hook (for teachers to see their students)
export const useStudents = (sectionId?: string) => {
  const [students, setStudents] = useState<Tables['user_profiles']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sectionId) return;

    const fetchStudents = async () => {
      try {
        const { data, error } = await supabase
          .from('enrollments')
          .select(`
            student_id,
            user_profiles!enrollments_student_id_fkey (*)
          `)
          .eq('section_id', sectionId)
          .eq('is_active', true);

        if (error) throw error;
        
        const studentProfiles = data?.map(enrollment => 
          (enrollment as any).user_profiles
        ).filter(Boolean) || [];
        
        setStudents(studentProfiles);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [sectionId]);

  return { students, loading };
};

// Payments hook
export const usePayments = (studentId?: string) => {
  const [payments, setPayments] = useState<Tables['payments']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;

    const fetchPayments = async () => {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .eq('student_id', studentId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPayments(data || []);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [studentId]);

  const createPayment = async (paymentData: Tables['payments']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single();

      if (error) throw error;
      setPayments(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return { payments, loading, createPayment };
};
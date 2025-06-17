import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          phone: string | null;
          email: string | null;
          logo_url: string | null;
          settings: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          logo_url?: string | null;
          settings?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          logo_url?: string | null;
          settings?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      school_levels: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          description: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          description?: string | null;
          order_index?: number;
          created_at?: string;
        };
      };
      sections: {
        Row: {
          id: string;
          school_level_id: string;
          name: string;
          section_number: number;
          capacity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_level_id: string;
          name: string;
          section_number?: number;
          capacity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_level_id?: string;
          name?: string;
          section_number?: number;
          capacity?: number;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          school_id: string;
          role: 'student' | 'teacher' | 'parent' | 'admin' | 'accounting' | 'developer';
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          address: string | null;
          date_of_birth: string | null;
          profile_image_url: string | null;
          is_active: boolean;
          metadata: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          school_id: string;
          role: 'student' | 'teacher' | 'parent' | 'admin' | 'accounting' | 'developer';
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          address?: string | null;
          date_of_birth?: string | null;
          profile_image_url?: string | null;
          is_active?: boolean;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          role?: 'student' | 'teacher' | 'parent' | 'admin' | 'accounting' | 'developer';
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          address?: string | null;
          date_of_birth?: string | null;
          profile_image_url?: string | null;
          is_active?: boolean;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          student_id: string;
          section_id: string;
          school_year: string;
          enrollment_date: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          section_id: string;
          school_year: string;
          enrollment_date?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          section_id?: string;
          school_year?: string;
          enrollment_date?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      learning_modules: {
        Row: {
          id: string;
          section_id: string;
          teacher_id: string;
          title: string;
          description: string | null;
          type: 'pdf' | 'video';
          content_url: string;
          file_size: number | null;
          duration_minutes: number | null;
          order_index: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          teacher_id: string;
          title: string;
          description?: string | null;
          type: 'pdf' | 'video';
          content_url: string;
          file_size?: number | null;
          duration_minutes?: number | null;
          order_index?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          teacher_id?: string;
          title?: string;
          description?: string | null;
          type?: 'pdf' | 'video';
          content_url?: string;
          file_size?: number | null;
          duration_minutes?: number | null;
          order_index?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      assessments: {
        Row: {
          id: string;
          section_id: string;
          teacher_id: string;
          title: string;
          description: string | null;
          type: 'quiz' | 'exam' | 'assessment';
          instructions: string | null;
          time_limit_minutes: number | null;
          total_points: number;
          passing_score: number;
          is_published: boolean;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          teacher_id: string;
          title: string;
          description?: string | null;
          type: 'quiz' | 'exam' | 'assessment';
          instructions?: string | null;
          time_limit_minutes?: number | null;
          total_points?: number;
          passing_score?: number;
          is_published?: boolean;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          teacher_id?: string;
          title?: string;
          description?: string | null;
          type?: 'quiz' | 'exam' | 'assessment';
          instructions?: string | null;
          time_limit_minutes?: number | null;
          total_points?: number;
          passing_score?: number;
          is_published?: boolean;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          assessment_id: string;
          question_text: string;
          type: 'multiple_choice' | 'fill_blank' | 'enumeration';
          options: any;
          correct_answers: any;
          points: number;
          order_index: number;
          explanation: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          assessment_id: string;
          question_text: string;
          type: 'multiple_choice' | 'fill_blank' | 'enumeration';
          options?: any;
          correct_answers: any;
          points?: number;
          order_index?: number;
          explanation?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          assessment_id?: string;
          question_text?: string;
          type?: 'multiple_choice' | 'fill_blank' | 'enumeration';
          options?: any;
          correct_answers?: any;
          points?: number;
          order_index?: number;
          explanation?: string | null;
          created_at?: string;
        };
      };
      grades: {
        Row: {
          id: string;
          student_id: string;
          assessment_id: string;
          section_id: string;
          total_points: number;
          points_earned: number;
          percentage: number;
          letter_grade: string | null;
          is_passed: boolean;
          submitted_at: string | null;
          graded_at: string;
          graded_by: string | null;
          feedback: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          assessment_id: string;
          section_id: string;
          total_points: number;
          points_earned: number;
          percentage: number;
          letter_grade?: string | null;
          is_passed?: boolean;
          submitted_at?: string | null;
          graded_at?: string;
          graded_by?: string | null;
          feedback?: string | null;
        };
        Update: {
          id?: string;
          student_id?: string;
          assessment_id?: string;
          section_id?: string;
          total_points?: number;
          points_earned?: number;
          percentage?: number;
          letter_grade?: string | null;
          is_passed?: boolean;
          submitted_at?: string | null;
          graded_at?: string;
          graded_by?: string | null;
          feedback?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          payer_id: string | null;
          amount: number;
          currency: string;
          description: string;
          payment_type: string;
          status: 'pending' | 'paid' | 'overdue' | 'cancelled';
          due_date: string | null;
          paid_date: string | null;
          payment_method: string | null;
          transaction_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          payer_id?: string | null;
          amount: number;
          currency?: string;
          description: string;
          payment_type: string;
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
          due_date?: string | null;
          paid_date?: string | null;
          payment_method?: string | null;
          transaction_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          student_id?: string;
          payer_id?: string | null;
          amount?: number;
          currency?: string;
          description?: string;
          payment_type?: string;
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
          due_date?: string | null;
          paid_date?: string | null;
          payment_method?: string | null;
          transaction_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          school_id: string;
          author_id: string;
          title: string;
          content: string;
          target_audience: string[];
          section_ids: string[];
          attachment_url: string | null;
          attachment_type: string | null;
          is_pinned: boolean;
          is_published: boolean;
          published_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          author_id: string;
          title: string;
          content: string;
          target_audience?: string[];
          section_ids?: string[];
          attachment_url?: string | null;
          attachment_type?: string | null;
          is_pinned?: boolean;
          is_published?: boolean;
          published_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          author_id?: string;
          title?: string;
          content?: string;
          target_audience?: string[];
          section_ids?: string[];
          attachment_url?: string | null;
          attachment_type?: string | null;
          is_pinned?: boolean;
          is_published?: boolean;
          published_at?: string;
          created_at?: string;
        };
      };
    };
  };
}
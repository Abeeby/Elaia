import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables Supabase manquantes ! Veuillez configurer SUPABASE_URL et SUPABASE_ANON_KEY');
}

// Client public pour les opérations côté client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin pour les opérations serveur (avec tous les droits)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Types pour TypeScript
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone?: string;
          address?: string;
          city?: string;
          postal_code?: string;
          role: 'client' | 'admin' | 'instructor';
          credits: number;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      subscription_plans: {
        Row: {
          id: string;
          name: string;
          type: 'credits' | 'monthly';
          price: number;
          credits?: number;
          max_bookings_per_week?: number;
          description?: string;
          validity?: string;
          is_active: boolean;
          created_at: string;
        };
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          start_date: string;
          end_date?: string;
          is_active: boolean;
          created_at: string;
        };
      };
      class_types: {
        Row: {
          id: string;
          name: string;
          description?: string;
          duration: number;
          credits_required: number;
          max_participants: number;
          is_active: boolean;
          created_at: string;
        };
      };
      class_sessions: {
        Row: {
          id: string;
          class_type_id: string;
          instructor_id?: string;
          start_time: string;
          end_time: string;
          available_spots: number;
          created_at: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          class_session_id: string;
          status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
          credits_used: number;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}; 
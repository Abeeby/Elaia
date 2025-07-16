import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variables Supabase manquantes. Veuillez configurer VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Types TypeScript pour les tables
export interface User {
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
}

export interface ClassSession {
  id: string;
  class_type_id: string;
  instructor_id?: string;
  start_time: string;
  end_time: string;
  available_spots: number;
  created_at: string;
  class_types?: ClassType;
  users?: User;
}

export interface ClassType {
  id: string;
  name: string;
  description?: string;
  duration: number;
  credits_required: number;
  max_participants: number;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  class_session_id: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  credits_used: number;
  created_at: string;
  updated_at: string;
  users?: User;
  class_sessions?: ClassSession;
} 
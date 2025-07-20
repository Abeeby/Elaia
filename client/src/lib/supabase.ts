import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration manquante. Mode démo activé.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Helper functions pour l'authentification
export const supabaseAuth = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Récupérer les infos utilisateur depuis la table users
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (userError) throw userError;
      
      return {
        user: userData,
        session: data.session,
      };
    }
    
    return data;
  },
  
  async signUp(email: string, password: string, metadata: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    
    if (error) throw error;
    return data;
  },
  
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return userData;
    }
    
    return null;
  },
  
  onAuthStateChange(callback: (event: any, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

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
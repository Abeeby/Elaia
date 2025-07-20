import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Créer un client Supabase même avec des valeurs par défaut
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Désactiver la persistence en mode démo
    autoRefreshToken: false,
  }
});

// Helper functions pour l'authentification
export const supabaseAuth = {
  async signIn(email: string, password: string) {
    // En mode démo, toujours retourner une erreur pour forcer l'utilisation du mode démo dans authStore
    throw new Error('Supabase non configuré - Mode démo activé');
  },
  
  async signUp(email: string, password: string, metadata: any) {
    throw new Error('Supabase non configuré - Mode démo activé');
  },
  
  async signOut() {
    // Ne rien faire en mode démo
  },
  
  async getUser() {
    // Toujours retourner null en mode démo
    return null;
  },
  
  onAuthStateChange(callback: (event: any, session: any) => void) {
    // Ne rien faire en mode démo
    return {
      data: { subscription: { unsubscribe: () => {} } }
    };
  },
};

// Types TypeScript pour les tables
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          role: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string | null;
        };
      };
    };
  };
}

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
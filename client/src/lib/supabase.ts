import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Vérifier si Supabase est configuré
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('Supabase non configuré - Mode démo activé');
}

// Créer un client Supabase avec des valeurs par défaut si nécessaire
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: isSupabaseConfigured,
      autoRefreshToken: isSupabaseConfigured,
    }
  }
);

// Helper functions pour l'authentification
export const supabaseAuth = {
  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase non configuré - Mode démo activé');
    }

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
        
      if (userError) {
        // Si la table users n'existe pas ou l'utilisateur n'y est pas, utiliser les métadonnées
        return {
          user: {
            id: data.user.id,
            email: data.user.email!,
            first_name: data.user.user_metadata?.first_name || '',
            last_name: data.user.user_metadata?.last_name || '',
            phone: data.user.user_metadata?.phone || '',
            role: data.user.user_metadata?.role || 'client',
            credits: data.user.user_metadata?.credits || 0,
          },
          session: data.session,
        };
      }
      
      return {
        user: userData,
        session: data.session,
      };
    }
    
    return data;
  },
  
  async signUp(email: string, password: string, metadata: any) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase non configuré - Mode démo activé');
    }

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
    if (!isSupabaseConfigured) return;
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  async getUser() {
    if (!isSupabaseConfigured) return null;
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        // Utiliser les métadonnées si la table users n'est pas accessible
        return {
          id: user.id,
          email: user.email!,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          phone: user.user_metadata?.phone || '',
          role: user.user_metadata?.role || 'client',
          credits: user.user_metadata?.credits || 0,
        };
      }
      
      return userData;
    }
    
    return null;
  },
  
  onAuthStateChange(callback: (event: any, session: any) => void) {
    if (!isSupabaseConfigured) {
      return {
        data: { subscription: { unsubscribe: () => {} } }
      };
    }
    
    return supabase.auth.onAuthStateChange(callback);
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
  role: string;
  created_at?: string;
  updated_at?: string;
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
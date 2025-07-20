import { create } from 'zustand';
import { supabaseAuth } from '../lib/supabase';
import customToast from '../utils/toast';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  credits?: number;
  created_at?: string;
  updated_at?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  updateUser: (user: User) => void;
  initAuth: () => Promise<void>;
}

// Mode démo - utilisateurs de test
const DEMO_USERS = {
  'admin@elaiastudio.ch': {
    id: 'demo-admin',
    email: 'admin@elaiastudio.ch',
    first_name: 'Admin',
    last_name: 'ELAÏA',
    phone: '+41 22 123 45 67',
    role: 'admin',
    credits: 999,
  },
  'marie.dupont@email.com': {
    id: 'demo-client',
    email: 'marie.dupont@email.com',
    first_name: 'Marie',
    last_name: 'Dupont',
    phone: '+41 79 123 45 67',
    role: 'client',
    credits: 10,
  },
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  initAuth: async () => {
    try {
      const user = await supabaseAuth.getUser();
      if (user) {
        set({ 
          user: user as User, 
          isAuthenticated: true,
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'auth:', error);
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      // Mode démo - vérifier les comptes de test
      if (email === 'admin@elaiastudio.ch' && password === 'admin123') {
        const demoUser = DEMO_USERS['admin@elaiastudio.ch'];
        set({ 
          user: demoUser as User, 
          isAuthenticated: true,
          isLoading: false 
        });
        customToast.success('Connexion réussie (mode démo)');
        return;
      }
      
      if (email === 'marie.dupont@email.com' && password === 'client123') {
        const demoUser = DEMO_USERS['marie.dupont@email.com'];
        set({ 
          user: demoUser as User, 
          isAuthenticated: true,
          isLoading: false 
        });
        customToast.success('Connexion réussie (mode démo)');
        return;
      }

      // Tentative de connexion avec Supabase
      try {
        const { user } = await supabaseAuth.signIn(email, password);
        set({ 
          user: user as User, 
          isAuthenticated: true,
          isLoading: false 
        });
        customToast.success('Connexion réussie');
      } catch (supabaseError) {
        // Si Supabase échoue, vérifier si c'est un compte démo
        throw new Error('Email ou mot de passe incorrect');
      }
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (userData: any) => {
    set({ isLoading: true });
    try {
      // Mode démo - créer un utilisateur fictif
      const demoUser = {
        id: `demo-${Date.now()}`,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        role: 'client',
        credits: 0,
      };
      
      set({ 
        user: demoUser as User, 
        isAuthenticated: true,
        isLoading: false 
      });
      
      customToast.success('Inscription réussie (mode démo)');
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    supabaseAuth.signOut().catch(console.error);
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false 
    });
    customToast.success('Déconnexion réussie');
  },

  fetchProfile: async () => {
    try {
      const user = await supabaseAuth.getUser();
      if (user) {
        set({ user: user as User });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    }
  },

  updateProfile: async (data: any) => {
    set({ isLoading: true });
    try {
      // En mode démo, simuler la mise à jour
      const currentUser = get().user;
      if (currentUser) {
        const updatedUser = { ...currentUser, ...data };
        set({ user: updatedUser, isLoading: false });
        customToast.success('Profil mis à jour');
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateUser: (user: User) => {
    set({ user });
  },
})); 
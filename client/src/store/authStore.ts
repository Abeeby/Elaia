import { create } from 'zustand';
import { authService } from '../services/api';
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
      const token = localStorage.getItem('token');
      if (!token) return;
      const data = await authService.getProfile();
      if (data?.user) {
        set({ user: data.user as User, isAuthenticated: true, isLoading: false });
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'auth:', error);
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(email, password);
      if (response?.token && response?.user) {
        localStorage.setItem('token', response.token);
        set({ user: response.user as User, isAuthenticated: true, isLoading: false });
        customToast.success('Connexion réussie');
        return;
      }
      throw new Error('Réponse de connexion invalide');
    } catch (error: any) {
      set({ isLoading: false });
      customToast.error(error.message || 'Erreur de connexion');
      throw error;
    }
  },

  register: async (userData: any) => {
    set({ isLoading: true });
    try {
      const response = await authService.register(userData);
      if (response?.token && response?.user) {
        localStorage.setItem('token', response.token);
        set({ user: response.user as User, isAuthenticated: true, isLoading: false });
        customToast.success('Inscription réussie !');
      } else {
        throw new Error("Réponse d'inscription invalide");
      }
    } catch (error: any) {
      set({ isLoading: false });
      customToast.error(error.message || 'Erreur lors de l\'inscription');
      throw error;
    }
  },

  logout: () => {
    try { localStorage.removeItem('token'); } catch {}
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false 
    });
    customToast.success('Déconnexion réussie');
  },

  fetchProfile: async () => {
    try {
      const data = await authService.getProfile();
      if (data?.user) set({ user: data.user as User });
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
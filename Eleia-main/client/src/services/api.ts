import axios from 'axios';

const API_URL = import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5001/api';

// Créer une instance axios avec la configuration de base
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};

// Services des cours
export const classService = {
  getTypes: async () => {
    const response = await api.get('/classes/types');
    return response.data;
  },

  getSchedule: async (params?: { date?: string; view?: string }) => {
    // Cette route est publique, pas besoin de token
    const response = await axios.get(`${API_URL}/classes/schedule`, { params });
    return response.data;
  },

  getClassDetails: async (id: string) => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },

  getParticipants: async (id: string) => {
    const response = await api.get(`/classes/${id}/participants`);
    return response.data;
  },
};

// Services des réservations
export const bookingService = {
  getMyBookings: async (params?: { status?: string; timeframe?: string }) => {
    const response = await api.get('/bookings/my-bookings', { params });
    return response.data;
  },

  bookClass: async (classId: string) => {
    const response = await api.post('/bookings/book', { class_id: classId });
    return response.data;
  },

  cancelBooking: async (bookingId: string) => {
    const response = await api.post(`/bookings/cancel/${bookingId}`);
    return response.data;
  },

  joinWaitingList: async (classId: string) => {
    const response = await api.post('/bookings/waiting-list', { class_id: classId });
    return response.data;
  },
};

// Services des crédits et abonnements
export const creditService = {
  getPlans: () => api.get('/credits/plans').then(res => res.data),
  getMySubscription: () => api.get('/credits/subscription').then(res => res.data),
  subscribe: (planId: string, promoCode?: string) => 
    api.post('/credits/subscribe', { plan_id: planId, promo_code: promoCode }).then(res => res.data),
  buyCredits: (amount: number) => 
    api.post('/credits/buy', { amount }).then(res => res.data),
  getPaymentHistory: () => api.get('/credits/payments').then(res => res.data),
  getCreditHistory: () => api.get('/credits/history').then(res => res.data),
};

// Services des contrats
export const contractService = {
  getTemplate: async (planId: string) => {
    const response = await api.get(`/contracts/template/${planId}`);
    return response.data;
  },

  sign: async (subscriptionId: string, signatureData: string) => {
    const response = await api.post('/contracts/sign', {
      subscription_id: subscriptionId,
      signature_data: signatureData,
      contract_type: 'subscription',
    });
    return response.data;
  },

  getMyContracts: async () => {
    const response = await api.get('/contracts/my-contracts');
    return response.data;
  },

  download: async (contractId: string) => {
    const response = await api.get(`/contracts/download/${contractId}`);
    return response.data;
  },
};

// Services admin
export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getBookings: async (params?: { limit?: number; status?: string }) => {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  },

  getClients: async (params?: { registered_after?: string; limit?: number }) => {
    const response = await api.get('/admin/clients', { params });
    return response.data;
  },

  getClientStats: async (period: number = 30) => {
    const response = await api.get('/admin/clients/stats', { params: { period } });
    return response.data;
  },

  getUsers: async (params?: { role?: string; search?: string; page?: number; limit?: number }) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getAttendanceStats: async (startDate?: string, endDate?: string) => {
    const response = await api.get('/admin/attendance/stats', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  // Nouvelles méthodes pour la gestion des crédits
  addCredits: async (userEmail: string, credits: number) => {
    const response = await api.post('/admin/add-credits', {
      userEmail,
      credits
    });
    return response.data;
  },

  getUsersWithCredits: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
}; 
// Service mock pour le développement et la démo
export const mockAuthService = {
  register: async (userData: any) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simuler une réponse réussie
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 1,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        postal_code: userData.postal_code,
        role: 'client',
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };
  },

  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 1,
        email: email,
        first_name: 'Demo',
        last_name: 'User',
        phone: '+41791234567',
        role: 'client',
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };
  },

  getProfile: async () => {
    return {
      user: {
        id: 1,
        email: 'demo@elaia-studio.ch',
        first_name: 'Demo',
        last_name: 'User',
        phone: '+41791234567',
        role: 'client',
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      subscription: {
        id: 1,
        plan_name: 'Abonnement Mensuel',
        plan_type: 'monthly',
        credits_remaining: 8,
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        usage_stats: {
          total_bookings: 4,
          total_credits_used: 4
        }
      }
    };
  }
}; 
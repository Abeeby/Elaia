// Service de paiement Payrexx
export const paymentService = {
  // Créer un paiement Payrexx
  createPaymentSession: async (credits: number, amount: number) => {
    const response = await fetch('/api/payments/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        credits,
        amount,
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création du paiement');
    }

    return response.json();
  },

  // Rediriger vers Payrexx Checkout
  redirectToCheckout: async (paymentUrl: string) => {
    if (!paymentUrl) {
      throw new Error('URL de paiement manquante');
    }

    // Ouvrir le paiement Payrexx dans une nouvelle fenêtre ou rediriger
    window.location.href = paymentUrl;
  },

  // Vérifier le statut d'un paiement
  checkPaymentStatus: async (paymentId: string) => {
    const response = await fetch(`/api/payments/status/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la vérification du paiement');
    }

    return response.json();
  },

  // Récupérer l'historique des paiements
  getPaymentHistory: async () => {
    const response = await fetch('/api/payments/history', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de l\'historique');
    }

    return response.json();
  },

  // Calculer le prix des crédits
  calculateCreditsPrice: (credits: number): number => {
    // Même logique que côté serveur
    const prices: { [key: number]: number } = {
      5: 125 / 5,   // 25 CHF par crédit
      10: 240 / 10, // 24 CHF par crédit
      30: 660 / 30, // 22 CHF par crédit
      50: 1000 / 50, // 20 CHF par crédit
    };

    if (credits <= 5) return credits * prices[5];
    if (credits <= 10) return credits * prices[10];
    if (credits <= 30) return credits * prices[30];
    return credits * prices[50];
  },
};

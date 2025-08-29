import axios from 'axios';

interface PayrexxConfig {
  instanceName: string;
  apiKey: string;
}

// Configuration Payrexx
const payrexxConfig: PayrexxConfig = {
  instanceName: process.env.PAYREXX_INSTANCE_NAME || '',
  apiKey: process.env.PAYREXX_API_KEY || '',
};

const baseURL = `https://api.payrexx.com/v1.0/${payrexxConfig.instanceName}/`;

// Créer une instance axios pour Payrexx
const payrexxApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter la clé API
payrexxApi.interceptors.request.use((config) => {
  config.headers.Authorization = payrexxConfig.apiKey;
  return config;
});

export interface PayrexxPaymentData {
  amount: number;
  currency: string;
  credits: number;
  userEmail: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
  description?: string;
}

// Fonction pour créer un paiement Payrexx
export const createPayrexxPayment = async (data: PayrexxPaymentData) => {
  try {
    const paymentData = {
      title: `Achat de ${data.credits} crédits ELAÏA Studio`,
      description: data.description || `${data.credits} crédits pour réserver vos cours de Pilates`,
      amount: data.amount,
      currency: data.currency.toUpperCase(),
      referenceId: `credits-${data.userId}-${Date.now()}`,
      fields: {
        email: data.userEmail,
      },
      successRedirectUrl: data.successUrl,
      cancelRedirectUrl: data.cancelUrl,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Expire dans 24h
      metadata: {
        userId: data.userId,
        credits: data.credits.toString(),
        amount: data.amount.toString(),
      },
    };

    const response = await payrexxApi.post('/Invoice/', paymentData);

    if (response.data.status === 'success') {
      return {
        success: true,
        paymentId: response.data.data.id,
        paymentUrl: response.data.data.link,
        data: response.data.data,
      };
    } else {
      throw new Error('Erreur lors de la création du paiement Payrexx');
    }
  } catch (error: any) {
    console.error('Erreur création paiement Payrexx:', error.response?.data || error.message);
    throw new Error('Impossible de créer le paiement Payrexx');
  }
};

// Fonction pour vérifier le statut d'un paiement
export const checkPaymentStatus = async (paymentId: number) => {
  try {
    const response = await payrexxApi.get(`/Invoice/${paymentId}`);

    if (response.data.status === 'success') {
      const payment = response.data.data;
      return {
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        referenceId: payment.referenceId,
        paidAt: payment.paidAt,
        metadata: payment.fields || {},
      };
    } else {
      throw new Error('Erreur lors de la vérification du paiement');
    }
  } catch (error: any) {
    console.error('Erreur vérification paiement Payrexx:', error.response?.data || error.message);
    throw new Error('Impossible de vérifier le statut du paiement');
  }
};

// Fonction pour annuler un paiement
export const cancelPayment = async (paymentId: number) => {
  try {
    const response = await payrexxApi.delete(`/Invoice/${paymentId}`);

    if (response.data.status === 'success') {
      return { success: true };
    } else {
      throw new Error('Erreur lors de l\'annulation du paiement');
    }
  } catch (error: any) {
    console.error('Erreur annulation paiement Payrexx:', error.response?.data || error.message);
    throw new Error('Impossible d\'annuler le paiement');
  }
};

// Fonction pour obtenir la liste des paiements
export const getPaymentsList = async (filters?: {
  status?: string;
  limit?: number;
  offset?: number;
}) => {
  try {
    const params: any = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.limit) params.limit = filters.limit;
    if (filters?.offset) params.offset = filters.offset;

    const response = await payrexxApi.get('/Invoice/', { params });

    if (response.data.status === 'success') {
      return {
        success: true,
        payments: response.data.data,
        total: response.data.total,
      };
    } else {
      throw new Error('Erreur lors de la récupération des paiements');
    }
  } catch (error: any) {
    console.error('Erreur récupération paiements Payrexx:', error.response?.data || error.message);
    throw new Error('Impossible de récupérer la liste des paiements');
  }
};

export default payrexxApi;

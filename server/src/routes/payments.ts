import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { createPayrexxPayment, checkPaymentStatus } from '../utils/payrexx';

const router = Router();

// Middleware d'authentification
const authMiddleware = async (req: any, res: Response, next: any) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};

// Créer une session de paiement pour l'achat de crédits
router.post('/create-session', authMiddleware, async (req: any, res: Response) => {
  try {
    const { credits, amount } = req.body;

    if (!credits || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Nombre de crédits et montant requis'
      });
    }

    // Vérifier que le montant correspond au nombre de crédits
    const expectedAmount = calculateCreditsPrice(credits);
    if (Math.abs(amount - expectedAmount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Prix incorrect'
      });
    }

    const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?payment_id={PAYMENT_ID}`;
    const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel`;

    const payment = await createPayrexxPayment({
      amount,
      currency: 'chf',
      credits,
      userEmail: req.user.email,
      userId: req.user.id,
      successUrl,
      cancelUrl,
      description: `Achat de ${credits} crédits pour ELAÏA Studio`,
    });

    res.json({
      success: true,
      paymentId: payment.paymentId,
      url: payment.paymentUrl,
    });
  } catch (error) {
    console.error('Erreur création session paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du paiement'
    });
  }
});

// Vérifier le statut d'un paiement Payrexx
router.get('/status/:paymentId', authMiddleware, async (req: any, res: Response) => {
  try {
    const { paymentId } = req.params;

    const paymentStatus = await checkPaymentStatus(parseInt(paymentId));

    res.json({
      success: true,
      status: paymentStatus,
    });
  } catch (error) {
    console.error('Erreur vérification statut paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du paiement'
    });
  }
});

// Webhook Payrexx (optionnel - si configuré)
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const { transaction } = req.body;

    if (transaction && transaction.status === 'confirmed') {
      const { referenceId } = transaction;
      const [_, userId, credits] = referenceId.split('-');

      if (userId && credits) {
        // Ajouter les crédits à l'utilisateur de manière atomique
        const creditsInt = parseInt(credits);
        const { error: updateError } = await supabaseAdmin.rpc('update_user_credits', {
          p_user_id: userId,
          p_amount: creditsInt,
          p_type: 'purchase',
          p_description: `Achat de ${creditsInt} crédits via Payrexx`,
          p_reference_id: null,
        });

        if (updateError) {
          console.error('Erreur mise à jour crédits:', updateError);
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Erreur webhook Payrexx:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// Récupérer l'historique des paiements de l'utilisateur
router.get('/history', authMiddleware, async (req: any, res: Response) => {
  try {
    const { data: transactions, error } = await supabaseAdmin
      .from('credit_transactions')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('type', 'purchase')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      payments: transactions || []
    });
  } catch (error) {
    console.error('Erreur récupération historique paiements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'historique'
    });
  }
});

// Fonction utilitaire pour calculer le prix des crédits
function calculateCreditsPrice(credits: number): number {
  // Tarifs par crédit selon les packs
  const prices: { [key: number]: number } = {
    5: 125 / 5,   // 25 CHF par crédit
    10: 240 / 10, // 24 CHF par crédit
    30: 660 / 30, // 22 CHF par crédit
    50: 1000 / 50, // 20 CHF par crédit
  };

  // Pour les montants personnalisés, utiliser le tarif le plus avantageux
  if (credits <= 5) return credits * prices[5];
  if (credits <= 10) return credits * prices[10];
  if (credits <= 30) return credits * prices[30];
  return credits * prices[50];
}

export default router;

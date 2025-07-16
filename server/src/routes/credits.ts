import { Router } from 'express';
import { dbRun, dbGet, dbAll } from '../utils/db';
import { authenticateToken } from '../middleware/auth';
import { addDays } from 'date-fns';

const router = Router();

// Route pour récupérer tous les plans d'abonnement
router.get('/plans', async (req, res) => {
  try {
    const plans = await dbAll(
      'SELECT * FROM subscription_plans WHERE is_active = 1 ORDER BY type, price'
    );
    res.json(plans);
  } catch (error) {
    console.error('Erreur lors de la récupération des plans:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des plans' });
  }
});

// Route pour récupérer l'abonnement actif de l'utilisateur
router.get('/my-subscription', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const subscription = await dbGet(`
      SELECT us.*, sp.name as plan_name, sp.type as plan_type, sp.price
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE us.user_id = ? AND us.is_active = 1
      AND (us.end_date IS NULL OR us.end_date >= date('now'))
      ORDER BY us.created_at DESC
      LIMIT 1
    `, [userId]);

    if (!subscription) {
      return res.json({ subscription: null, message: 'Aucun abonnement actif' });
    }

    // Calculer les statistiques d'utilisation
    const usageStats = await dbGet(`
      SELECT 
        COUNT(*) as total_bookings,
        SUM(credits_used) as total_credits_used
      FROM bookings
      WHERE subscription_id = ? AND status = 'confirmed'
    `, [subscription.id]);

    res.json({
      subscription: {
        ...subscription,
        usage_stats: usageStats
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonnement:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'abonnement' });
  }
});

// Route pour souscrire à un abonnement
router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan_id, payment_method = 'card', promo_code } = req.body;

    // Vérifier que le plan existe
    const plan = await dbGet(
      'SELECT * FROM subscription_plans WHERE id = ? AND is_active = 1',
      [plan_id]
    );

    if (!plan) {
      return res.status(404).json({ message: 'Plan d\'abonnement non trouvé' });
    }

    // Vérifier s'il y a déjà un abonnement actif
    const activeSubscription = await dbGet(`
      SELECT * FROM user_subscriptions 
      WHERE user_id = ? AND is_active = 1
      AND (end_date IS NULL OR end_date >= date('now'))
    `, [userId]);

    if (activeSubscription) {
      return res.status(400).json({ 
        message: 'Vous avez déjà un abonnement actif',
        current_subscription: activeSubscription
      });
    }

    let finalPrice = plan.price;
    let appliedPromo = null;

    // Vérifier le code promo si fourni
    if (promo_code) {
      const promo = await dbGet(`
        SELECT * FROM promotions 
        WHERE code = ? AND is_active = 1
        AND (valid_from IS NULL OR valid_from <= date('now'))
        AND (valid_until IS NULL OR valid_until >= date('now'))
        AND (max_uses IS NULL OR current_uses < max_uses)
      `, [promo_code.toUpperCase()]);

      if (promo) {
        if (promo.discount_type === 'percentage') {
          finalPrice = plan.price * (1 - promo.discount_value / 100);
        } else {
          finalPrice = Math.max(0, plan.price - promo.discount_value);
        }
        appliedPromo = promo;
      }
    }

    // Créer la transaction
    await dbRun('BEGIN TRANSACTION');

    try {
      // Créer le paiement
      const paymentResult = await dbRun(`
        INSERT INTO payments (user_id, amount, payment_method, status)
        VALUES (?, ?, ?, 'completed')
      `, [userId, finalPrice, payment_method]);

      // Créer l'abonnement
      const startDate = new Date();
      const endDate = plan.duration_days ? addDays(startDate, plan.duration_days) : null;
      
      const subscriptionResult = await dbRun(`
        INSERT INTO user_subscriptions 
        (user_id, plan_id, start_date, end_date, credits_remaining, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
      `, [
        userId, 
        plan_id, 
        startDate.toISOString().split('T')[0],
        endDate ? endDate.toISOString().split('T')[0] : null,
        plan.credits || 0
      ]);

      // Mettre à jour le paiement avec l'ID de l'abonnement
      await dbRun(
        'UPDATE payments SET subscription_id = ? WHERE id = ?',
        [subscriptionResult.lastID, paymentResult.lastID]
      );

      // Incrémenter l'utilisation du code promo
      if (appliedPromo) {
        await dbRun(
          'UPDATE promotions SET current_uses = current_uses + 1 WHERE id = ?',
          [appliedPromo.id]
        );
      }

      await dbRun('COMMIT');

      res.status(201).json({
        message: 'Abonnement souscrit avec succès',
        subscription_id: subscriptionResult.lastID,
        payment_id: paymentResult.lastID,
        plan_name: plan.name,
        credits_received: plan.credits || 0,
        amount_paid: finalPrice,
        promo_applied: appliedPromo ? {
          code: appliedPromo.code,
          discount: plan.price - finalPrice
        } : null
      });
    } catch (error) {
      await dbRun('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la souscription:', error);
    res.status(500).json({ message: 'Erreur lors de la souscription' });
  }
});

// Route pour acheter des crédits supplémentaires
router.post('/buy-credits', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { credits_amount, payment_method = 'card' } = req.body;

    // Vérifier l'abonnement actif
    const activeSubscription = await dbGet(`
      SELECT us.*, sp.type as plan_type
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE us.user_id = ? AND us.is_active = 1
      AND (us.end_date IS NULL OR us.end_date >= date('now'))
      ORDER BY us.created_at DESC
      LIMIT 1
    `, [userId]);

    if (!activeSubscription || activeSubscription.plan_type !== 'credits') {
      return res.status(400).json({ 
        message: 'Vous devez avoir un abonnement à crédits actif pour acheter des crédits supplémentaires' 
      });
    }

    // Calculer le prix (11 CHF par crédit)
    const price = credits_amount * 11;

    // Créer le paiement
    const paymentResult = await dbRun(`
      INSERT INTO payments (user_id, subscription_id, amount, payment_method, status)
      VALUES (?, ?, ?, ?, 'completed')
    `, [userId, activeSubscription.id, price, payment_method]);

    // Ajouter les crédits
    await dbRun(
      'UPDATE user_subscriptions SET credits_remaining = credits_remaining + ? WHERE id = ?',
      [credits_amount, activeSubscription.id]
    );

    res.status(201).json({
      message: 'Crédits ajoutés avec succès',
      credits_added: credits_amount,
      amount_paid: price,
      new_balance: activeSubscription.credits_remaining + credits_amount
    });
  } catch (error) {
    console.error('Erreur lors de l\'achat de crédits:', error);
    res.status(500).json({ message: 'Erreur lors de l\'achat de crédits' });
  }
});

// Route pour l'historique des paiements
router.get('/payment-history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const payments = await dbAll(`
      SELECT p.*, sp.name as plan_name
      FROM payments p
      LEFT JOIN user_subscriptions us ON p.subscription_id = us.id
      LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `, [userId]);

    res.json(payments);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique' });
  }
});

export default router; 
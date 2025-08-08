import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// Middleware d'authentification basé sur le JWT serveur
const authMiddleware = async (req: any, res: Response, next: any) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

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

// GET /credits/plans
router.get('/plans', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price');

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Erreur récupération plans:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des plans' });
  }
});

// GET /credits/subscription (alias de /credits/my-subscription)
router.get(['/subscription', '/my-subscription'], authMiddleware, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const { data: subscription, error } = await supabaseAdmin
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans:plan_id (*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116: no rows

    if (!subscription) {
      return res.json({ subscription: null, message: 'Aucun abonnement actif' });
    }

    // Stats d'utilisation pour cet abonnement
    const { data: usageStats } = await supabaseAdmin
      .from('bookings')
      .select('id, credits_used')
      .eq('subscription_id', subscription.id)
      .eq('status', 'confirmed');

    // Stats globales utilisateur (toutes réservations)
    const { data: allUserBookings } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'confirmed');

    const totalBookings = usageStats ? usageStats.length : 0;
    const totalCreditsUsed = usageStats?.reduce((sum: number, b: any) => sum + (b.credits_used || 0), 0) || 0;
    const totalSessionsAllTime = allUserBookings ? allUserBookings.length : 0;

    res.json({
      subscription: {
        ...subscription,
        plan_name: subscription.subscription_plans?.name,
        plan_description: subscription.subscription_plans?.description,
        plan_type: subscription.subscription_plans?.type,
        price: subscription.subscription_plans?.price,
        total_credits: subscription.subscription_plans?.credits || 0,
        next_renewal_date: subscription.end_date,
        usage_stats: {
          total_bookings: totalBookings,
          credits_used: totalCreditsUsed,
          total_sessions_all_time: totalSessionsAllTime,
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'abonnement:", error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'abonnement" });
  }
});

// POST /credits/subscribe
router.post('/subscribe', authMiddleware, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { plan_id, payment_method = 'card', promo_code } = req.body;

    // Vérifier le plan
    const { data: plan, error: planError } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .eq('id', plan_id)
      .eq('is_active', true)
      .single();
    if (planError || !plan) return res.status(404).json({ message: "Plan d'abonnement non trouvé" });

    // Vérifier abonnement actif
    const { data: activeSubscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle();
    if (activeSubscription) {
      return res.status(400).json({ message: 'Vous avez déjà un abonnement actif', current_subscription: activeSubscription });
    }

    // Appliquer promo simple (optionnel - lecture seule)
    let finalPrice = plan.price;
    let appliedPromo: any = null;
    if (promo_code) {
      const { data: promo } = await supabaseAdmin
        .from('promotions')
        .select('*')
        .eq('code', String(promo_code).toUpperCase())
        .eq('is_active', true)
        .maybeSingle();
      if (promo) {
        if (promo.discount_type === 'percentage') {
          finalPrice = plan.price * (1 - promo.discount_value / 100);
        } else {
          finalPrice = Math.max(0, plan.price - promo.discount_value);
        }
        appliedPromo = promo;
      }
    }

    // Créer paiement (statut simulé)
    const { data: payment, error: payError } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: userId,
        amount: finalPrice,
        type: 'subscription',
        status: 'completed',
        payment_method,
      })
      .select('*')
      .single();
    if (payError) throw payError;

    // Créer abonnement
    const startDate = new Date();
    const endDate = plan.duration_days ? new Date(startDate.getTime() + plan.duration_days * 86400000) : null;

    const { data: subscription, error: subError } = await supabaseAdmin
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id,
        start_date: startDate.toISOString(),
        end_date: endDate ? endDate.toISOString() : null,
        is_active: true,
        credits_remaining: plan.credits || 0,
      })
      .select('*')
      .single();
    if (subError) throw subError;

    // Lier paiement -> abonnement
    await supabaseAdmin
      .from('payments')
      .update({ reference_id: subscription.id })
      .eq('id', payment.id);

    // Incrémenter utilisation promo
    if (appliedPromo) {
      await supabaseAdmin
        .from('promotions')
        .update({ current_uses: (appliedPromo.current_uses || 0) + 1 })
        .eq('id', appliedPromo.id);
    }

    res.status(201).json({
      message: 'Abonnement souscrit avec succès',
      subscription_id: subscription.id,
      payment_id: payment.id,
      plan_name: plan.name,
      credits_received: plan.credits || 0,
      amount_paid: finalPrice,
      promo_applied: appliedPromo
        ? { code: appliedPromo.code, discount: plan.price - finalPrice }
        : null,
    });
  } catch (error) {
    console.error('Erreur lors de la souscription:', error);
    res.status(500).json({ message: 'Erreur lors de la souscription' });
  }
});

// POST /credits/buy (alias /buy-credits) – achat de crédits supplémentaires pour plan à crédits
router.post(['/buy', '/buy-credits'], authMiddleware, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const creditsAmount = Number(req.body.credits_amount ?? req.body.amount);
    const payment_method = req.body.payment_method || 'card';

    if (!creditsAmount || creditsAmount <= 0) {
      return res.status(400).json({ message: 'Quantité de crédits invalide' });
    }

    // Abonnement actif
    const { data: activeSubscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*, subscription_plans:plan_id (type)')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!activeSubscription || activeSubscription.subscription_plans?.type !== 'credits') {
      return res.status(400).json({ message: 'Un abonnement à crédits actif est requis' });
    }

    const price = creditsAmount * 11; // CHF 11 / crédit

    // Paiement
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: userId,
        reference_id: activeSubscription.id,
        amount: price,
        type: 'credits',
        status: 'completed',
        payment_method,
      });
    if (paymentError) throw paymentError;

    // Crédits + transaction
    const { error: subUpdateError } = await supabaseAdmin
      .from('user_subscriptions')
      .update({ credits_remaining: (activeSubscription.credits_remaining || 0) + creditsAmount })
      .eq('id', activeSubscription.id);
    if (subUpdateError) throw subUpdateError;

    await supabaseAdmin
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount: creditsAmount,
        type: 'purchase',
        description: `Achat de ${creditsAmount} crédits`,
        reference_id: activeSubscription.id,
      });

    res.status(201).json({
      message: 'Crédits ajoutés avec succès',
      credits_added: creditsAmount,
      amount_paid: price,
      new_balance: (activeSubscription.credits_remaining || 0) + creditsAmount,
    });
  } catch (error) {
    console.error("Erreur lors de l'achat de crédits:", error);
    res.status(500).json({ message: "Erreur lors de l'achat de crédits" });
  }
});

// GET /credits/payments – historique paiements
router.get('/payments', authMiddleware, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique des paiements:", error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'historique des paiements" });
  }
});

// GET /credits/history – historique des crédits
router.get('/history', authMiddleware, async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabaseAdmin
      .from('credit_transactions')
      .select('id, user_id, amount, type, description, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;

    // Normaliser pour UI: type 'credit'/'debit'
    const normalized = (data || []).map((t: any) => ({
      ...t,
      type: t.amount >= 0 ? 'credit' : 'debit',
      amount: Math.abs(t.amount),
    }));

    res.json(normalized);
  } catch (error) {
    console.error('Erreur lors de la récupération de lhisto des crédits:', error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'historique des crédits" });
  }
});

export default router;



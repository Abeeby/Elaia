import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// Auth middleware (JWT) + admin check
const authMiddleware = async (req: any, res: Response, next: any) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token manquant' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single();
    if (error || !user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};

const authorizeAdmin = (req: any, res: Response, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
  }
  next();
};

// GET /api/admin/users
router.get('/users', authMiddleware, authorizeAdmin, async (_req: any, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, role, credits, referral_source, referrer_name, company_name')
      .order('created_at', { ascending: false });
    if (error) throw error;
    const users = (data || []).map(u => ({
      ...u,
      credits_remaining: u.credits ?? 0,
    }));
    res.json({ users });
  } catch (error) {
    console.error('Erreur admin/users:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// POST /api/admin/users/:userId/referral  { referrer_name }
router.post('/users/:userId/referral', authMiddleware, authorizeAdmin, async (req: any, res: Response) => {
  try {
    const { userId } = req.params;
    const { referrer_name } = req.body || {};
    const { error } = await supabaseAdmin
      .from('users')
      .update({ referrer_name: referrer_name || null })
      .eq('id', userId);
    if (error) throw error;
    res.json({ message: 'Parrain mis à jour' });
  } catch (error) {
    console.error('Erreur maj parrain:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du parrain' });
  }
});

// POST /api/admin/add-credits  { userEmail, credits }
router.post('/add-credits', authMiddleware, authorizeAdmin, async (req: any, res: Response) => {
  try {
    const { userEmail, credits } = req.body || {};
    if (!userEmail || !credits || credits <= 0) {
      return res.status(400).json({ message: 'Paramètres invalides' });
    }
    // Récupérer utilisateur
    const { data: user, error: uErr } = await supabaseAdmin
      .from('users')
      .select('id, credits')
      .eq('email', userEmail)
      .single();
    if (uErr || !user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Maj crédits
    const { error: upErr } = await supabaseAdmin
      .from('users')
      .update({ credits: (user.credits || 0) + Number(credits) })
      .eq('id', user.id);
    if (upErr) throw upErr;

    // Historique
    await supabaseAdmin
      .from('credit_history')
      .insert({
        user_id: user.id,
        type: 'credit',
        amount: Number(credits),
        description: 'Crédit ajouté par admin',
        remaining_after: (user.credits || 0) + Number(credits),
      });

    res.json({ message: 'Crédits ajoutés avec succès' });
  } catch (error) {
    console.error('Erreur add-credits:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de crédits' });
  }
});

export default router;



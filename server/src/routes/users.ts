import { Router } from 'express';
import { dbRun, dbGet, dbAll } from '../utils/db';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();

// Route pour récupérer le profil d'un utilisateur (admin only)
router.get('/:userId', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await dbGet(`
      SELECT 
        u.*,
        us.plan_id,
        sp.name as plan_name,
        us.credits_remaining,
        us.start_date as subscription_start,
        us.end_date as subscription_end
      FROM users u
      LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.is_active = 1
      LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE u.id = ?
    `, [userId]);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Statistiques de l'utilisateur
    const stats = await dbGet(`
      SELECT 
        COUNT(DISTINCT b.id) as total_bookings,
        COUNT(DISTINCT CASE WHEN b.status = 'cancelled' THEN b.id END) as cancelled_bookings,
        SUM(b.credits_used) as total_credits_used,
        COUNT(DISTINCT DATE(b.created_at)) as active_days
      FROM bookings b
      WHERE b.user_id = ?
    `, [userId]);

    res.json({
      user,
      stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
  }
});

// Route pour mettre à jour un utilisateur (admin only)
router.put('/:userId', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const updates = req.body;

    // Ne pas permettre la modification du mot de passe directement
    delete updates.password;

    const fields = Object.keys(updates).filter(key => updates[key] !== undefined);
    const values = fields.map(key => updates[key]);
    values.push(userId);

    if (fields.length > 0) {
      const setClause = fields.map(field => `${field} = ?`).join(', ');
      await dbRun(
        `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );
    }

    res.json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

// Route pour réinitialiser le mot de passe d'un utilisateur (admin only)
router.post('/:userId/reset-password', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { new_password } = req.body;

    if (!new_password || new_password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    
    await dbRun(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, userId]
    );

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
  }
});

// Route pour bloquer/débloquer un utilisateur (admin only)
router.post('/:userId/toggle-status', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await dbGet('SELECT is_verified FROM users WHERE id = ?', [userId]);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const newStatus = !user.is_verified;
    
    await dbRun(
      'UPDATE users SET is_verified = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newStatus ? 1 : 0, userId]
    );

    res.json({ 
      message: newStatus ? 'Utilisateur activé' : 'Utilisateur bloqué',
      is_verified: newStatus
    });
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error);
    res.status(500).json({ message: 'Erreur lors du changement de statut' });
  }
});

// Route pour l'historique des réservations d'un utilisateur (admin only)
router.get('/:userId/bookings', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const bookings = await dbAll(`
      SELECT 
        b.*,
        c.start_time,
        c.end_time,
        ct.name as class_type_name,
        ct.credits_required
      FROM bookings b
      JOIN classes c ON b.class_id = c.id
      JOIN class_types ct ON c.class_type_id = ct.id
      WHERE b.user_id = ?
      ORDER BY c.start_time DESC
      LIMIT ? OFFSET ?
    `, [userId, limit, offset]);

    const total = await dbGet(
      'SELECT COUNT(*) as count FROM bookings WHERE user_id = ?',
      [userId]
    );

    res.json({
      bookings,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: total.count,
        pages: Math.ceil(total.count / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations' });
  }
});

// Route pour ajouter des crédits à un utilisateur (admin only)
router.post('/:userId/add-credits', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { credits_amount, reason } = req.body;

    if (!credits_amount || credits_amount <= 0) {
      return res.status(400).json({ message: 'Le nombre de crédits doit être positif' });
    }

    // Vérifier l'abonnement actif
    const subscription = await dbGet(`
      SELECT us.*, sp.type as plan_type
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE us.user_id = ? AND us.is_active = 1
      AND (us.end_date IS NULL OR us.end_date >= date('now'))
      ORDER BY us.created_at DESC
      LIMIT 1
    `, [userId]);

    if (!subscription || subscription.plan_type !== 'credits') {
      return res.status(400).json({ 
        message: 'L\'utilisateur doit avoir un abonnement à crédits actif' 
      });
    }

    // Ajouter les crédits
    await dbRun(
      'UPDATE user_subscriptions SET credits_remaining = credits_remaining + ? WHERE id = ?',
      [credits_amount, subscription.id]
    );

    // Enregistrer la transaction (crédit gratuit)
    await dbRun(`
      INSERT INTO payments (user_id, subscription_id, amount, payment_method, status)
      VALUES (?, ?, 0, 'admin_credit', 'completed')
    `, [userId, subscription.id]);

    res.json({
      message: 'Crédits ajoutés avec succès',
      credits_added: credits_amount,
      new_balance: subscription.credits_remaining + credits_amount,
      reason
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de crédits:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de crédits' });
  }
});

export default router; 
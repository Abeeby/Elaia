import { Router } from 'express';
import { dbAll, dbGet } from '../utils/database-pg';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

const router = Router();

// Middleware pour toutes les routes admin
router.use(authenticateToken, authorizeAdmin);

// Route pour le tableau de bord général
router.get('/dashboard', async (req, res) => {
  try {
    // Statistiques des clients
    const clientStats = await dbGet(`
      SELECT 
        COUNT(DISTINCT u.id) as total_clients,
        COUNT(DISTINCT CASE WHEN u.created_at >= date('now', '-30 days') THEN u.id END) as new_clients_month,
        COUNT(DISTINCT CASE WHEN b.created_at >= date('now', '-30 days') THEN u.id END) as active_clients_month
      FROM users u
      LEFT JOIN bookings b ON u.id = b.user_id
      WHERE u.role = 'client'
    `);

    // Statistiques des séances
    const sessionStats = await dbGet(`
      SELECT 
        COUNT(*) as total_bookings_month,
        COUNT(DISTINCT user_id) as unique_clients_month,
        AVG(credits_used) as avg_credits_per_booking
      FROM bookings
      WHERE created_at >= date('now', '-30 days')
      AND status = 'confirmed'
    `);

    // Taux d'occupation
    const occupancyStats = await dbGet(`
      SELECT 
        AVG(CAST(current_participants AS FLOAT) / max_participants * 100) as avg_occupancy_rate,
        COUNT(*) as total_classes_month
      FROM classes
      WHERE start_time >= date('now', '-30 days')
      AND start_time <= date('now')
      AND status = 'scheduled'
    `);

    // Revenus du mois
    const revenueStats = await dbGet(`
      SELECT 
        SUM(amount) as total_revenue_month,
        COUNT(*) as total_transactions
      FROM payments
      WHERE created_at >= date('now', '-30 days')
      AND status = 'completed'
    `);

    // Top abonnements
    const topSubscriptions = await dbAll(`
      SELECT 
        sp.name,
        COUNT(us.id) as count,
        SUM(p.amount) as revenue
      FROM subscription_plans sp
      JOIN user_subscriptions us ON sp.id = us.plan_id
      LEFT JOIN payments p ON us.id = p.subscription_id
      WHERE us.created_at >= date('now', '-30 days')
      GROUP BY sp.id
      ORDER BY count DESC
      LIMIT 5
    `);

    res.json({
      clients: clientStats,
      sessions: sessionStats,
      occupancy: occupancyStats,
      revenue: revenueStats,
      topSubscriptions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du tableau de bord:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du tableau de bord' });
  }
});

// Route pour les statistiques détaillées des clients
router.get('/clients/stats', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period as string);

    const stats = await dbAll(`
      SELECT 
        date(u.created_at) as date,
        COUNT(*) as new_clients,
        (SELECT COUNT(DISTINCT user_id) 
         FROM bookings 
         WHERE date(created_at) = date(u.created_at)) as active_clients
      FROM users u
      WHERE u.role = 'client'
      AND u.created_at >= date('now', '-${days} days')
      GROUP BY date(u.created_at)
      ORDER BY date DESC
    `);

    const retentionRate = await dbGet(`
      SELECT 
        COUNT(DISTINCT CASE WHEN booking_count > 1 THEN user_id END) * 100.0 / 
        COUNT(DISTINCT user_id) as retention_rate
      FROM (
        SELECT user_id, COUNT(*) as booking_count
        FROM bookings
        WHERE created_at >= date('now', '-${days} days')
        GROUP BY user_id
      )
    `);

    res.json({
      dailyStats: stats,
      retentionRate: retentionRate.retention_rate || 0
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques clients:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});

// Route pour gérer les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereClause = '1=1';
    const params: any[] = [];

    if (role) {
      whereClause += ' AND role = ?';
      params.push(role);
    }

    if (search) {
      whereClause += ' AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    const users = await dbAll(`
      SELECT 
        u.*,
        COALESCE(u.credits_remaining, 0) as credits_remaining
      FROM users u
      WHERE ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const total = await dbGet(
      `SELECT COUNT(*) as count FROM users WHERE ${whereClause}`,
      params
    );

    res.json({
      users,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: total.count,
        pages: Math.ceil(total.count / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Route pour les statistiques de fréquentation
router.get('/attendance/stats', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const attendanceByDay = await dbAll(`
      SELECT 
        strftime('%w', start_time) as day_of_week,
        strftime('%H', start_time) as hour,
        AVG(CAST(current_participants AS FLOAT) / max_participants * 100) as avg_occupancy,
        COUNT(*) as class_count
      FROM classes
      WHERE start_time >= ? AND start_time <= ?
      AND status = 'scheduled'
      GROUP BY day_of_week, hour
      ORDER BY day_of_week, hour
    `, [start_date || "date('now', '-30 days')", end_date || "date('now')"]);

    const popularClasses = await dbAll(`
      SELECT 
        ct.name,
        COUNT(b.id) as total_bookings,
        AVG(c.current_participants) as avg_participants
      FROM class_types ct
      JOIN classes c ON ct.id = c.class_type_id
      LEFT JOIN bookings b ON c.id = b.class_id
      WHERE c.start_time >= ? AND c.start_time <= ?
      GROUP BY ct.id
      ORDER BY total_bookings DESC
    `, [start_date || "date('now', '-30 days')", end_date || "date('now')"]);

    res.json({
      attendanceByDayHour: attendanceByDay,
      popularClasses
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques de fréquentation:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});

export default router; 
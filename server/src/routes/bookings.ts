import { Router } from 'express';
import { dbRun, dbGet, dbAll } from '../utils/db';
import { authenticateToken } from '../middleware/auth';
import { differenceInHours, parseISO } from 'date-fns';
import { emailService } from '../utils/emailService';

const router = Router();

// Route pour récupérer les réservations de l'utilisateur
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status = 'all', timeframe = 'future' } = req.query;

    let whereClause = 'b.user_id = ?';
    const params = [userId];

    if (status !== 'all') {
      whereClause += ' AND b.status = ?';
      params.push(status);
    }

    if (timeframe === 'future') {
      whereClause += ' AND c.start_time >= datetime("now")';
    } else if (timeframe === 'past') {
      whereClause += ' AND c.start_time < datetime("now")';
    }

    const bookings = await dbAll(`
      SELECT 
        b.*,
        c.start_time,
        c.end_time,
        ct.name as class_type_name,
        ct.credits_required,
        u.first_name as instructor_first_name,
        u.last_name as instructor_last_name
      FROM bookings b
      JOIN classes c ON b.class_id = c.id
      JOIN class_types ct ON c.class_type_id = ct.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE ${whereClause}
      ORDER BY c.start_time DESC
    `, params);

    res.json(bookings);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations' });
  }
});

// Route pour créer une réservation
router.post('/book', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { class_id } = req.body;

    // Vérifier que le cours existe et qu'il y a de la place
    const classInfo = await dbGet(`
      SELECT c.*, ct.credits_required, ct.name as class_type_name,
             u.first_name as instructor_first_name, u.last_name as instructor_last_name
      FROM classes c
      JOIN class_types ct ON c.class_type_id = ct.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.id = ? AND c.status = 'scheduled'
    `, [class_id]);

    if (!classInfo) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    if (classInfo.current_participants >= classInfo.max_participants) {
      return res.status(400).json({ 
        message: 'Ce cours est complet', 
        suggest_waiting_list: true 
      });
    }

    // Vérifier que l'utilisateur n'est pas déjà inscrit
    const existingBooking = await dbGet(`
      SELECT id FROM bookings 
      WHERE user_id = ? AND class_id = ? AND status = 'confirmed'
    `, [userId, class_id]);

    if (existingBooking) {
      return res.status(400).json({ message: 'Vous êtes déjà inscrit à ce cours' });
    }

    // Récupérer les infos utilisateur pour l'email
    const user = await dbGet(`
      SELECT first_name, last_name, email FROM users WHERE id = ?
    `, [userId]);

    // Vérifier l'abonnement actif et les crédits
    const activeSubscription = await dbGet(`
      SELECT * FROM user_subscriptions 
      WHERE user_id = ? AND is_active = 1 
      AND (end_date IS NULL OR end_date >= date('now'))
      ORDER BY created_at DESC
      LIMIT 1
    `, [userId]);

    if (!activeSubscription) {
      return res.status(400).json({ message: 'Aucun abonnement actif trouvé' });
    }

    // Vérifier les crédits pour les abonnements à crédits
    const subscriptionPlan = await dbGet(
      'SELECT * FROM subscription_plans WHERE id = ?',
      [activeSubscription.plan_id]
    );

    if (subscriptionPlan.type === 'credits') {
      if (activeSubscription.credits_remaining < classInfo.credits_required) {
        return res.status(400).json({ 
          message: 'Crédits insuffisants',
          credits_needed: classInfo.credits_required,
          credits_available: activeSubscription.credits_remaining
        });
      }
    }

    // Créer la réservation dans une transaction
    await dbRun('BEGIN TRANSACTION');

    try {
      // Créer la réservation
      const result = await dbRun(`
        INSERT INTO bookings (user_id, class_id, subscription_id, status, credits_used)
        VALUES (?, ?, ?, 'confirmed', ?)
      `, [userId, class_id, activeSubscription.id, classInfo.credits_required]);

      // Mettre à jour le nombre de participants
      await dbRun(
        'UPDATE classes SET current_participants = current_participants + 1 WHERE id = ?',
        [class_id]
      );

      // Déduire les crédits si nécessaire
      if (subscriptionPlan.type === 'credits') {
        await dbRun(
          'UPDATE user_subscriptions SET credits_remaining = credits_remaining - ? WHERE id = ?',
          [classInfo.credits_required, activeSubscription.id]
        );
      }

      await dbRun('COMMIT');

      // Envoyer l'email de confirmation
      const instructorName = classInfo.instructor_first_name ? 
        `${classInfo.instructor_first_name} ${classInfo.instructor_last_name}` : undefined;

      await emailService.sendBookingConfirmation({
        userEmail: user.email,
        userName: `${user.first_name} ${user.last_name}`,
        classTypeName: classInfo.class_type_name,
        startTime: classInfo.start_time,
        instructorName,
        creditsUsed: classInfo.credits_required
      });

      res.status(201).json({
        message: 'Réservation confirmée',
        booking_id: result.lastID,
        credits_used: classInfo.credits_required,
        credits_remaining: activeSubscription.credits_remaining - classInfo.credits_required
      });
    } catch (error) {
      await dbRun('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la réservation:', error);
    res.status(500).json({ message: 'Erreur lors de la réservation' });
  }
});

// Route pour annuler une réservation
router.post('/cancel/:bookingId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.bookingId;

    // Récupérer les informations de la réservation
    const booking = await dbGet(`
      SELECT b.*, c.start_time, ct.credits_required, ct.name as class_type_name,
             u.first_name, u.last_name, u.email
      FROM bookings b
      JOIN classes c ON b.class_id = c.id
      JOIN class_types ct ON c.class_type_id = ct.id
      JOIN users u ON b.user_id = u.id
      WHERE b.id = ? AND b.user_id = ? AND b.status = 'confirmed'
    `, [bookingId, userId]);

    if (!booking) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }

    // Vérifier le délai d'annulation (12h avant le cours)
    const hoursUntilClass = differenceInHours(parseISO(booking.start_time), new Date());
    
    if (hoursUntilClass < 12) {
      return res.status(400).json({ 
        message: 'Annulation impossible : le délai de 12h est dépassé',
        hours_until_class: hoursUntilClass
      });
    }

    // Annuler la réservation dans une transaction
    await dbRun('BEGIN TRANSACTION');

    try {
      // Marquer la réservation comme annulée
      await dbRun(
        'UPDATE bookings SET status = "cancelled", cancelled_at = CURRENT_TIMESTAMP WHERE id = ?',
        [bookingId]
      );

      // Réduire le nombre de participants
      await dbRun(
        'UPDATE classes SET current_participants = current_participants - 1 WHERE id = ?',
        [booking.class_id]
      );

      // Rembourser les crédits
      const subscription = await dbGet(
        'SELECT * FROM user_subscriptions WHERE id = ?',
        [booking.subscription_id]
      );

      const subscriptionPlan = await dbGet(
        'SELECT * FROM subscription_plans WHERE id = ?',
        [subscription.plan_id]
      );

      let creditsRefunded = 0;
      if (subscriptionPlan.type === 'credits') {
        creditsRefunded = booking.credits_required;
        await dbRun(
          'UPDATE user_subscriptions SET credits_remaining = credits_remaining + ? WHERE id = ?',
          [booking.credits_required, booking.subscription_id]
        );
      }

      // Notifier la première personne sur liste d'attente
      const firstInWaitingList = await dbGet(`
        SELECT * FROM waiting_list 
        WHERE class_id = ? 
        ORDER BY position 
        LIMIT 1
      `, [booking.class_id]);

      if (firstInWaitingList) {
        // TODO: Envoyer une notification
        await dbRun(
          'UPDATE waiting_list SET notified = 1 WHERE id = ?',
          [firstInWaitingList.id]
        );
      }

      await dbRun('COMMIT');

      // Envoyer l'email de confirmation d'annulation
      await emailService.sendCancellationConfirmation({
        userEmail: booking.email,
        userName: `${booking.first_name} ${booking.last_name}`,
        classTypeName: booking.class_type_name,
        startTime: booking.start_time,
        creditsRefunded
      });

      res.json({
        message: 'Réservation annulée avec succès',
        credits_refunded: creditsRefunded
      });
    } catch (error) {
      await dbRun('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de l\'annulation:', error);
    res.status(500).json({ message: 'Erreur lors de l\'annulation' });
  }
});

// Route pour rejoindre la liste d'attente
router.post('/waiting-list', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { class_id } = req.body;

    // Vérifier que le cours existe et est complet
    const classInfo = await dbGet(
      'SELECT * FROM classes WHERE id = ? AND status = "scheduled"',
      [class_id]
    );

    if (!classInfo) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    if (classInfo.current_participants < classInfo.max_participants) {
      return res.status(400).json({ 
        message: 'Ce cours a encore des places disponibles' 
      });
    }

    // Vérifier que l'utilisateur n'est pas déjà sur la liste
    const existingEntry = await dbGet(
      'SELECT * FROM waiting_list WHERE user_id = ? AND class_id = ?',
      [userId, class_id]
    );

    if (existingEntry) {
      return res.status(400).json({ 
        message: 'Vous êtes déjà sur la liste d\'attente',
        position: existingEntry.position
      });
    }

    // Obtenir la dernière position
    const lastPosition = await dbGet(
      'SELECT MAX(position) as max_position FROM waiting_list WHERE class_id = ?',
      [class_id]
    );

    const newPosition = (lastPosition?.max_position || 0) + 1;

    // Ajouter à la liste d'attente
    await dbRun(
      'INSERT INTO waiting_list (user_id, class_id, position) VALUES (?, ?, ?)',
      [userId, class_id, newPosition]
    );

    res.status(201).json({
      message: 'Ajouté à la liste d\'attente',
      position: newPosition
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout à la liste d\'attente:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout à la liste d\'attente' });
  }
});

export default router; 
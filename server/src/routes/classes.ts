import { Router } from 'express';
import { dbAll, dbGet } from '../utils/db';
import { authenticateToken } from '../middleware/auth';
import { format, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const router = Router();

// Route pour récupérer tous les types de cours
router.get('/types', async (req, res) => {
  try {
    const classTypes = await dbAll('SELECT * FROM class_types');
    res.json(classTypes);
  } catch (error) {
    console.error('Erreur lors de la récupération des types de cours:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des types de cours' });
  }
});

// Route pour récupérer le planning des cours
router.get('/schedule', async (req, res) => {
  try {
    const { date, view = 'week' } = req.query;
    
    let startDate, endDate;
    
    if (view === 'week') {
      const targetDate = date ? parseISO(date as string) : new Date();
      startDate = startOfWeek(targetDate, { weekStartsOn: 1 });
      endDate = endOfWeek(targetDate, { weekStartsOn: 1 });
    } else if (view === 'day') {
      startDate = date ? parseISO(date as string) : new Date();
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
    } else {
      // Par défaut, les 7 prochains jours
      startDate = new Date();
      endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
    }

    const classes = await dbAll(`
      SELECT 
        c.*,
        ct.name as class_type_name,
        ct.credits_required,
        ct.duration_minutes,
        u.first_name as instructor_first_name,
        u.last_name as instructor_last_name,
        (c.max_participants - c.current_participants) as available_spots
      FROM classes c
      JOIN class_types ct ON c.class_type_id = ct.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.start_time >= ? AND c.start_time < ?
      AND c.status = 'scheduled'
      ORDER BY c.start_time
    `, [startDate.toISOString(), endDate.toISOString()]);

    res.json(classes);
  } catch (error) {
    console.error('Erreur lors de la récupération du planning:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du planning' });
  }
});

// Route pour récupérer les détails d'un cours
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const classId = req.params.id;
    
    const classDetails = await dbGet(`
      SELECT 
        c.*,
        ct.name as class_type_name,
        ct.credits_required,
        ct.duration_minutes,
        ct.description as class_type_description,
        u.first_name as instructor_first_name,
        u.last_name as instructor_last_name,
        (c.max_participants - c.current_participants) as available_spots
      FROM classes c
      JOIN class_types ct ON c.class_type_id = ct.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.id = ?
    `, [classId]);

    if (!classDetails) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Vérifier si l'utilisateur est inscrit
    const userBooking = await dbGet(`
      SELECT * FROM bookings 
      WHERE user_id = ? AND class_id = ? AND status = 'confirmed'
    `, [req.user.id, classId]);

    // Vérifier si l'utilisateur est sur liste d'attente
    const waitingListEntry = await dbGet(`
      SELECT * FROM waiting_list 
      WHERE user_id = ? AND class_id = ?
    `, [req.user.id, classId]);

    res.json({
      ...classDetails,
      is_booked: !!userBooking,
      is_on_waiting_list: !!waitingListEntry,
      waiting_list_position: waitingListEntry?.position
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du cours:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des détails du cours' });
  }
});

// Route pour récupérer les participants d'un cours (instructeurs/admin uniquement)
router.get('/:id/participants', authenticateToken, async (req, res) => {
  try {
    const classId = req.params.id;
    
    // Vérifier les permissions
    if (req.user.role !== 'admin' && req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    const participants = await dbAll(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        b.created_at as booking_date
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.class_id = ? AND b.status = 'confirmed'
      ORDER BY b.created_at
    `, [classId]);

    const waitingList = await dbAll(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        w.position,
        w.created_at as waiting_date
      FROM waiting_list w
      JOIN users u ON w.user_id = u.id
      WHERE w.class_id = ?
      ORDER BY w.position
    `, [classId]);

    res.json({
      participants,
      waiting_list: waitingList
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des participants:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des participants' });
  }
});

export default router; 
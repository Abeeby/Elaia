import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import jwt from 'jsonwebtoken';

const router = Router();

// Middleware d'authentification
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

// Obtenir mes réservations
router.get('/my-bookings', authMiddleware, async (req: any, res: Response) => {
  try {
    const { status, timeframe } = req.query;
    const userId = req.user.id;

    let query = supabaseAdmin
      .from('bookings')
      .select(`
        *,
        class_sessions (
          *,
          class_types (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: bookings, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      bookings: bookings || []
    });
  } catch (error) {
    console.error('Erreur récupération réservations:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des réservations' 
    });
  }
});

// Réserver un cours
router.post('/book', authMiddleware, async (req: any, res: Response) => {
  try {
    const { class_id } = req.body;
    const userId = req.user.id;

    // Vérifier la session de cours
    const { data: classSession, error: classError } = await supabaseAdmin
      .from('class_sessions')
      .select(`
        *,
        class_types (*)
      `)
      .eq('id', class_id)
      .single();

    if (classError || !classSession) {
      return res.status(404).json({ 
        success: false,
        message: 'Cours introuvable' 
      });
    }

    // Vérifier la disponibilité
    if (classSession.current_participants >= classSession.max_participants) {
      return res.status(400).json({ 
        success: false,
        message: 'Ce cours est complet' 
      });
    }

    // Vérifier si déjà réservé
    const { data: existingBooking } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('user_id', userId)
      .eq('class_session_id', class_id)
      .eq('status', 'confirmed')
      .single();

    if (existingBooking) {
      return res.status(400).json({ 
        success: false,
        message: 'Vous avez déjà réservé ce cours' 
      });
    }

    // Vérifier les crédits
    const creditsRequired = classSession.class_types.credits_required;
    if (req.user.credits < creditsRequired) {
      return res.status(400).json({ 
        success: false,
        message: `Crédits insuffisants. Il vous faut ${creditsRequired} crédits pour ce cours.` 
      });
    }

    // Créer la réservation
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: userId,
        class_session_id: class_id,
        credits_used: creditsRequired,
        status: 'confirmed'
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Déduire les crédits
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ credits: req.user.credits - creditsRequired })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Incrémenter les participants
    await supabaseAdmin
      .from('class_sessions')
      .update({ current_participants: classSession.current_participants + 1 })
      .eq('id', class_id);

    // Enregistrer la transaction
    await supabaseAdmin
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount: -creditsRequired,
        type: 'usage',
        description: `Réservation ${classSession.class_types.name}`,
        reference_id: booking.id
      });

    res.json({
      success: true,
      message: 'Réservation confirmée !',
      booking: {
        ...booking,
        class_session: classSession
      }
    });
  } catch (error) {
    console.error('Erreur réservation:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la réservation' 
    });
  }
});

// Annuler une réservation
router.post('/cancel/:bookingId', authMiddleware, async (req: any, res: Response) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    // Récupérer la réservation
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select(`
        *,
        class_sessions (
          *,
          class_types (*)
        )
      `)
      .eq('id', bookingId)
      .eq('user_id', userId)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Réservation introuvable' 
      });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({ 
        success: false,
        message: 'Cette réservation ne peut pas être annulée' 
      });
    }

    // Vérifier le délai d'annulation (24h minimum)
    const classTime = new Date(booking.class_sessions.start_time);
    const now = new Date();
    const hoursBeforeClass = (classTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursBeforeClass < 24) {
      return res.status(400).json({ 
        success: false,
        message: 'Les annulations doivent être faites au moins 24h avant le cours' 
      });
    }

    // Annuler la réservation
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (updateError) throw updateError;

    // Rembourser les crédits
    const { error: creditsError } = await supabaseAdmin
      .from('users')
      .update({ credits: req.user.credits + booking.credits_used })
      .eq('id', userId);

    if (creditsError) throw creditsError;

    // Décrémenter les participants
    await supabaseAdmin
      .from('class_sessions')
      .update({ 
        current_participants: booking.class_sessions.current_participants - 1 
      })
      .eq('id', booking.class_session_id);

    // Enregistrer la transaction de remboursement
    await supabaseAdmin
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount: booking.credits_used,
        type: 'refund',
        description: `Annulation ${booking.class_sessions.class_types.name}`,
        reference_id: booking.id
      });

    res.json({
      success: true,
      message: 'Réservation annulée. Vos crédits ont été remboursés.',
      refunded_credits: booking.credits_used
    });
  } catch (error) {
    console.error('Erreur annulation:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de l\'annulation' 
    });
  }
});

// Rejoindre la liste d'attente
router.post('/waiting-list', authMiddleware, async (req: any, res: Response) => {
  try {
    const { class_id } = req.body;
    const userId = req.user.id;

    // Vérifier si déjà en liste d'attente
    const { data: existing } = await supabaseAdmin
      .from('waiting_list')
      .select('id')
      .eq('user_id', userId)
      .eq('class_session_id', class_id)
      .single();

    if (existing) {
      return res.status(400).json({ 
        success: false,
        message: 'Vous êtes déjà en liste d\'attente pour ce cours' 
      });
    }

    // Ajouter à la liste d'attente
    const { data: waitingList, error } = await supabaseAdmin
      .from('waiting_list')
      .insert({
        user_id: userId,
        class_session_id: class_id,
        position: 0 // À implémenter : calculer la position
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Vous avez été ajouté à la liste d\'attente',
      waiting_list: waitingList
    });
  } catch (error) {
    console.error('Erreur liste d\'attente:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de l\'ajout à la liste d\'attente' 
    });
  }
});

export default router; 
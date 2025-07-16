const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS très permissive pour debug
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Route de test
app.get('/api/health', (req, res) => {
  console.log('✅ Health check OK');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Server is running'
  });
});

// Route login simplifiée pour test
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login attempt:', req.body);
  
  const { email, password } = req.body;
  
  // Validation basique
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email et mot de passe requis' 
    });
  }
  
  // Test avec admin (temporaire)
  if (email === 'admin@elaiastudio.ch' && password === 'admin123') {
    console.log('✅ Login successful for admin');
    return res.json({
      token: 'test-token-admin-123',
      user: {
        id: 1,
        email: 'admin@elaiastudio.ch',
        first_name: 'Admin',
        last_name: 'Test',
        role: 'admin'
      }
    });
  }
  
  // Test avec client (temporaire)
  if (email === 'marie.dupont@email.com' && password === 'client123') {
    console.log('✅ Login successful for client');
    return res.json({
      token: 'test-token-client-456',
      user: {
        id: 2,
        email: 'marie.dupont@email.com',
        first_name: 'Marie',
        last_name: 'Dupont',
        role: 'client'
      }
    });
  }
  
  console.log('❌ Invalid credentials');
  res.status(401).json({ error: 'Identifiants invalides' });
});

// Route register simplifiée
app.post('/api/auth/register', (req, res) => {
  console.log('📝 Register attempt:', req.body);
  
  res.json({
    message: 'Inscription temporairement désactivée - en mode debug',
    debug: true
  });
});

// === SIMULATION COMPLÈTE ELAIA STUDIO ===

// Route pour récupérer les statistiques admin
app.get('/api/admin/stats', (req, res) => {
  console.log('📊 Admin stats requested');
  
  res.json({
    active_clients: 127,
    revenue_this_month: 18450,
    bookings_this_month: 234,
    occupancy_rate: 73,
    new_clients_this_month: 12,
    retention_rate: 89,
    avg_sessions_per_client: 3.2,
    credits_sold_this_month: 1850,
    active_subscriptions: 89,
    growth: {
      active_clients: 15,
      revenue: 22,
      bookings: 18
    },
    popular_classes: [
      { name: 'Pilates Reformer Débutant', instructor: 'Sarah Martin', bookings: 87 },
      { name: 'Pilates Reformer Intermédiaire', instructor: 'Julie Dubois', bookings: 65 },
      { name: 'Pilates Yoga Mat', instructor: 'Emma Rousseau', bookings: 42 }
    ]
  });
});

// Route pour récupérer les réservations récentes (admin)
app.get('/api/admin/bookings', (req, res) => {
  console.log('📅 Admin bookings requested');
  
  res.json([
    {
      id: 1,
      client_name: 'Marie Dupont',
      client_email: 'marie.dupont@email.com',
      class_name: 'Pilates Reformer Débutant',
      start_time: '2024-12-07T10:00:00Z',
      status: 'confirmed'
    },
    {
      id: 2,
      client_name: 'Sophie Laurent',
      client_email: 'sophie.laurent@email.com',
      class_name: 'Pilates Yoga Mat',
      start_time: '2024-12-07T14:30:00Z',
      status: 'confirmed'
    },
    {
      id: 3,
      client_name: 'Camille Bernard',
      client_email: 'camille.bernard@email.com',
      class_name: 'Pilates Reformer Intermédiaire',
      start_time: '2024-12-07T18:00:00Z',
      status: 'confirmed'
    }
  ]);
});

// Route pour le planning
app.get('/api/classes/schedule', (req, res) => {
  console.log('📅 Schedule requested for date:', req.query.date);
  
  const baseDate = req.query.date || '2024-12-07';
  
  res.json([
    {
      id: 101,
      start_time: `${baseDate}T09:00:00Z`,
      end_time: `${baseDate}T10:15:00Z`,
      class_type_name: 'Pilates Reformer Débutant',
      credits_required: 3,
      available_spots: 2,
      max_participants: 8,
      instructor_first_name: 'Sarah',
      instructor_last_name: 'Martin'
    },
    {
      id: 102,
      start_time: `${baseDate}T10:30:00Z`,
      end_time: `${baseDate}T11:45:00Z`,
      class_type_name: 'Pilates Yoga Mat',
      credits_required: 2,
      available_spots: 5,
      max_participants: 12,
      instructor_first_name: 'Emma',
      instructor_last_name: 'Rousseau'
    },
    {
      id: 103,
      start_time: `${baseDate}T14:00:00Z`,
      end_time: `${baseDate}T15:15:00Z`,
      class_type_name: 'Pilates Reformer Intermédiaire',
      credits_required: 3,
      available_spots: 0,
      max_participants: 8,
      instructor_first_name: 'Julie',
      instructor_last_name: 'Dubois'
    },
    {
      id: 104,
      start_time: `${baseDate}T18:00:00Z`,
      end_time: `${baseDate}T19:15:00Z`,
      class_type_name: 'Pilates Reformer Avancé',
      credits_required: 3,
      available_spots: 3,
      max_participants: 6,
      instructor_first_name: 'Sarah',
      instructor_last_name: 'Martin'
    },
    {
      id: 105,
      start_time: `${baseDate}T19:30:00Z`,
      end_time: `${baseDate}T20:45:00Z`,
      class_type_name: 'Pilates Yoga Mat Détente',
      credits_required: 2,
      available_spots: 8,
      max_participants: 12,
      instructor_first_name: 'Emma',
      instructor_last_name: 'Rousseau'
    }
  ]);
});

// Route pour mes réservations
app.get('/api/bookings/my-bookings', (req, res) => {
  console.log('📋 My bookings requested, timeframe:', req.query.timeframe);
  
  const timeframe = req.query.timeframe;
  const today = new Date();
  
  if (timeframe === 'future') {
    // Réservations futures
    const futureDate1 = new Date(today);
    futureDate1.setDate(today.getDate() + 2);
    
    const futureDate2 = new Date(today);
    futureDate2.setDate(today.getDate() + 5);
    
    const futureDate3 = new Date(today);
    futureDate3.setDate(today.getDate() + 8);
    
    res.json([
      {
        id: 1,
        class_id: 101,
        start_time: futureDate1.toISOString().replace('T', 'T10:30:00.000').slice(0, -5) + 'Z',
        end_time: futureDate1.toISOString().replace('T', 'T11:45:00.000').slice(0, -5) + 'Z',
        class_type_name: '🧘 Pilates Reformer Débutant',
        credits_used: 3,
        status: 'confirmed',
        instructor_first_name: 'Sarah',
        instructor_last_name: 'Martin'
      },
      {
        id: 2,
        class_id: 102,
        start_time: futureDate2.toISOString().replace('T', 'T14:00:00.000').slice(0, -5) + 'Z',
        end_time: futureDate2.toISOString().replace('T', 'T15:00:00.000').slice(0, -5) + 'Z',
        class_type_name: '🌿 Pilates Yoga Mat Détente',
        credits_used: 2,
        status: 'confirmed',
        instructor_first_name: 'Emma',
        instructor_last_name: 'Rousseau'
      },
      {
        id: 3,
        class_id: 103,
        start_time: futureDate3.toISOString().replace('T', 'T18:00:00.000').slice(0, -5) + 'Z',
        end_time: futureDate3.toISOString().replace('T', 'T19:15:00.000').slice(0, -5) + 'Z',
        class_type_name: '💪 Pilates Reformer Intermédiaire',
        credits_used: 3,
        status: 'confirmed',
        instructor_first_name: 'Julie',
        instructor_last_name: 'Dubois'
      }
    ]);
  } else {
    // Historique (réservations passées)
    const pastDate1 = new Date(today);
    pastDate1.setDate(today.getDate() - 3);
    
    const pastDate2 = new Date(today);
    pastDate2.setDate(today.getDate() - 7);
    
    const pastDate3 = new Date(today);
    pastDate3.setDate(today.getDate() - 10);
    
    const pastDate4 = new Date(today);
    pastDate4.setDate(today.getDate() - 14);
    
    res.json([
      {
        id: 4,
        class_id: 201,
        start_time: pastDate1.toISOString().replace('T', 'T09:00:00.000').slice(0, -5) + 'Z',
        end_time: pastDate1.toISOString().replace('T', 'T10:15:00.000').slice(0, -5) + 'Z',
        class_type_name: '🧘 Pilates Reformer Débutant',
        credits_used: 3,
        status: 'completed',
        instructor_first_name: 'Sarah',
        instructor_last_name: 'Martin'
      },
      {
        id: 5,
        class_id: 202,
        start_time: pastDate2.toISOString().replace('T', 'T18:00:00.000').slice(0, -5) + 'Z',
        end_time: pastDate2.toISOString().replace('T', 'T19:00:00.000').slice(0, -5) + 'Z',
        class_type_name: '🌿 Pilates Yoga Mat Détente',
        credits_used: 2,
        status: 'completed',
        instructor_first_name: 'Emma',
        instructor_last_name: 'Rousseau'
      },
      {
        id: 6,
        class_id: 203,
        start_time: pastDate3.toISOString().replace('T', 'T11:00:00.000').slice(0, -5) + 'Z',
        end_time: pastDate3.toISOString().replace('T', 'T12:15:00.000').slice(0, -5) + 'Z',
        class_type_name: '💪 Pilates Reformer Intermédiaire',
        credits_used: 3,
        status: 'completed',
        instructor_first_name: 'Julie',
        instructor_last_name: 'Dubois'
      },
      {
        id: 7,
        class_id: 204,
        start_time: pastDate4.toISOString().replace('T', 'T16:30:00.000').slice(0, -5) + 'Z',
        end_time: pastDate4.toISOString().replace('T', 'T17:30:00.000').slice(0, -5) + 'Z',
        class_type_name: '🌿 Pilates Yoga Mat Détente',
        credits_used: 2,
        status: 'cancelled',
        instructor_first_name: 'Emma',
        instructor_last_name: 'Rousseau'
      }
    ]);
  }
});

// Route pour mon abonnement (deux endpoints pour compatibilité)
app.get('/api/subscriptions/mine', (req, res) => {
  console.log('💳 My subscription requested');
  
  const authHeader = req.headers.authorization;
  const token = authHeader?.substring(7);
  
  if (token === 'test-token-admin-123') {
    res.json({
      subscription: {
        id: 1,
        plan_name: 'Pack 30 crédits',
        plan_type: 'credits',
        credits_remaining: adminCredits,
        end_date: '2025-06-15',
        usage_stats: {
          total_bookings: 8
        }
      }
    });
  } else if (token === 'test-token-client-456') {
    res.json({
      subscription: {
        id: 2,
        plan_name: 'Pack 50 crédits',
        plan_type: 'credits',
        credits_remaining: clientCredits,
        end_date: '2024-04-15',
        usage_stats: {
          total_bookings: 5
        }
      }
    });
  } else {
    res.status(401).json({ error: 'Token invalide' });
  }
});

// Route pour l'abonnement (endpoint que le frontend appelle)
app.get('/api/credits/subscription', (req, res) => {
  console.log('💳 Credits subscription requested (frontend endpoint)');
  
  const authHeader = req.headers.authorization;
  const token = authHeader?.substring(7);
  
  if (token === 'test-token-admin-123') {
    res.json({
      subscription: {
        id: 1,
        plan_name: 'Pack 30 crédits',
        plan_type: 'credits',
        credits_remaining: adminCredits,
        total_credits: 30,
        end_date: '2025-06-15',
        usage_stats: {
          total_bookings: 8
        }
      }
    });
  } else if (token === 'test-token-client-456') {
    res.json({
      subscription: {
        id: 2,
        plan_name: 'Pack 50 crédits',
        plan_type: 'credits',
        credits_remaining: clientCredits,
        total_credits: 50,
        end_date: '2024-04-15',
        usage_stats: {
          total_bookings: 5
        }
      }
    });
  } else {
    res.status(401).json({ error: 'Token invalide' });
  }
});

// Route alternative pour les crédits (si l'app appelle cette route)
app.get('/api/credits/mine', (req, res) => {
  console.log('💰 My credits requested');
  
  const authHeader = req.headers.authorization;
  const token = authHeader?.substring(7);
  
  if (token === 'test-token-admin-123') {
    res.json({
      credits_remaining: adminCredits,
      plan_name: 'Pack 30 crédits',
      total_credits: 30,
      credits_used: 30 - adminCredits
    });
  } else if (token === 'test-token-client-456') {
    res.json({
      credits_remaining: clientCredits,
      plan_name: 'Pack 50 crédits',
      total_credits: 50,
      credits_used: 50 - clientCredits
    });
  } else {
    res.status(401).json({ error: 'Token invalide' });
  }
});

// Route pour les plans d'abonnement
app.get('/api/subscriptions/plans', (req, res) => {
  console.log('💰 Subscription plans requested');
  
  res.json([
    // Plans crédits
    {
      id: 1,
      name: 'Pack 30 crédits',
      type: 'credits',
      price: 330,
      credits: 30,
      description: 'Environ 10 séances Pilates Reformer'
    },
    {
      id: 2,
      name: 'Pack 50 crédits',
      type: 'credits',
      price: 500,
      credits: 50,
      description: 'Environ 16 séances Pilates Reformer'
    },
    {
      id: 3,
      name: 'Pack 70 crédits',
      type: 'credits',
      price: 630,
      credits: 70,
      description: 'Environ 23 séances Pilates Reformer'
    },
    // Plans mensuels
    {
      id: 4,
      name: 'Abonnement 1 fois par semaine',
      type: 'monthly',
      price: 120,
      max_bookings_per_week: 1,
      description: '4 séances par mois'
    },
    {
      id: 5,
      name: 'Abonnement 2 fois par semaine',
      type: 'monthly',
      price: 200,
      max_bookings_per_week: 2,
      description: '8 séances par mois'
    },
    {
      id: 6,
      name: 'Abonnement illimité',
      type: 'monthly',
      price: 280,
      max_bookings_per_week: null,
      description: 'Accès illimité à tous les cours'
    }
  ]);
});

// Variables pour simuler les crédits en temps réel
let adminCredits = 50; // Crédits augmentés pour l'admin
let clientCredits = 67; // Crédits augmentés pour le client

// Route pour réserver un cours
app.post('/api/bookings/book/:classId', (req, res) => {
  console.log('🎯 Booking class:', req.params.classId);
  
  const classId = parseInt(req.params.classId);
  const authHeader = req.headers.authorization;
  const token = authHeader?.substring(7);
  
  // Simulation : cours 103 est complet
  if (classId === 103) {
    return res.status(400).json({
      error: 'Ce cours est complet',
      suggest_waiting_list: true
    });
  }
  
  // Déterminer le coût en crédits
  const creditsRequired = (classId === 102 || classId === 105) ? 2 : 3;
  
  // Déduire les crédits selon le token
  if (token === 'test-token-admin-123') {
    if (adminCredits >= creditsRequired) {
      adminCredits -= creditsRequired;
      console.log(`✅ Admin booking successful. Crédits restants: ${adminCredits}`);
    } else {
      return res.status(400).json({
        error: 'Crédits insuffisants',
        credits_remaining: adminCredits,
        credits_required: creditsRequired
      });
    }
  } else if (token === 'test-token-client-456') {
    if (clientCredits >= creditsRequired) {
      clientCredits -= creditsRequired;
      console.log(`✅ Client booking successful. Crédits restants: ${clientCredits}`);
    } else {
      return res.status(400).json({
        error: 'Crédits insuffisants',
        credits_remaining: clientCredits,
        credits_required: creditsRequired
      });
    }
  }
  
  // Simulation : succès
  res.json({
    message: 'Réservation confirmée !',
    booking: {
      id: Math.floor(Math.random() * 1000),
      class_id: classId,
      status: 'confirmed',
      credits_used: creditsRequired
    },
    credits_remaining: token === 'test-token-admin-123' ? adminCredits : clientCredits
  });
});

// Route pour annuler une réservation
app.post('/api/bookings/cancel/:bookingId', (req, res) => {
  console.log('❌ Cancelling booking:', req.params.bookingId);
  
  const bookingId = parseInt(req.params.bookingId);
  const authHeader = req.headers.authorization;
  const token = authHeader?.substring(7);
  
  if (!token || (token !== 'test-token-admin-123' && token !== 'test-token-client-456')) {
    return res.status(401).json({ error: 'Token invalide' });
  }
  
  // Simuler la récupération de la réservation pour valider l'annulation
  // En réalité, on vérifierait en base de données
  
  // Pour la simulation, on suppose que toutes les réservations futures peuvent être annulées
  // sauf si c'est moins de 12h avant
  
  // Rembourser les crédits (simulation)
  const creditsToRefund = bookingId <= 3 ? 3 : 2; // Estimation basée sur l'ID
  
  if (token === 'test-token-admin-123') {
    adminCredits += creditsToRefund;
    console.log(`✅ Booking ${bookingId} cancelled. ${creditsToRefund} crédits remboursés à l'admin. Total: ${adminCredits}`);
  } else if (token === 'test-token-client-456') {
    clientCredits += creditsToRefund;
    console.log(`✅ Booking ${bookingId} cancelled. ${creditsToRefund} crédits remboursés au client. Total: ${clientCredits}`);
  }
  
  res.json({
    message: 'Réservation annulée avec succès',
    booking_id: bookingId,
    credits_refunded: creditsToRefund,
    credits_remaining: token === 'test-token-admin-123' ? adminCredits : clientCredits
  });
});

// Route pour "recharger" les crédits (pour la démo)
app.post('/api/credits/reload', (req, res) => {
  console.log('🔄 Reloading credits for demo');
  
  const authHeader = req.headers.authorization;
  const token = authHeader?.substring(7);
  
  if (token === 'test-token-admin-123') {
    adminCredits = 24; // Reset admin credits
    console.log('✅ Admin credits reloaded to 24');
    res.json({
      message: 'Crédits rechargés !',
      credits_remaining: adminCredits
    });
  } else if (token === 'test-token-client-456') {
    clientCredits = 37; // Reset client credits
    console.log('✅ Client credits reloaded to 37');
    res.json({
      message: 'Crédits rechargés !',
      credits_remaining: clientCredits
    });
  } else {
    res.status(401).json({ error: 'Token invalide' });
  }
});

// Route pour ajouter des crédits à un utilisateur (ADMIN seulement)
app.post('/api/admin/add-credits', (req, res) => {
  console.log('💰 Admin adding credits:', req.body);
  
  const authHeader = req.headers.authorization;
  const token = authHeader?.substring(7);
  
  // Vérifier que c'est un admin
  if (token !== 'test-token-admin-123') {
    return res.status(403).json({ error: 'Accès refusé - Admin requis' });
  }
  
  const { userEmail, credits } = req.body;
  
  if (!userEmail || !credits || credits <= 0) {
    return res.status(400).json({ 
      error: 'Email utilisateur et nombre de crédits (positif) requis' 
    });
  }
  
  // Ajouter les crédits selon l'utilisateur
  if (userEmail === 'admin@elaiastudio.ch') {
    adminCredits += parseInt(credits);
    console.log(`✅ ${credits} crédits ajoutés à l'admin. Total: ${adminCredits}`);
    res.json({
      message: `${credits} crédits ajoutés avec succès !`,
      user_email: userEmail,
      credits_added: credits,
      credits_remaining: adminCredits
    });
  } else if (userEmail === 'marie.dupont@email.com') {
    clientCredits += parseInt(credits);
    console.log(`✅ ${credits} crédits ajoutés au client. Total: ${clientCredits}`);
    res.json({
      message: `${credits} crédits ajoutés avec succès !`,
      user_email: userEmail,
      credits_added: credits,
      credits_remaining: clientCredits
    });
  } else {
    res.status(404).json({ 
      error: 'Utilisateur non trouvé',
      available_users: [
        'admin@elaiastudio.ch',
        'marie.dupont@email.com'
      ]
    });
  }
});

// Route pour obtenir la liste des utilisateurs (ADMIN seulement)
app.get('/api/admin/users', (req, res) => {
  console.log('👥 Admin requesting users list');
  
  const authHeader = req.headers.authorization;
  const token = authHeader?.substring(7);
  
  // Vérifier que c'est un admin
  if (token !== 'test-token-admin-123') {
    return res.status(403).json({ error: 'Accès refusé - Admin requis' });
  }
  
  res.json([
    {
      id: 1,
      email: 'admin@elaiastudio.ch',
      first_name: 'Admin',
      last_name: 'Test',
      role: 'admin',
      credits_remaining: adminCredits
    },
    {
      id: 2,
      email: 'marie.dupont@email.com',
      first_name: 'Marie',
      last_name: 'Dupont',
      role: 'client',
      credits_remaining: clientCredits
    }
  ]);
});

// Route me pour vérification du token
app.get('/api/auth/me', (req, res) => {
  console.log('👤 Me route called');
  console.log('Authorization header:', req.headers.authorization);
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No valid token provided');
    return res.status(401).json({ error: 'Token manquant' });
  }
  
  const token = authHeader.substring(7); // Remove "Bearer "
  
  // Vérification des tokens de test
  if (token === 'test-token-admin-123') {
    console.log('✅ Valid admin test token');
    return res.json({
      user: {
        id: 1,
        email: 'admin@elaiastudio.ch',
        first_name: 'Admin',
        last_name: 'Test',
        role: 'admin',
        // Ajouter les infos d'abonnement directement dans le user
        subscription: {
          id: 1,
          plan_name: 'Pack 30 crédits',
          plan_type: 'credits',
          credits_remaining: adminCredits,
          end_date: '2025-06-15',
          usage_stats: { total_bookings: 8 }
        }
      }
    });
  }
  
  if (token === 'test-token-client-456') {
    console.log('✅ Valid client test token');
    return res.json({
      user: {
        id: 2,
        email: 'marie.dupont@email.com',
        first_name: 'Marie',
        last_name: 'Dupont',
        role: 'client',
        // Ajouter les infos d'abonnement directement dans le user
        subscription: {
          id: 2,
          plan_name: 'Pack 50 crédits',
          plan_type: 'credits',
          credits_remaining: clientCredits,
          end_date: '2024-04-15',
          usage_stats: { total_bookings: 5 }
        }
      }
    });
  }
  
  console.log('❌ Invalid token:', token);
  res.status(401).json({ error: 'Token invalide' });
});

// Route pour l'historique des crédits
app.get('/api/credits/history', (req, res) => {
  console.log('📊 Credits history requested');
  
  const authHeader = req.headers.authorization;
  const token = authHeader?.substring(7);
  
  if (token === 'test-token-admin-123') {
    res.json([
      {
        id: 1,
        type: 'purchase',
        amount: 30,
        description: 'Achat Pack 30 crédits',
        date: '2024-11-15T10:00:00Z',
        remaining_after: 30
      },
      {
        id: 2,
        type: 'usage',
        amount: -3,
        description: 'Réservation Pilates Reformer Débutant',
        date: '2024-11-20T09:00:00Z',
        remaining_after: 27
      },
      {
        id: 3,
        type: 'refund',
        amount: 2,
        description: 'Remboursement annulation',
        date: '2024-11-25T14:30:00Z',
        remaining_after: 29
      }
    ]);
  } else if (token === 'test-token-client-456') {
    res.json([
      {
        id: 4,
        type: 'purchase',
        amount: 50,
        description: 'Achat Pack 50 crédits',
        date: '2024-10-01T14:00:00Z',
        remaining_after: 50
      },
      {
        id: 5,
        type: 'usage',
        amount: -2,
        description: 'Réservation Pilates Yoga Mat',
        date: '2024-10-05T18:00:00Z',
        remaining_after: 48
      },
      {
        id: 6,
        type: 'usage',
        amount: -3,
        description: 'Réservation Pilates Reformer',
        date: '2024-10-12T11:00:00Z',
        remaining_after: 45
      }
    ]);
  } else {
    res.status(401).json({ error: 'Token invalide' });
  }
});

// Route pour les clients admin (simulation)
app.get('/api/admin/clients', (req, res) => {
  console.log('👥 Admin clients requested with params:', req.query);
  
  const authHeader = req.headers.authorization;
  const token = authHeader?.substring(7);
  
  if (token !== 'test-token-admin-123') {
    return res.status(403).json({ error: 'Accès refusé - Admin requis' });
  }
  
  const { registered_after, limit = 10 } = req.query;
  
  // Simulation de clients récents
  const clients = [
    {
      id: 1,
      email: 'marie.dupont@email.com',
      first_name: 'Marie',
      last_name: 'Dupont',
      registered_at: '2024-12-01T10:00:00Z',
      credits_remaining: clientCredits,
      total_bookings: 5
    },
    {
      id: 2,
      email: 'jean.martin@email.com',
      first_name: 'Jean',
      last_name: 'Martin',
      registered_at: '2024-11-28T15:30:00Z',
      credits_remaining: 25,
      total_bookings: 3
    },
    {
      id: 3,
      email: 'sophie.bernard@email.com',
      first_name: 'Sophie',
      last_name: 'Bernard',
      registered_at: '2024-11-25T09:15:00Z',
      credits_remaining: 42,
      total_bookings: 8
    }
  ];
  
  // Filtrer par date si fournie
  let filteredClients = clients;
  if (registered_after) {
    const filterDate = new Date(registered_after);
    filteredClients = clients.filter(client => 
      new Date(client.registered_at) >= filterDate
    );
  }
  
  res.json(filteredClients.slice(0, parseInt(limit)));
});

// Catch all 404
app.use('*', (req, res) => {
  console.log('❓ Route not found:', req.method, req.originalUrl);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Debug server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://0.0.0.0:${PORT}/api/health`);
});

module.exports = app; 
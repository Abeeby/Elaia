import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { supabaseAdmin } from './config/supabase';

// Import routes
import authDirectRoutes from './routes/auth-direct';
import bookingsRoutes from './routes/bookings-supabase';
import creditsRoutes from './routes/credits-supabase';
import adminRoutes from './routes/admin-supabase';
import paymentsRoutes from './routes/payments';
// Commenté car utilise database-pg
// import { authMiddleware } from './middleware/auth';

// Middleware d'authentification temporaire pour Supabase
const authMiddleware = async (req: any, res: express.Response, next: express.NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token d\'authentification manquant' });
    }

    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'secret') as any;
    
    // Vérifier que l'utilisateur existe avec Supabase
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single();
    
    if (error || !user) {
      console.error('Erreur récupération utilisateur:', error);
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur vérification token:', error);
    return res.status(403).json({ message: 'Token invalide' });
  }
};

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'ELAÏA Studio API avec Supabase',
    timestamp: new Date().toISOString()
  });
});

// Auth routes (Supabase)
app.use('/api/auth', authDirectRoutes);

// Bookings routes (Supabase)
app.use('/api/bookings', bookingsRoutes);

// Credits routes (Supabase)
app.use('/api/credits', creditsRoutes);

// Admin routes (Supabase)
app.use('/api/admin', adminRoutes);

// Payments routes (Payrexx)
app.use('/api/payments', paymentsRoutes);

// Protected routes example
app.get('/api/users/profile', authMiddleware, async (req: any, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      user: data
    });
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération du profil' 
    });
  }
});

// Classes routes
app.get('/api/classes/schedule', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('class_sessions')
      .select(`
        *,
        class_types (*)
      `)
      .gte('start_time', new Date().toISOString())
      .order('start_time');

    if (error) throw error;

    res.json({
      success: true,
      classes: data
    });
  } catch (error) {
    console.error('Erreur récupération planning:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération du planning' 
    });
  }
});

// (routes /api/credits/* gérées par creditsRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Une erreur est survenue',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
async function startServer() {
  try {
    // Test Supabase connection
    const { data, error } = await supabaseAdmin
      .from('subscription_plans')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Erreur connexion Supabase:', error);
      console.log('📝 Assurez-vous d\'avoir :');
      console.log('   1. Configuré vos clés Supabase dans .env');
      console.log('   2. Créé les tables avec le script SQL');
      console.log('   3. Vérifié votre connexion internet');
    } else {
      console.log('✅ Connexion Supabase établie');
    }

    // Éviter EADDRINUSE lors des redémarrages nodemon
    const server = app.listen(PORT, () => {
      console.log(`🚀 Serveur ELAÏA Studio démarré sur le port ${PORT}`);
      console.log(`📍 API disponible sur http://localhost:${PORT}/api`);
      console.log(`🔗 Supabase: ${process.env.SUPABASE_URL}`);
    });
    server.on('error', (err: any) => {
      if (err?.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} déjà utilisé. Relancez en stoppant les autres instances.`);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('❌ Erreur démarrage serveur:', error);
    process.exit(1);
  }
}

startServer(); 
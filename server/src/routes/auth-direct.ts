import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const router = Router();

// Validation des champs
const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('first_name').notEmpty().trim(),
  body('last_name').notEmpty().trim(),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('city').optional().trim(),
  body('postal_code').optional().trim()
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

// Route d'inscription
router.post('/register', validateRegister, async (req: Request, res: Response) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, first_name, last_name, phone, address, city, postal_code } = req.body;

    // Vérifier si l'email existe déjà
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Cet email est déjà utilisé' 
      });
    }

    // Hasher le mot de passe
    const password_hash = await bcrypt.hash(password, 10);

    // Créer le profil utilisateur
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password_hash,
        first_name,
        last_name,
        phone,
        address,
        city,
        postal_code,
        role: 'client',
        credits: 5,
        is_verified: true
      })
      .select()
      .single();

    if (userError) {
      console.error('Erreur création profil:', userError);
      throw userError;
    }

    // Ajouter une transaction pour les crédits de bienvenue
    await supabaseAdmin
      .from('credit_transactions')
      .insert({
        user_id: userData.id,
        amount: 5,
        type: 'welcome_bonus',
        description: 'Crédits de bienvenue - Pack découverte',
        reference_id: userData.id
      });

    // Générer un token JWT
    const token = jwt.sign(
      { 
        id: userData.id, 
        email: userData.email, 
        role: userData.role,
        first_name: userData.first_name,
        last_name: userData.last_name
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Inscription réussie ! Bienvenue chez ELAÏA Studio',
      token,
      user: {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        credits: userData.credits
      }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Route de connexion
router.post('/login', validateLogin, async (req: Request, res: Response) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Récupérer l'utilisateur
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      console.error('Utilisateur non trouvé:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Email ou mot de passe incorrect' 
      });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, userData.password_hash);
    
    if (!validPassword) {
      console.error('Mot de passe invalide pour:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Email ou mot de passe incorrect' 
      });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { 
        id: userData.id, 
        email: userData.email, 
        role: userData.role,
        first_name: userData.first_name,
        last_name: userData.last_name
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        credits: userData.credits,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        postal_code: userData.postal_code
      }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la connexion',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Route de déconnexion
router.post('/logout', async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    console.error('Erreur déconnexion:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la déconnexion' 
    });
  }
});

// Route pour vérifier le token
router.get('/verify', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Token manquant' 
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
      
      // Récupérer les données utilisateur actualisées
      const { data: userData, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', decoded.id)
        .single();

      if (error || !userData) {
        throw new Error('Utilisateur introuvable');
      }

      res.json({
        success: true,
        valid: true,
        user: {
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          credits: userData.credits
        }
      });
    } catch (error) {
      res.status(401).json({ 
        success: false,
        valid: false,
        message: 'Token invalide' 
      });
    }
  } catch (error) {
    console.error('Erreur vérification:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la vérification' 
    });
  }
});

// Route pour récupérer le profil
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Token manquant' 
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    
    const { data: userData, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (error || !userData) {
      return res.status(404).json({ 
        success: false,
        message: 'Utilisateur introuvable' 
      });
    }

    res.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        credits: userData.credits,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        postal_code: userData.postal_code
      }
    });
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération du profil' 
    });
  }
});

export default router; 
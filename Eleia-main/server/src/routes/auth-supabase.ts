import { Router, Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase';
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

    // Créer l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name
      }
    });

    if (authError) {
      console.error('Erreur Supabase Auth:', authError);
      if (authError.message.includes('already registered')) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }
      throw authError;
    }

    // Créer le profil utilisateur dans la table users
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        first_name,
        last_name,
        phone,
        address,
        city,
        postal_code,
        role: 'client',
        credits: 0,
        is_verified: true
      })
      .select()
      .single();

    if (userError) {
      console.error('Erreur création profil:', userError);
      // Si erreur, supprimer l'utilisateur Auth créé
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw userError;
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
      process.env.JWT_SECRET!,
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

    // Authentifier avec Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Erreur authentification:', authError);
      return res.status(401).json({ 
        success: false,
        message: 'Email ou mot de passe incorrect' 
      });
    }

    // Récupérer le profil utilisateur complet
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError || !userData) {
      console.error('Erreur récupération profil:', userError);
      return res.status(404).json({ 
        success: false,
        message: 'Profil utilisateur introuvable' 
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
      process.env.JWT_SECRET!,
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
    await supabase.auth.signOut();
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      // Récupérer les données utilisateur actualisées
      const { data: userData, error } = await supabase
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

export default router; 
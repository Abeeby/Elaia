# Guide d'Intégration Supabase pour ELAÏA Studio

## 🚀 Vue d'ensemble

Ce guide vous aide à connecter votre compte Supabase Pro avec ELAÏA Studio pour bénéficier de :
- Base de données PostgreSQL hébergée
- Authentification intégrée
- API REST automatique
- Interface d'administration
- Sécurité Row Level Security (RLS)

## 📋 Prérequis

- Un compte Supabase (gratuit ou pro)
- Votre projet ELAÏA Studio

## 🔧 Configuration Supabase

### 1. **Créer un nouveau projet Supabase**

1. Allez sur [app.supabase.com](https://app.supabase.com)
2. Cliquez sur "New Project"
3. Configurez :
   - **Name** : `elaia-studio`
   - **Database Password** : Notez-le bien !
   - **Region** : Choisissez la plus proche (ex: Frankfurt pour l'Europe)

### 2. **Récupérer vos clés**

Dans votre projet Supabase :
1. Allez dans **Settings > API**
2. Copiez :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public** : Clé publique
   - **service_role** : Clé privée (gardez-la secrète !)

### 3. **Créer les tables**

1. Dans Supabase, allez dans **SQL Editor**
2. Créez une nouvelle requête
3. Copiez-collez le contenu de `server/supabase/schema-elaia.sql`
4. Exécutez la requête

## 🔐 Configuration du Backend

### 1. **Créer le fichier .env**

Dans le dossier `server`, créez un fichier `.env` :

```env
# Environment
NODE_ENV=development

# Server
PORT=5001

# JWT
JWT_SECRET=votre-secret-jwt-tres-long-et-securise

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. **Mettre à jour les routes d'authentification**

Créez `server/src/routes/auth-supabase.ts` :

```typescript
import { Router } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase';
import jwt from 'jsonwebtoken';

const router = Router();

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, address, city, postal_code } = req.body;

    // Créer l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) throw authError;

    // Créer le profil utilisateur
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
        postal_code
      })
      .select()
      .single();

    if (userError) throw userError;

    // Générer un token JWT
    const token = jwt.sign(
      { id: userData.id, email: userData.email, role: userData.role },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authentifier avec Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw authError;

    // Récupérer le profil utilisateur
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) throw userError;

    // Générer un token JWT
    const token = jwt.sign(
      { id: userData.id, email: userData.email, role: userData.role },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(401).json({ message: 'Email ou mot de passe incorrect' });
  }
});

export default router;
```

## 🎨 Configuration du Frontend

### 1. **Installer le client Supabase**

```bash
cd client
npm install @supabase/supabase-js
```

### 2. **Créer la configuration Supabase**

Créez `client/src/lib/supabase.ts` :

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3. **Créer le fichier .env**

Dans le dossier `client`, créez un fichier `.env` :

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📱 Utilisation dans l'Application

### Exemple : Récupérer les cours

```typescript
// Dans un composant React
import { supabase } from '../lib/supabase';

const fetchClasses = async () => {
  const { data, error } = await supabase
    .from('class_sessions')
    .select(`
      *,
      class_types (*)
    `)
    .gte('start_time', new Date().toISOString())
    .order('start_time');

  if (error) console.error('Erreur:', error);
  return data;
};
```

### Exemple : Créer une réservation

```typescript
const bookClass = async (classSessionId: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: currentUser.id,
      class_session_id: classSessionId,
      credits_used: 3
    });

  if (error) console.error('Erreur:', error);
  return data;
};
```

## 🔒 Sécurité

### 1. **Activer RLS (Row Level Security)**

Dans Supabase, activez RLS pour toutes vos tables :
- Allez dans **Database > Tables**
- Pour chaque table, cliquez sur **RLS** et activez-le

### 2. **Créer des politiques**

Exemple de politique pour les réservations :

```sql
-- Les utilisateurs peuvent voir leurs propres réservations
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs propres réservations
CREATE POLICY "Users can create own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 🚀 Déploiement

### 1. **Variables d'environnement en production**

Sur votre plateforme de déploiement (Vercel, Netlify, etc.), ajoutez :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (backend uniquement)
- `JWT_SECRET`

### 2. **Domaine personnalisé**

Dans Supabase :
1. Allez dans **Settings > API**
2. Configurez votre domaine personnalisé

## 📊 Monitoring

### Dashboard Supabase

Surveillez :
- **Database** : Utilisation et performances
- **Auth** : Utilisateurs actifs
- **Storage** : Si vous stockez des images
- **API** : Requêtes et limites

## 🆘 Dépannage

### Erreur CORS
Ajoutez votre domaine dans **Settings > API > CORS**

### Erreur d'authentification
Vérifiez que les clés sont correctes et que RLS est configuré

### Performance
- Créez des index sur les colonnes fréquemment recherchées
- Utilisez la pagination pour les grandes listes

## ✨ Avantages de Supabase

- ✅ Base de données PostgreSQL complète
- ✅ Authentification intégrée (email, OAuth)
- ✅ API REST et GraphQL automatiques
- ✅ Temps réel avec les subscriptions
- ✅ Stockage de fichiers intégré
- ✅ Interface d'administration
- ✅ Backups automatiques (version Pro)
- ✅ Scaling automatique

## 🎯 Prochaines étapes

1. Migrer les données existantes vers Supabase
2. Implémenter l'authentification Supabase
3. Utiliser le stockage Supabase pour les images
4. Activer les fonctionnalités temps réel
5. Configurer les webhooks pour les notifications

Votre application ELAÏA Studio est maintenant prête à utiliser Supabase ! 🚀 
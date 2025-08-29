# 🚀 Guide de Configuration Supabase pour ELAÏA Studio

## 📋 **INFORMATIONS REQUISES POUR SUPABASE**

Voici toutes les informations dont vous avez besoin pour configurer Supabase :

---

## 🔑 **1. CRÉATION DU PROJET SUPABASE**

### **Étape 1 : Créer votre compte**
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Vérifiez votre email

### **Étape 2 : Créer un nouveau projet**
1. Cliquez sur "New Project"
2. Remplissez :
   - **Name** : `elaia-studio`
   - **Database Password** : Choisissez un mot de passe fort
   - **Region** : `EU West (Ireland)` ou `EU West (London)`
3. Cliquez sur "Create new project"

### **Étape 3 : Attendre l'initialisation**
- Cela prend environ 2 minutes
- Vous recevrez un email de confirmation

---

## 🗝️ **2. RÉCUPÉRER LES CLÉS API**

### **Dans votre projet Supabase :**

1. **Allez dans Settings → API**
2. **Copiez ces valeurs :**

```env
# URL de votre projet Supabase
SUPABASE_URL=https://jtazaosrsymffhxmwfyo.supabase.co

# Clé publique (safe pour le frontend)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0YXphb3Nyc3ltZmZoeG13ZnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDMwOTMsImV4cCI6MjA2NDcxOTA5M30.0zQU2GfAt-JExka_3lYRCt6WBeHHg_ZY6gXeHHppuHg

# Clé service (privée - ne jamais exposer)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0YXphb3Nyc3ltZmZoeG13ZnlvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTE0MzA5MywiZXhwIjoyMDY0NzE5MDkzfQ.OB1v7n0jUkSZoMUHtaPOivg8CfzGOFjvvLCuKkMzWeU
```

---

## 💾 **3. CONFIGURATION DE LA BASE DE DONNÉES**

### **Étape 1 : Exécuter le schéma SQL**

1. Dans Supabase, allez dans **SQL Editor**
2. Ouvrez un nouvel onglet
3. Copiez-collez le contenu du fichier :
   ```
   server/supabase/schema-elaia.sql
   ```
4. Cliquez sur **Run**

### **Étape 2 : Vérifier les tables créées**

Vous devriez voir ces tables dans **Database → Tables** :
- ✅ `users` - Profils utilisateurs
- ✅ `subscription_plans` - Plans d'abonnement
- ✅ `user_subscriptions` - Abonnements actifs
- ✅ `class_types` - Types de cours
- ✅ `class_sessions` - Sessions programmées
- ✅ `bookings` - Réservations
- ✅ `credit_transactions` - Historique crédits
- ✅ `payments` - Paiements Stripe

---

## 🔐 **4. CONFIGURATION DES VARIABLES D'ENVIRONNEMENT**

### **Côté Serveur (`server/.env`)**

Créez le fichier `server/.env` :

```env
# Configuration Serveur
PORT=5000
NODE_ENV=development

# JWT (générez une clé secrète)
JWT_SECRET=pFnDoldM8AS8iMqznYVhi+bNL9wt6cV5samQyV3o/wYi8jwa7EMP6id4ysYi+/5vUnntUDaVui85n4C+sWyFvA==

# Supabase
SUPABASE_URL=https://jtazaosrsymffhxmwfyo.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0YXphb3Nyc3ltZmZoeG13ZnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDMwOTMsImV4cCI6MjA2NDcxOTA5M30.0zQU2GfAt-JExka_3lYRCt6WBeHHg_ZY6gXeHHppuHg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0YXphb3Nyc3ltZmZoeG13ZnlvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTE0MzA5MywiZXhwIjoyMDY0NzE5MDkzfQ.OB1v7n0jUkSZoMUHtaPOivg8CfzGOFjvvLCuKkMzWeU

# Stripe (nous allons les configurer après)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### **Côté Client (`client/.env`)**

Créez le fichier `client/.env` :

```env
# API Backend
VITE_API_URL=http://localhost:5000/api

# Supabase Frontend
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe Frontend
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Environnement
VITE_APP_ENV=development
```

---

## 👥 **5. CRÉATION DES COMPTES DE TEST**

### **Étape 1 : Créer les utilisateurs dans Supabase Auth**

1. Allez dans **Authentication → Users**
2. Cliquez sur **Add user**
3. Créez ces comptes :

#### **Client Test :**
- **Email** : `test@elaia-studio.ch`
- **Password** : `Test123!`
- **Auto confirm user** : ✅ Oui

#### **Admin :**
- **Email** : `admin@elaia-studio.ch`
- **Password** : `Admin123!`
- **Auto confirm user** : ✅ Oui

### **Étape 2 : Ajouter les profils utilisateurs**

Exécutez cette requête SQL dans **SQL Editor** :

```sql
-- Créer les profils utilisateurs
INSERT INTO users (id, email, first_name, last_name, role, credits, is_verified)
VALUES
  -- Récupérer l'ID de l'utilisateur créé dans Supabase Auth
  ((SELECT id FROM auth.users WHERE email = 'test@elaia-studio.ch'),
   'test@elaia-studio.ch', 'Marie', 'Dubois', 'client', 5, true),

  ((SELECT id FROM auth.users WHERE email = 'admin@elaia-studio.ch'),
   'admin@elaia-studio.ch', 'Admin', 'Elaia', 'admin', 1000, true);
```

---

## 💳 **6. CONFIGURATION STRIPE (OPTIONNEL)**

### **Si vous voulez activer les paiements :**

1. Allez sur [stripe.com](https://stripe.com)
2. Créez un compte (ou utilisez un compte existant)
3. Allez dans **Developers → API keys**
4. Copiez les clés :

```env
# Clé secrète (serveur uniquement)
STRIPE_SECRET_KEY=sk_test_...

# Clé publique (client)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### **Configuration des webhooks :**
1. Dans Stripe, allez dans **Developers → Webhooks**
2. Ajoutez cette URL : `https://votre-domaine.com/api/payments/webhook`
3. Sélectionnez l'événement : `checkout.session.completed`
4. Copiez le **Webhook Secret**

---

## 🎯 **7. TEST DE LA CONFIGURATION**

### **Étape 1 : Démarrer l'application**

```bash
# Dans le répertoire racine
.\start-supabase.ps1
```

### **Étape 2 : Tester les fonctionnalités**

1. **Connexion :**
   - Allez sur http://localhost:5173
   - Utilisez `test@elaia-studio.ch` / `Test123!`

2. **Dashboard Admin :**
   - Utilisez `admin@elaia-studio.ch` / `Admin123!`
   - Vérifiez que les données s'affichent

3. **Planning :**
   - Vérifiez que les cours apparaissent
   - Essayez de faire une réservation

---

## 🚨 **PROBLÈMES COURANTS**

### **Erreur de connexion Supabase :**
- ✅ Vérifiez que les clés sont correctes
- ✅ Vérifiez que le projet n'est pas en pause
- ✅ Vérifiez la connectivité réseau

### **Tables non créées :**
- ✅ Relancez le script SQL
- ✅ Vérifiez les permissions
- ✅ Vérifiez les erreurs dans la console SQL

### **Authentification qui ne marche pas :**
- ✅ Vérifiez que les utilisateurs sont confirmés
- ✅ Vérifiez les rôles dans la table `users`
- ✅ Vérifiez les politiques RLS

---

## 📊 **DONNÉES DE TEST DISPONIBLES**

Après configuration, vous aurez :

- ✅ **2 utilisateurs** (1 client, 1 admin)
- ✅ **4 types de cours** (Pilates Reformer + Yoga)
- ✅ **3 packs de crédits** (10, 30, 50 crédits)
- ✅ **3 abonnements mensuels** (1x, 2x, illimité/semaine)

---

## 🎉 **PRÊT À L'EMPLOI !**

Une fois configuré, votre application ELAÏA Studio sera complètement fonctionnelle avec :

- ✅ Authentification sécurisée
- ✅ Système de réservations
- ✅ Gestion des crédits
- ✅ Dashboard administrateur
- ✅ Paiements Stripe (optionnel)
- ✅ Notifications push
- ✅ PWA prête

**N'hésitez pas si vous avez des questions ! 🚀**

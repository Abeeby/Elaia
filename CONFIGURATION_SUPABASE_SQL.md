# Configuration Supabase SQL

## Problèmes identifiés

1. **Erreur SSL PostgreSQL** : Le serveur essayait de se connecter à une base PostgreSQL locale
2. **Erreur de récursion infinie** : Les politiques RLS étaient configurées pour Supabase Auth natif

## Solution

### 1. Désactiver les politiques RLS

Connectez-vous à votre tableau de bord Supabase et exécutez ce SQL :

```sql
-- Désactiver RLS sur toutes les tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE class_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE class_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Public can view active plans" ON subscription_plans;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
```

### 2. Ajouter la colonne password_hash

Exécutez ensuite ce SQL :

```sql
-- Ajouter la colonne password_hash si elle n'existe pas
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
```

### 3. Créer les utilisateurs de démonstration

Finalement, créez les comptes de démo :

```sql
-- Le mot de passe est 'admin123'
INSERT INTO users (email, password_hash, first_name, last_name, role, credits) VALUES
('admin@elaiastudio.ch', '$2b$10$8K0gJ.LZY1pFzOX9Z4sKAOjdwXFhGhYqA5L8NmCXEGZRzVGdQUaQu', 'Admin', 'ELAÏA', 'admin', 0)
ON CONFLICT (email) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role;

-- Le mot de passe est 'client123'
INSERT INTO users (email, password_hash, first_name, last_name, role, credits) VALUES
('marie.dupont@email.com', '$2b$10$5A0Hl9LRzOX9Z4sKAOjdwXFhGhYqA5L8NmCXEGZRzVGdQUaQu', 'Marie', 'Dupont', 'client', 10)
ON CONFLICT (email) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  credits = EXCLUDED.credits;
```

## Comment exécuter ces scripts

1. Connectez-vous à votre tableau de bord Supabase : https://app.supabase.com
2. Sélectionnez votre projet
3. Allez dans l'éditeur SQL (icône SQL dans la barre latérale)
4. Copiez et exécutez chaque script dans l'ordre

## Tester l'application

Après avoir exécuté les scripts :

1. Redémarrez le serveur avec `.\start-simple.ps1`
2. Accédez à http://localhost:5173
3. Connectez-vous avec :
   - Admin : admin@elaiastudio.ch / admin123
   - Client : marie.dupont@email.com / client123

## Notes importantes

- Les politiques RLS sont désactivées car nous utilisons JWT personnalisés
- Si vous souhaitez utiliser Supabase Auth natif plus tard, il faudra reconfigurer les politiques RLS
- Les mots de passe sont hachés avec bcrypt 
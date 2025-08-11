-- SQL de correction pour votre schéma Supabase actuel
-- Exécutez ces commandes dans l'ordre dans l'éditeur SQL de Supabase

-- 1. Ajouter les colonnes manquantes à users (parrainage)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS referral_source VARCHAR(50),
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS referrer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- 2. Ajouter la colonne is_active à user_subscriptions si elle n'existe pas
ALTER TABLE user_subscriptions
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS credits_remaining INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- 3. Vérifier la structure actuelle de subscription_plans
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'subscription_plans'
ORDER BY ordinal_position;

-- 4. Créer des plans d'abonnement (sans la colonne 'type' qui n'existe pas)
-- D'abord, supprimer les plans existants si vous voulez repartir de zéro
DELETE FROM subscription_plans WHERE name IN ('Pack Découverte', 'Pack Essentiel', 'Pack Premium');

-- Ensuite, insérer les nouveaux plans
INSERT INTO subscription_plans (name, description, credits, price, validity, is_active)
VALUES 
  ('Pack Découverte', 'Idéal pour débuter avec 5 crédits', 5, 49.00, '30 jours', true),
  ('Pack Essentiel', 'Pour une pratique régulière - 10 crédits', 10, 89.00, '30 jours', true),
  ('Pack Premium', 'Accès illimité mensuel', 999, 149.00, '30 jours', true);

-- 5. Vérifier que les comptes de démonstration existent
SELECT id, email, role, first_name, last_name 
FROM users 
WHERE email IN ('admin@elaiastudio.ch', 'marie.dupont@email.com');

-- 6. Si la table bookings utilise 'classes' au lieu de 'class_sessions'
-- Vérifier d'abord quelle table existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('classes', 'class_sessions', 'bookings');

-- 7. Si vous n'avez pas de table class_sessions mais avez une table classes
-- Créer class_sessions si nécessaire (optionnel)
CREATE TABLE IF NOT EXISTS class_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_type_id UUID,
  instructor_id UUID REFERENCES users(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  max_capacity INTEGER DEFAULT 10,
  current_capacity INTEGER DEFAULT 0,
  location VARCHAR(255),
  status VARCHAR(20) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 8. Créer la table class_types si elle n'existe pas
CREATE TABLE IF NOT EXISTS class_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 60,
  credits_required INTEGER DEFAULT 1,
  color VARCHAR(7) DEFAULT '#6B46C1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 9. Ajouter quelques types de cours de base
INSERT INTO class_types (name, description, duration_minutes, credits_required)
VALUES 
  ('Pilates Débutant', 'Cours adapté aux débutants', 60, 1),
  ('Pilates Intermédiaire', 'Pour les pratiquants réguliers', 60, 1),
  ('Pilates Avancé', 'Niveau confirmé', 60, 1),
  ('Pilates Prénatal', 'Spécialement conçu pour les femmes enceintes', 45, 1)
ON CONFLICT DO NOTHING;

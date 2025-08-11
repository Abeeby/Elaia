-- IMPORTANT: Exécutez ces commandes dans l'éditeur SQL de Supabase
-- pour ajouter les colonnes de parrainage à votre table users

-- 1. Ajouter les colonnes de parrainage (si elles n'existent pas)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS referral_source VARCHAR(50),
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS referrer_name VARCHAR(255);

-- 2. Ajouter les colonnes manquantes à subscription_plans si nécessaire
ALTER TABLE subscription_plans
ADD COLUMN IF NOT EXISTS duration_days INTEGER DEFAULT 30;

-- 3. Vérifier que les comptes de démonstration existent
SELECT email, role, first_name, last_name 
FROM users 
WHERE email IN ('admin@elaiastudio.ch', 'marie.dupont@email.com');

-- 4. Créer des plans d'abonnement de base (version compatible avec votre schéma)
-- Option A: Si votre table a déjà une colonne 'type'
INSERT INTO subscription_plans (name, description, type, credits, price, validity, is_active)
VALUES 
  ('Pack Découverte', 'Idéal pour débuter avec 5 crédits', 'credits', 5, 49.00, '30 jours', true),
  ('Pack Essentiel', 'Pour une pratique régulière - 10 crédits', 'credits', 10, 89.00, '30 jours', true),
  ('Pack Premium', 'Accès illimité mensuel', 'monthly', 999, 149.00, '30 jours', true)
ON CONFLICT (name) DO NOTHING;

-- Option B: Si votre table n'a PAS de colonne 'type' (exécutez celle-ci à la place)
-- INSERT INTO subscription_plans (name, description, credits, price, validity, is_active)
-- VALUES 
--   ('Pack Découverte', 'Idéal pour débuter avec 5 crédits', 5, 49.00, '30 jours', true),
--   ('Pack Essentiel', 'Pour une pratique régulière - 10 crédits', 10, 89.00, '30 jours', true),
--   ('Pack Premium', 'Accès illimité mensuel', 999, 149.00, '30 jours', true)
-- ON CONFLICT (name) DO NOTHING;

-- 5. Ajouter des crédits aux abonnements existants (si nécessaire)
ALTER TABLE user_subscriptions
ADD COLUMN IF NOT EXISTS credits_remaining INTEGER DEFAULT 0;

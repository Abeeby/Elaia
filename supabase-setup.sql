-- IMPORTANT: Exécutez ces commandes dans l'éditeur SQL de Supabase
-- pour ajouter les colonnes de parrainage à votre table users

-- 1. Ajouter les colonnes de parrainage (si elles n'existent pas)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS referral_source VARCHAR(50),
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS referrer_name VARCHAR(255);

-- 2. Vérifier que les comptes de démonstration existent
SELECT email, role, first_name, last_name 
FROM users 
WHERE email IN ('admin@elaiastudio.ch', 'marie.dupont@email.com');

-- 3. Si vous voulez créer des plans d'abonnement de base
INSERT INTO subscription_plans (name, description, type, credits, duration_days, price)
VALUES 
  ('Pack Découverte', 'Idéal pour débuter', 'package', 5, 30, 49.00),
  ('Pack Essentiel', 'Pour une pratique régulière', 'package', 10, 30, 89.00),
  ('Pack Premium', 'Accès illimité mensuel', 'unlimited', 999, 30, 149.00)
ON CONFLICT (name) DO NOTHING;

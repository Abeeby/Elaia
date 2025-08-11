-- ============================================
-- SCRIPT COMPLET DE CORRECTION POUR VOTRE SUPABASE
-- Exécutez ces commandes dans l'ordre
-- ============================================

-- 1. D'ABORD, vérifier ce qui existe déjà
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Ajouter les colonnes manquantes à users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS referral_source VARCHAR(50),
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS referrer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- 3. Corriger la table user_subscriptions
ALTER TABLE user_subscriptions
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS credits_remaining INTEGER DEFAULT 0;

-- 4. Supprimer et recréer les plans d'abonnement proprement
DELETE FROM subscription_plans WHERE name IN ('Pack Découverte', 'Pack Essentiel', 'Pack Premium');

-- 5. Insérer les plans (sans les colonnes qui n'existent pas)
INSERT INTO subscription_plans (id, name, description, credits, price, validity, is_active)
VALUES 
  (gen_random_uuid(), 'Pack Découverte', 'Idéal pour débuter avec 5 crédits', 5, 49.00, '30 jours', true),
  (gen_random_uuid(), 'Pack Essentiel', 'Pour une pratique régulière - 10 crédits', 10, 89.00, '30 jours', true),
  (gen_random_uuid(), 'Pack Premium', 'Accès illimité mensuel', 999, 149.00, '30 jours', true);

-- 6. Vérifier les comptes créés
SELECT id, email, role, first_name, last_name 
FROM users 
WHERE email IN ('admin@elaiastudio.ch', 'marie.dupont@email.com');

-- 7. Si vous avez une table 'classes' au lieu de 'class_sessions'
-- Vérifier la structure de bookings
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name='bookings';

-- 8. Si nécessaire, créer une vue pour compatibilité
-- (Seulement si vous avez 'classes' mais pas 'class_sessions')
CREATE OR REPLACE VIEW class_sessions AS 
SELECT * FROM classes;

-- 9. Créer la table credit_history si elle n'existe pas
CREATE TABLE IF NOT EXISTS credit_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 10. Vérifier que tout est OK
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 
  'subscription_plans', COUNT(*) FROM subscription_plans
UNION ALL
SELECT 
  'user_subscriptions', COUNT(*) FROM user_subscriptions;

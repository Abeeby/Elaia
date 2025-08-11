-- ============================================
-- SCRIPT FINAL CORRIGÉ POUR VOTRE SUPABASE
-- Adapté à votre schéma avec IDs integer
-- ============================================

-- 1. Ajouter les colonnes manquantes à users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS referral_source VARCHAR(50),
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS referrer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- 2. Corriger la table user_subscriptions
ALTER TABLE user_subscriptions
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS credits_remaining INTEGER DEFAULT 0;

-- 3. Vérifier et supprimer les anciens plans s'ils existent
DELETE FROM subscription_plans WHERE name IN ('Pack Découverte', 'Pack Essentiel', 'Pack Premium');

-- 4. Insérer les plans avec des IDs auto-incrémentés (sans spécifier l'ID)
INSERT INTO subscription_plans (name, description, credits, price, validity, is_active)
VALUES 
  ('Pack Découverte', 'Idéal pour débuter avec 5 crédits', 5, 49.00, '30 jours', true),
  ('Pack Essentiel', 'Pour une pratique régulière - 10 crédits', 10, 89.00, '30 jours', true),
  ('Pack Premium', 'Accès illimité mensuel', 999, 149.00, '30 jours', true);

-- 5. Vérifier que les plans ont été créés
SELECT * FROM subscription_plans WHERE name IN ('Pack Découverte', 'Pack Essentiel', 'Pack Premium');

-- 6. Vérifier les comptes de démonstration
SELECT id, email, role, first_name, last_name 
FROM users 
WHERE email IN ('admin@elaiastudio.ch', 'marie.dupont@email.com');

-- 7. Si vous voulez créer une vue de compatibilité pour class_sessions
-- (si votre table s'appelle 'classes' et non 'class_sessions')
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'class_sessions') 
    AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'classes') THEN
        EXECUTE 'CREATE VIEW class_sessions AS SELECT * FROM classes';
    END IF;
END $$;

-- 8. Créer la table credit_history si elle n'existe pas
CREATE TABLE IF NOT EXISTS credit_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 9. Créer des types de cours de base si la table class_types existe
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'class_types') THEN
        INSERT INTO class_types (name, description, duration_minutes, credits_required)
        VALUES 
          ('Pilates Débutant', 'Cours adapté aux débutants', 60, 1),
          ('Pilates Intermédiaire', 'Pour les pratiquants réguliers', 60, 1),
          ('Pilates Avancé', 'Niveau confirmé', 60, 1),
          ('Pilates Prénatal', 'Spécialement conçu pour les femmes enceintes', 45, 1)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 10. Afficher un résumé de l'état de la base de données
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 
  'subscription_plans', COUNT(*) FROM subscription_plans
UNION ALL
SELECT 
  'user_subscriptions', COUNT(*) FROM user_subscriptions;

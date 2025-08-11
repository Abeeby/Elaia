-- ============================================
-- SCRIPT COMPLET DE CONFIGURATION ELAÏA STUDIO
-- Un seul fichier pour tout configurer
-- ============================================

-- 1. COLONNES UTILISATEURS - Ajouter les champs de parrainage et mot de passe
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS referral_source VARCHAR(50),
ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS referrer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- 2. COLONNES ABONNEMENTS - Corriger la structure
ALTER TABLE user_subscriptions
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS credits_remaining INTEGER DEFAULT 0;

-- 3. NETTOYER LES PLANS EXISTANTS
DELETE FROM subscription_plans WHERE name IN ('Pack Découverte', 'Pack Essentiel', 'Pack Premium');

-- 4. CRÉER LES PLANS D'ABONNEMENT (avec plan_type qui est requis)
INSERT INTO subscription_plans (name, description, plan_type, credits, price, validity)
VALUES 
  ('Pack Découverte', 'Idéal pour débuter - 5 crédits', 'package', 5, 49.00, '30 jours'),
  ('Pack Essentiel', 'Pratique régulière - 10 crédits', 'package', 10, 89.00, '30 jours'),
  ('Pack Premium', 'Accès illimité mensuel', 'unlimited', 999, 149.00, '30 jours');

-- 5. CRÉER LA TABLE CREDIT_HISTORY SI NÉCESSAIRE
CREATE TABLE IF NOT EXISTS credit_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('credit', 'debit', 'purchase', 'refund')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. GÉRER LA COMPATIBILITÉ CLASSES/CLASS_SESSIONS
DO $$
BEGIN
    -- Vérifier si class_sessions existe (table ou vue)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'class_sessions') 
    OR EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'class_sessions') THEN
        RAISE NOTICE 'class_sessions existe déjà';
    ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'classes') THEN
        -- Créer la vue seulement si elle n'existe pas
        EXECUTE 'CREATE OR REPLACE VIEW class_sessions AS SELECT * FROM classes';
        RAISE NOTICE 'Vue class_sessions créée pour compatibilité';
    END IF;
END $$;

-- 7. VÉRIFIER LES COMPTES DE DÉMONSTRATION
DO $$
DECLARE
    admin_exists BOOLEAN;
    client_exists BOOLEAN;
BEGIN
    -- Vérifier si admin existe
    SELECT EXISTS(SELECT 1 FROM users WHERE email = 'admin@elaiastudio.ch') INTO admin_exists;
    IF admin_exists THEN
        RAISE NOTICE 'Compte admin existe: admin@elaiastudio.ch / Admin123!';
    ELSE
        RAISE NOTICE 'Compte admin non trouvé - créez-le via l''application';
    END IF;
    
    -- Vérifier si client test existe
    SELECT EXISTS(SELECT 1 FROM users WHERE email = 'marie.dupont@email.com') INTO client_exists;
    IF client_exists THEN
        RAISE NOTICE 'Compte client existe: marie.dupont@email.com / Client123!';
    ELSE
        RAISE NOTICE 'Compte client non trouvé - créez-le via l''application';
    END IF;
END $$;

-- 8. AFFICHER UN RÉSUMÉ
SELECT 'RÉSUMÉ DE LA BASE DE DONNÉES' as info;
SELECT '----------------------------' as separator;

SELECT 
  'Utilisateurs' as table_name, 
  COUNT(*) as total,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
  COUNT(CASE WHEN role = 'client' THEN 1 END) as clients
FROM users;

SELECT 
  'Plans d''abonnement' as table_name, 
  COUNT(*) as total
FROM subscription_plans;

SELECT 
  'Abonnements actifs' as table_name, 
  COUNT(*) as total
FROM user_subscriptions
WHERE status = 'active' OR (end_date >= CURRENT_DATE AND status IS NULL);

-- 9. AFFICHER LES PLANS CRÉÉS
SELECT 
  name, 
  plan_type, 
  credits, 
  price, 
  validity 
FROM subscription_plans 
ORDER BY price;

-- FIN DU SCRIPT
-- Les comptes de test sont:
-- Admin: admin@elaiastudio.ch / Admin123!
-- Client: marie.dupont@email.com / Client123!

-- ELAÏA Studio - Schéma Supabase (Sans RLS)
-- Supprimer les tables existantes si nécessaire (attention en production !)
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'admin', 'instructor')),
  credits INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table des plans d'abonnement
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('credits', 'monthly')),
  price DECIMAL(10, 2) NOT NULL,
  credits INTEGER,
  max_bookings_per_week INTEGER,
  description TEXT,
  validity VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table des abonnements utilisateurs
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table des types de cours
CREATE TABLE IF NOT EXISTS class_types (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL DEFAULT 55, -- en minutes
  credits_required INTEGER NOT NULL DEFAULT 3,
  max_participants INTEGER NOT NULL DEFAULT 12,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table des sessions de cours
CREATE TABLE IF NOT EXISTS class_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  class_type_id UUID NOT NULL REFERENCES class_types(id),
  instructor_id UUID REFERENCES users(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  available_spots INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_session_id UUID NOT NULL REFERENCES class_sessions(id),
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
  credits_used INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, class_session_id)
);

-- Table des transactions de crédits
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('purchase', 'usage', 'refund', 'bonus')),
  description TEXT,
  reference_id UUID, -- ID de la réservation ou de l'achat
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('subscription', 'credits')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  reference_id UUID, -- ID de l'abonnement ou du pack de crédits
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index pour améliorer les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_class_session_id ON bookings(class_session_id);
CREATE INDEX idx_class_sessions_start_time ON class_sessions(start_time);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);

-- Triggers pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour mettre à jour les crédits d'un utilisateur
CREATE OR REPLACE FUNCTION update_user_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_type VARCHAR,
  p_description TEXT,
  p_reference_id UUID DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  -- Mettre à jour les crédits
  UPDATE users 
  SET credits = credits + p_amount 
  WHERE id = p_user_id;
  
  -- Enregistrer la transaction
  INSERT INTO credit_transactions (user_id, amount, type, description, reference_id)
  VALUES (p_user_id, p_amount, p_type, p_description, p_reference_id);
END;
$$ LANGUAGE plpgsql;

-- Données d'initialisation
-- Plans d'abonnement
INSERT INTO subscription_plans (name, type, price, credits, description, validity) VALUES
('Pack 10 crédits', 'credits', 250, 10, 'Idéal pour commencer', '3 mois'),
('Pack 30 crédits', 'credits', 700, 30, 'Notre best-seller', '6 mois'),
('Pack 50 crédits', 'credits', 1100, 50, 'Pour les pratiquants réguliers', '9 mois');

INSERT INTO subscription_plans (name, type, price, max_bookings_per_week, description) VALUES
('Abonnement 1 fois/semaine', 'monthly', 120, 1, 'Parfait pour débuter'),
('Abonnement 2 fois/semaine', 'monthly', 200, 2, 'Progression régulière'),
('Abonnement Illimité', 'monthly', 280, NULL, 'Accès illimité à tous les cours');

-- Types de cours
INSERT INTO class_types (name, description, duration, credits_required) VALUES
('Pilates Reformer Débutant', 'Cours adapté aux débutants pour découvrir le Pilates Reformer', 55, 3),
('Pilates Reformer Intermédiaire', 'Pour ceux qui maîtrisent les bases', 55, 3),
('Pilates Reformer Avancé', 'Cours intensif pour pratiquants confirmés', 55, 3),
('Pilates Yoga Mat', 'Fusion entre Pilates et Yoga sur tapis', 45, 2);

-- Comptes de démonstration
-- Le mot de passe bcrypt pour 'admin123' est '$2b$10$8K0gJ.LZY1pFzOX9Z4sKAOjdwXFhGhYqA5L8NmCXEGZRzVGdQUaQu'
-- Le mot de passe bcrypt pour 'client123' est '$2b$10$5A0Hl9LRzOX9Z4sKAOjdwXFhGhYqA5L8NmCXEGZRzVGdQUaQu'
INSERT INTO users (email, password_hash, first_name, last_name, role, credits) VALUES
('admin@elaiastudio.ch', '$2b$10$8K0gJ.LZY1pFzOX9Z4sKAOjdwXFhGhYqA5L8NmCXEGZRzVGdQUaQu', 'Admin', 'ELAÏA', 'admin', 0),
('marie.dupont@email.com', '$2b$10$5A0Hl9LRzOX9Z4sKAOjdwXFhGhYqA5L8NmCXEGZRzVGdQUaQu', 'Marie', 'Dupont', 'client', 10); 
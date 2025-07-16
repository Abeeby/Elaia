-- Ajouter la colonne password_hash si elle n'existe pas
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Insérer les utilisateurs de démonstration s'ils n'existent pas
-- Le mot de passe bcrypt pour 'admin123' est '$2b$10$8K0gJ.LZY1pFzOX9Z4sKAOjdwXFhGhYqA5L8NmCXEGZRzVGdQUaQu'
-- Le mot de passe bcrypt pour 'client123' est '$2b$10$5A0Hl9LRzOX9Z4sKAOjdwXFhGhYqA5L8NmCXEGZRzVGdQUaQu'

INSERT INTO users (email, password_hash, first_name, last_name, role, credits) VALUES
('admin@elaiastudio.ch', '$2b$10$8K0gJ.LZY1pFzOX9Z4sKAOjdwXFhGhYqA5L8NmCXEGZRzVGdQUaQu', 'Admin', 'ELAÏA', 'admin', 0)
ON CONFLICT (email) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role;

INSERT INTO users (email, password_hash, first_name, last_name, role, credits) VALUES
('marie.dupont@email.com', '$2b$10$5A0Hl9LRzOX9Z4sKAOjdwXFhGhYqA5L8NmCXEGZRzVGdQUaQu', 'Marie', 'Dupont', 'client', 10)
ON CONFLICT (email) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  credits = EXCLUDED.credits; 
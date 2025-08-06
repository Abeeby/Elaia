-- Script pour réinitialiser la base de données
-- ATTENTION : Ceci supprimera toutes les données !

-- Supprimer les tables dans l'ordre inverse des dépendances
DROP TABLE IF EXISTS waiting_list CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS class_types CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Supprimer les index s'ils existent
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_classes_start_time;
DROP INDEX IF EXISTS idx_bookings_user_id;
DROP INDEX IF EXISTS idx_bookings_class_id; 
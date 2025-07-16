import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration de la base de données
export const DATABASE_URL = process.env.DATABASE_URL || '';

// Helper pour exécuter des requêtes SQL brutes si nécessaire
export async function executeQuery(query: string, params?: any[]) {
  const { data, error } = await supabase.rpc('execute_sql', {
    query,
    params: params || []
  });
  
  if (error) throw error;
  return data;
} 
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Parser l'URL de connexion pour extraire les composants
const DATABASE_URL = process.env.DATABASE_URL || '';
let poolConfig: any = {
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20
};

// Si DATABASE_URL est fournie, l'utiliser
if (DATABASE_URL) {
  // Utiliser directement la connection string
  poolConfig.connectionString = DATABASE_URL;
  
  // Ajouter une configuration spécifique pour Supabase
  if (DATABASE_URL.includes('supabase.co')) {
    poolConfig.ssl = {
      rejectUnauthorized: false,
      require: true
    };
  }
}

// Créer le pool de connexions PostgreSQL
const pool = new Pool(poolConfig);

// Test de connexion avec retry
const testConnection = async () => {
  let retries = 3;
  while (retries > 0) {
    try {
      const client = await pool.connect();
      console.log('✅ Connecté à PostgreSQL (Supabase)');
      client.release();
      break;
    } catch (err) {
      retries--;
      console.error(`❌ Erreur de connexion à PostgreSQL (tentatives restantes: ${retries}):`, err);
      if (retries === 0) {
        console.error('Impossible de se connecter à la base de données après 3 tentatives');
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
};

testConnection();

// Wrapper pour exécuter une requête qui modifie la base
export const dbRun = async (sql: string, params: any[] = []): Promise<any> => {
  try {
    const result = await pool.query(sql, params);
    return {
      lastID: result.rows[0]?.id,
      changes: result.rowCount
    };
  } catch (error) {
    console.error('Erreur dbRun:', error);
    throw error;
  }
};

// Wrapper pour récupérer une seule ligne
export const dbGet = async (sql: string, params: any[] = []): Promise<any> => {
  try {
    const result = await pool.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur dbGet:', error);
    throw error;
  }
};

// Wrapper pour récupérer plusieurs lignes
export const dbAll = async (sql: string, params: any[] = []): Promise<any[]> => {
  try {
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error('Erreur dbAll:', error);
    throw error;
  }
};

// Fonction pour fermer le pool
export const closeDatabase = async () => {
  await pool.end();
  console.log('Pool PostgreSQL fermé');
};

// Export du pool pour des requêtes directes si nécessaire
export { pool }; 
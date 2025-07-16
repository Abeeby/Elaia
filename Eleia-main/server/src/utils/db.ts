// Sélection automatique de la base de données selon l'environnement
const isProduction = process.env.NODE_ENV === 'production';
const usePostgreSQL = isProduction || process.env.DATABASE_URL;

// Import conditionnel selon l'environnement
let dbModule;
try {
  if (usePostgreSQL) {
    console.log('🔄 Utilisation de PostgreSQL');
    dbModule = require('./database-pg');
  } else {
    console.log('🔄 Utilisation de SQLite (développement)');
    dbModule = require('./database');
  }
} catch (error) {
  console.error('❌ Erreur lors du chargement de la base de données:', error);
  // Fallback vers un module de base de données mock
  dbModule = {
    dbRun: async () => ({ lastID: 1, changes: 1 }),
    dbGet: async () => null,
    dbAll: async () => [],
    closeDatabase: async () => {}
  };
}

// Export des fonctions de base de données
export const { dbRun, dbGet, dbAll, closeDatabase } = dbModule; 
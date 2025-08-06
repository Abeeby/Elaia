require('dotenv').config();
const { Pool } = require('pg');

console.log('🧪 Test de connexion Railway PostgreSQL...');
console.log('');

// Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function testConnection() {
  try {
    console.log('🔗 Tentative de connexion...');
    
    const client = await pool.connect();
    console.log('✅ Connexion PostgreSQL Railway réussie !');
    
    // Test simple query
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    console.log('');
    console.log('📊 Informations base de données :');
    console.log('⏰ Heure serveur:', result.rows[0].current_time);
    console.log('🐘 Version PostgreSQL:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);
    
    // Test création table
    console.log('');
    console.log('🛠️ Test création table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_railway (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table de test créée avec succès');
    
    // Test insertion
    await client.query(`
      INSERT INTO test_railway (message) VALUES ($1)
    `, ['Test Railway PostgreSQL OK']);
    console.log('✅ Insertion de test réussie');
    
    // Test lecture
    const testResult = await client.query('SELECT * FROM test_railway ORDER BY created_at DESC LIMIT 1');
    console.log('✅ Lecture de test réussie:', testResult.rows[0].message);
    
    // Nettoyage
    await client.query('DROP TABLE test_railway');
    console.log('✅ Nettoyage effectué');
    
    client.release();
    
    console.log('');
    console.log('🎉 Railway PostgreSQL est prêt pour Elaïa Studio !');
    console.log('');
    console.log('🚀 Prochaines étapes :');
    console.log('1. node start-railway.js (démarrer le serveur)');
    console.log('2. npm run dev (depuis le dossier parent pour le frontend)');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.log('');
    console.log('💡 Vérifications :');
    console.log('1. Railway PostgreSQL est-il bien démarré ?');
    console.log('2. Les variables .env sont-elles correctes ?');
    console.log('3. DATABASE_URL contient-il le bon mot de passe ?');
    console.log('');
    console.log('🔧 Variables actuelles détectées :');
    console.log('PGHOST:', process.env.PGHOST || 'non défini');
    console.log('PGPORT:', process.env.PGPORT || 'non défini');
    console.log('PGUSER:', process.env.PGUSER || 'non défini');
    console.log('PGDATABASE:', process.env.PGDATABASE || 'non défini');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'défini' : 'non défini');
  }
  
  await pool.end();
  process.exit(0);
}

testConnection(); 
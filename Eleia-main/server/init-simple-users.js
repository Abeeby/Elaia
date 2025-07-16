const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function initSimpleUsers() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Initialisation des utilisateurs de test (version simple)...');

    // Vérifier les tables existantes
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Tables existantes:', tables.rows.map(r => r.table_name));

    // Supprimer les anciens utilisateurs de test
    await client.query(`DELETE FROM users WHERE email LIKE '%test.elaia%'`);
    
    // Créer les utilisateurs de test avec des crédits dans la table users directement
    const testUsers = [
      {
        email: 'marie.test.elaia@example.com',
        first_name: 'Marie',
        last_name: 'Dubois',
        role: 'client',
        credits: 15
      },
      {
        email: 'julie.test.elaia@example.com',
        first_name: 'Julie',
        last_name: 'Martin',
        role: 'client',
        credits: 8
      },
      {
        email: 'sophie.test.elaia@example.com',
        first_name: 'Sophie',
        last_name: 'Laurent',
        role: 'client',
        credits: 22
      },
      {
        email: 'claire.test.elaia@example.com',
        first_name: 'Claire',
        last_name: 'Moreau',
        role: 'client',
        credits: 5
      },
      {
        email: 'emma.test.elaia@example.com',
        first_name: 'Emma',
        last_name: 'Rousseau',
        role: 'client',
        credits: 12
      }
    ];

    for (const user of testUsers) {
      // Vérifier d'abord si la colonne credits_remaining existe dans users
      const columns = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users'
      `);
      
      const hasCreditsColumn = columns.rows.some(col => col.column_name === 'credits_remaining');
      
      if (hasCreditsColumn) {
        // Insérer avec credits_remaining
        await client.query(`
          INSERT INTO users (email, first_name, last_name, role, password_hash, credits_remaining, created_at, updated_at)
          VALUES ($1, $2, $3, $4, 'test_hash', $5, NOW(), NOW())
        `, [user.email, user.first_name, user.last_name, user.role, user.credits]);
      } else {
        // Insérer sans credits_remaining
        await client.query(`
          INSERT INTO users (email, first_name, last_name, role, password_hash, created_at, updated_at)
          VALUES ($1, $2, $3, $4, 'test_hash', NOW(), NOW())
        `, [user.email, user.first_name, user.last_name, user.role]);
      }

      console.log(`✅ Utilisateur créé: ${user.first_name} ${user.last_name} (${user.credits} crédits)`);
    }

    // Vérifier les utilisateurs créés
    const result = await client.query(`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.role,
        CASE 
          WHEN EXISTS (SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'credits_remaining')
          THEN u.credits_remaining 
          ELSE 0 
        END as credits_remaining
      FROM users u
      WHERE u.email LIKE '%test.elaia%'
      ORDER BY u.first_name
    `);

    console.log('\n📊 Utilisateurs de test créés:');
    console.table(result.rows);

    console.log('\n🎉 Initialisation terminée avec succès !');
    console.log('💡 Vous pouvez maintenant tester la page admin avec ces utilisateurs');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Exécuter le script
if (require.main === module) {
  initSimpleUsers().catch(console.error);
}

module.exports = { initSimpleUsers }; 
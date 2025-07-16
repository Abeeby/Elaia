const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function initTestUsers() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Initialisation des utilisateurs de test...');

    // Supprimer les anciens utilisateurs de test
    await client.query(`DELETE FROM users WHERE email LIKE '%test.elaia%'`);
    
    // Créer les utilisateurs de test
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
      // Insérer l'utilisateur
      const userResult = await client.query(`
        INSERT INTO users (email, first_name, last_name, role, password_hash, created_at, updated_at)
        VALUES ($1, $2, $3, $4, 'test_hash', NOW(), NOW())
        RETURNING id
      `, [user.email, user.first_name, user.last_name, user.role]);

      const userId = userResult.rows[0].id;

      // Créer un abonnement avec des crédits
      await client.query(`
        INSERT INTO user_subscriptions (user_id, plan_id, credits_remaining, is_active, start_date, end_date, created_at, updated_at)
        VALUES ($1, 1, $2, true, NOW(), NOW() + INTERVAL '1 month', NOW(), NOW())
      `, [userId, user.credits]);

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
        COALESCE(us.credits_remaining, 0) as credits_remaining
      FROM users u
      LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.is_active = true
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
  initTestUsers().catch(console.error);
}

module.exports = { initTestUsers }; 
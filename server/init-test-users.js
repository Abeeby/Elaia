const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUsers() {
  try {
    console.log('🔄 Création des comptes de test...');

    // Hash des mots de passe
    const adminPassword = await bcrypt.hash('admin123', 10);
    const clientPassword = await bcrypt.hash('client123', 10);

    // Créer l'utilisateur admin
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email: 'admin@elaiastudio.ch',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: 'ELAÏA',
        phone: '+41 22 123 45 67'
      }
    });

    if (adminError && !adminError.message.includes('already exists')) {
      throw adminError;
    }

    if (adminData) {
      // Ajouter dans la table users
      await supabase.from('users').upsert({
        id: adminData.user.id,
        email: 'admin@elaiastudio.ch',
        password: adminPassword,
        first_name: 'Admin',
        last_name: 'ELAÏA',
        phone: '+41 22 123 45 67',
        role: 'admin',
        credits: 999,
        created_at: new Date().toISOString()
      });
      console.log('✅ Compte admin créé');
    }

    // Créer l'utilisateur client
    const { data: clientData, error: clientError } = await supabase.auth.admin.createUser({
      email: 'marie.dupont@email.com',
      password: 'client123',
      email_confirm: true,
      user_metadata: {
        first_name: 'Marie',
        last_name: 'Dupont',
        phone: '+41 79 123 45 67'
      }
    });

    if (clientError && !clientError.message.includes('already exists')) {
      throw clientError;
    }

    if (clientData) {
      // Ajouter dans la table users
      await supabase.from('users').upsert({
        id: clientData.user.id,
        email: 'marie.dupont@email.com',
        password: clientPassword,
        first_name: 'Marie',
        last_name: 'Dupont',
        phone: '+41 79 123 45 67',
        role: 'client',
        credits: 10,
        created_at: new Date().toISOString()
      });
      console.log('✅ Compte client créé');

      // Ajouter un abonnement actif pour le client
      await supabase.from('subscriptions').upsert({
        user_id: clientData.user.id,
        plan_id: 'monthly-4',
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        credits_remaining: 4,
        created_at: new Date().toISOString()
      });
      console.log('✅ Abonnement créé pour le client');
    }

    console.log('\n📋 Comptes de test créés avec succès :');
    console.log('👤 Admin : admin@elaiastudio.ch / admin123');
    console.log('👤 Client : marie.dupont@email.com / client123');

  } catch (error) {
    console.error('❌ Erreur lors de la création des comptes de test :', error);
  }
}

createTestUsers(); 
import { supabaseAdmin } from '../config/supabase';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function initSupabase() {
  console.log('🚀 Initialisation des données Supabase pour ELAÏA Studio...');

  try {
    // Créer les comptes de démonstration
    console.log('\n📦 Création des comptes de démonstration...');

    // Compte Admin
    const adminPassword = 'admin123';
    const { data: adminAuth, error: adminAuthError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@elaiastudio.ch',
      password: adminPassword,
      email_confirm: true
    });

    if (!adminAuthError && adminAuth) {
      await supabaseAdmin.from('users').insert({
        id: adminAuth.user.id,
        email: 'admin@elaiastudio.ch',
        first_name: 'Admin',
        last_name: 'ELAÏA',
        role: 'admin',
        credits: 0,
        is_verified: true
      });
      console.log('✅ Compte admin créé');
    } else if (adminAuthError?.message.includes('already registered')) {
      console.log('⚠️  Compte admin existe déjà');
    }

    // Compte Client Demo
    const clientPassword = 'client123';
    const { data: clientAuth, error: clientAuthError } = await supabaseAdmin.auth.admin.createUser({
      email: 'marie.dupont@email.com',
      password: clientPassword,
      email_confirm: true
    });

    if (!clientAuthError && clientAuth) {
      await supabaseAdmin.from('users').insert({
        id: clientAuth.user.id,
        email: 'marie.dupont@email.com',
        first_name: 'Marie',
        last_name: 'Dupont',
        phone: '+41 79 123 45 67',
        address: 'Rue du Lac 12',
        city: 'Genève',
        postal_code: '1201',
        role: 'client',
        credits: 10,
        is_verified: true
      });
      console.log('✅ Compte client créé');
    } else if (clientAuthError?.message.includes('already registered')) {
      console.log('⚠️  Compte client existe déjà');
    }

    // Créer des sessions de cours pour la semaine
    console.log('\n📅 Création des sessions de cours...');
    
    // Récupérer les types de cours
    const { data: classTypes } = await supabaseAdmin
      .from('class_types')
      .select('*')
      .order('name');

    if (classTypes && classTypes.length > 0) {
      const today = new Date();
      const sessions = [];

      // Créer des sessions pour les 7 prochains jours
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() + day);
        
        // Sessions du matin (9h et 10h15)
        if (day % 2 === 0) { // Lundi, Mercredi, Vendredi
          const morningSession1 = new Date(date);
          morningSession1.setHours(9, 0, 0, 0);
          
          sessions.push({
            class_type_id: classTypes[0].id,
            start_time: morningSession1.toISOString(),
            end_time: new Date(morningSession1.getTime() + 55 * 60000).toISOString(),
            available_spots: 12
          });

          const morningSession2 = new Date(date);
          morningSession2.setHours(10, 15, 0, 0);
          
          sessions.push({
            class_type_id: classTypes[1].id,
            start_time: morningSession2.toISOString(),
            end_time: new Date(morningSession2.getTime() + 55 * 60000).toISOString(),
            available_spots: 12
          });
        }

        // Sessions de l'après-midi (17h30 et 18h45)
        if (day !== 0) { // Pas le dimanche
          const afternoonSession1 = new Date(date);
          afternoonSession1.setHours(17, 30, 0, 0);
          
          sessions.push({
            class_type_id: classTypes[1].id,
            start_time: afternoonSession1.toISOString(),
            end_time: new Date(afternoonSession1.getTime() + 55 * 60000).toISOString(),
            available_spots: 12
          });

          const afternoonSession2 = new Date(date);
          afternoonSession2.setHours(18, 45, 0, 0);
          
          sessions.push({
            class_type_id: classTypes[2].id,
            start_time: afternoonSession2.toISOString(),
            end_time: new Date(afternoonSession2.getTime() + 55 * 60000).toISOString(),
            available_spots: 12
          });
        }
      }

      const { error: sessionsError } = await supabaseAdmin
        .from('class_sessions')
        .insert(sessions);

      if (!sessionsError) {
        console.log(`✅ ${sessions.length} sessions de cours créées`);
      } else {
        console.error('❌ Erreur création sessions:', sessionsError);
      }
    }

    console.log('\n✨ Initialisation Supabase terminée !');
    console.log('\n📝 Comptes de démonstration :');
    console.log('   Admin : admin@elaiastudio.ch / admin123');
    console.log('   Client : marie.dupont@email.com / client123');
    console.log('\n🔗 Dashboard Supabase : https://app.supabase.com');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'initialisation :', error);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  initSupabase();
}

export default initSupabase; 
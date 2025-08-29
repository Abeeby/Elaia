import { supabaseAdmin } from '../config/supabase';

export async function initSupabaseTestData() {
  console.log('🚀 Initialisation des données de test ELAÏA Studio...\n');

  try {
    // 1. Créer les comptes utilisateurs dans Supabase Auth
    console.log('📝 Création des comptes utilisateurs...');

    // Note: Les utilisateurs doivent être créés manuellement dans Supabase Auth
    // car nous ne pouvons pas créer des comptes auth depuis le backend

    // 2. Créer les profils utilisateurs
    console.log('👤 Création des profils utilisateurs...');

    // D'abord, récupérer les IDs des utilisateurs existants
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      console.error('❌ Erreur récupération utilisateurs:', authError);
      return;
    }

    const testUser = authUsers.users.find(u => u.email === 'test@elaia-studio.ch');
    const adminUser = authUsers.users.find(u => u.email === 'admin@elaia-studio.ch');

    if (!testUser || !adminUser) {
      console.log('⚠️  Utilisateurs non trouvés. Veuillez créer :');
      console.log('   - test@elaia-studio.ch (client)');
      console.log('   - admin@elaia-studio.ch (admin)');
      return;
    }

    // Créer les profils
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .upsert([
        {
          id: testUser.id,
          email: 'test@elaia-studio.ch',
          first_name: 'Marie',
          last_name: 'Dubois',
          role: 'client',
          credits: 5,
          is_verified: true,
        },
        {
          id: adminUser.id,
          email: 'admin@elaia-studio.ch',
          first_name: 'Admin',
          last_name: 'Elaia',
          role: 'admin',
          credits: 1000,
          is_verified: true,
        }
      ]);

    if (profileError) {
      console.error('❌ Erreur création profils:', profileError);
    } else {
      console.log('✅ Profils utilisateurs créés');
    }

    // 3. Créer des instructeurs de test
    console.log('👨‍🏫 Création des instructeurs...');

    const { data: instructors, error: instructorsError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email: 'sarah.martin@elaia-studio.ch',
          first_name: 'Sarah',
          last_name: 'Martin',
          role: 'instructor',
          credits: 0,
          is_verified: true,
        },
        {
          email: 'julie.dubois@elaia-studio.ch',
          first_name: 'Julie',
          last_name: 'Dubois',
          role: 'instructor',
          credits: 0,
          is_verified: true,
        }
      ])
      .select();

    if (instructorsError) {
      console.error('❌ Erreur création instructeurs:', instructorsError);
    } else {
      console.log('✅ Instructeurs créés');
    }

    // 4. Générer des sessions de cours pour les 30 prochains jours
    console.log('📅 Génération des sessions de cours...');

    const classTypes = [
      'Pilates Reformer Débutant',
      'Pilates Reformer Intermédiaire',
      'Pilates Reformer Avancé',
      'Pilates Yoga Mat',
      'Pilates Yoga Mat Détente'
    ];

    const sessions = [];
    const now = new Date();

    // Générer des cours pour les 30 prochains jours
    for (let day = 0; day < 30; day++) {
      const date = new Date(now);
      date.setDate(now.getDate() + day);

      // Pas de cours le dimanche
      if (date.getDay() === 0) continue;

      // Nombre de cours par jour (4-8 selon le jour)
      const numClasses = date.getDay() === 6 ? 6 : Math.floor(Math.random() * 4) + 5;

      // Créneaux horaires
      const timeSlots = ['09:00', '10:30', '12:00', '14:00', '17:00', '18:30', '19:30'];

      for (let i = 0; i < Math.min(numClasses, timeSlots.length); i++) {
        const timeSlot = timeSlots[i];
        const [hours, minutes] = timeSlot.split(':');

        const startTime = new Date(date);
        startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const endTime = new Date(startTime);
        endTime.setMinutes(startTime.getMinutes() + 55);

        // Sélectionner un type de cours aléatoire
        const classTypeName = classTypes[Math.floor(Math.random() * classTypes.length)];

        // Trouver l'ID du type de cours
        const { data: classType } = await supabaseAdmin
          .from('class_types')
          .select('id')
          .eq('name', classTypeName)
          .single();

        if (classType) {
          // Nombre de places disponibles (8-12)
          const maxParticipants = Math.floor(Math.random() * 5) + 8;

          sessions.push({
            class_type_id: classType.id,
            instructor_id: instructors?.[Math.floor(Math.random() * instructors.length)]?.id,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            available_spots: maxParticipants,
          });
        }
      }
    }

    // Insérer les sessions en lots
    const batchSize = 50;
    for (let i = 0; i < sessions.length; i += batchSize) {
      const batch = sessions.slice(i, i + batchSize);
      const { error: sessionError } = await supabaseAdmin
        .from('class_sessions')
        .insert(batch);

      if (sessionError) {
        console.error(`❌ Erreur batch ${i/batchSize + 1}:`, sessionError);
      }
    }

    console.log(`✅ ${sessions.length} sessions de cours créées`);

    // 5. Ajouter quelques réservations de test
    console.log('📋 Création de réservations de test...');

    // Récupérer quelques sessions récentes
    const { data: recentSessions } = await supabaseAdmin
      .from('class_sessions')
      .select('id')
      .gte('start_time', new Date().toISOString())
      .limit(5);

    if (recentSessions && recentSessions.length > 0) {
      const bookings = recentSessions.slice(0, 3).map(session => ({
        user_id: testUser.id,
        class_session_id: session.id,
        status: 'confirmed',
        credits_used: Math.floor(Math.random() * 2) + 2, // 2-3 crédits
      }));

      const { error: bookingError } = await supabaseAdmin
        .from('bookings')
        .insert(bookings);

      if (bookingError) {
        console.error('❌ Erreur création réservations:', bookingError);
      } else {
        console.log('✅ Réservations de test créées');
      }
    }

    console.log('\n🎉 Initialisation terminée avec succès !');
    console.log('\n📊 Données créées :');
    console.log(`   • 2 utilisateurs (${testUser.email}, ${adminUser.email})`);
    console.log(`   • 2 instructeurs`);
    console.log(`   • ${sessions.length} sessions de cours`);
    console.log(`   • Quelques réservations de test`);

    console.log('\n🔐 Comptes de connexion :');
    console.log('   Client : test@elaia-studio.ch / Test123!');
    console.log('   Admin  : admin@elaia-studio.ch / Admin123!');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  }
}

// Script pour exécuter l'initialisation
if (require.main === module) {
  initSupabaseTestData().then(() => {
    console.log('\n✨ Script terminé');
    process.exit(0);
  }).catch((error) => {
    console.error('Erreur fatale:', error);
    process.exit(1);
  });
}

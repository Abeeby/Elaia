// Script d'initialisation des données de démonstration
const axios = require('axios');
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function initDemoData() {
  try {
    console.log('🚀 Initialisation des données de démonstration...\n');

    // 1. Créer un administrateur
    console.log('👤 Création de l\'administrateur...');
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('users')
      .upsert({
        email: 'admin@elaia-studio.ch',
        password_hash: adminPassword,
        first_name: 'Admin',
        last_name: 'ELAÏA',
        role: 'admin',
        credits: 1000,
        is_verified: true
      }, { onConflict: 'email' })
      .select()
      .single();

    if (adminError && !adminError.message.includes('duplicate')) {
      console.error('Erreur création admin:', adminError);
    } else {
      console.log('✅ Administrateur créé:', adminData?.email);
    }

    // 2. Créer des types de cours
    console.log('\n📚 Création des types de cours...');
    const classTypes = [
      {
        name: 'Pilates Reformer',
        slug: 'pilates-reformer',
        description: 'Pilates sur machine Reformer pour un travail en profondeur',
        duration_minutes: 55,
        credits_required: 3,
        max_participants: 8,
        color: '#7C8471'
      },
      {
        name: 'Pilates Mat',
        slug: 'pilates-mat',
        description: 'Pilates au sol avec petit matériel',
        duration_minutes: 55,
        credits_required: 2,
        max_participants: 12,
        color: '#C9B7A4'
      },
      {
        name: 'Yoga Flow',
        slug: 'yoga-flow',
        description: 'Yoga dynamique pour renforcer et assouplir',
        duration_minutes: 60,
        credits_required: 2,
        max_participants: 12,
        color: '#B5985A'
      }
    ];

    for (const classType of classTypes) {
      const { error } = await supabaseAdmin
        .from('class_types')
        .upsert(classType, { onConflict: 'slug' });
      
      if (!error) {
        console.log(`✅ Type de cours créé: ${classType.name}`);
      }
    }

    // 3. Créer des plans d'abonnement
    console.log('\n💳 Création des plans d\'abonnement...');
    const plans = [
      // Packs de crédits
      {
        name: 'Pack Découverte',
        type: 'credits',
        price: 125,
        credits: 5,
        validity_days: 60,
        description: 'Idéal pour tester différents cours'
      },
      {
        name: 'Pack 10 crédits',
        type: 'credits',
        price: 240,
        credits: 10,
        validity_days: 90,
        description: 'Pour une pratique occasionnelle'
      },
      {
        name: 'Pack 30 crédits',
        type: 'credits',
        price: 660,
        credits: 30,
        validity_days: 180,
        description: 'Pour une pratique régulière'
      },
      {
        name: 'Pack 50 crédits',
        type: 'credits',
        price: 1000,
        credits: 50,
        validity_days: 270,
        description: 'Pour une pratique intensive'
      },
      {
        name: 'Pack Annuel',
        type: 'credits',
        price: 2200,
        credits: 100,
        validity_days: 365,
        description: 'Maximum d\'économies pour les assidus'
      },
      // Abonnements mensuels
      {
        name: 'Casual',
        type: 'monthly',
        price: 180,
        max_bookings_per_week: 2,
        description: 'Parfait pour commencer en douceur'
      },
      {
        name: 'Premium+',
        type: 'monthly',
        price: 320,
        max_bookings_per_week: 5,
        description: 'Pour une pratique intensive'
      },
      {
        name: 'Duo',
        type: 'monthly',
        price: 450,
        max_bookings_per_week: 3,
        description: 'Formule spéciale pour 2 personnes'
      }
    ];

    for (const plan of plans) {
      const { error } = await supabaseAdmin
        .from('subscription_plans')
        .upsert(plan, { onConflict: 'name' });
      
      if (!error) {
        console.log(`✅ Plan créé: ${plan.name}`);
      }
    }

    // 4. Créer des sessions de cours pour la semaine
    console.log('\n📅 Création des sessions de cours...');
    const { data: classTypesData } = await supabaseAdmin
      .from('class_types')
      .select('id, name');

    if (classTypesData && classTypesData.length > 0) {
      const sessions = [];
      const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const timeSlots = ['09:00', '10:30', '12:15', '17:00', '18:30', '20:00'];
      
      // Générer des sessions pour les 30 prochains jours
      for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0) continue; // Pas de cours le dimanche
        
        // 2-4 cours par jour
        const coursesPerDay = dayOfWeek === 6 ? 2 : Math.floor(Math.random() * 3) + 2;
        
        for (let i = 0; i < coursesPerDay; i++) {
          const classType = classTypesData[Math.floor(Math.random() * classTypesData.length)];
          const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
          
          const [hours, minutes] = timeSlot.split(':');
          const startTime = new Date(date);
          startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + 55);
          
          sessions.push({
            class_type_id: classType.id,
            instructor_name: ['Sophie Martin', 'Julie Dubois', 'Emma Bernard'][Math.floor(Math.random() * 3)],
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            max_participants: classType.name.includes('Reformer') ? 8 : 12,
            current_participants: Math.floor(Math.random() * 5),
            status: 'scheduled',
            room: classType.name.includes('Reformer') ? 'Salle Reformer' : 'Salle Yoga'
          });
        }
      }
      
      // Insérer les sessions par batch
      for (let i = 0; i < sessions.length; i += 50) {
        const batch = sessions.slice(i, i + 50);
        const { error } = await supabaseAdmin
          .from('class_sessions')
          .insert(batch);
        
        if (!error) {
          console.log(`✅ ${batch.length} sessions créées`);
        }
      }
    }

    console.log('\n✨ Initialisation terminée avec succès !');
    console.log('\n📝 Informations de connexion :');
    console.log('   Admin : admin@elaia-studio.ch / Admin123!');
    console.log('   Test : test@elaia-studio.ch / Test123!');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

initDemoData(); 
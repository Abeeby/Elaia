// Test de réservation de cours
const axios = require('axios');

async function testBooking() {
  try {
    console.log('🎯 Test de réservation de cours...\n');

    // 1. Connexion utilisateur test
    console.log('1️⃣ Connexion utilisateur test...');
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'test@elaia-studio.ch',
      password: 'Test123!'
    });

    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log('✅ Connecté en tant que:', user.email);
    console.log('💳 Crédits disponibles:', user.credits);

    // 2. Récupérer le planning
    console.log('\n2️⃣ Récupération du planning...');
    const scheduleResponse = await axios.get('http://localhost:5001/api/classes/schedule');
    const classes = scheduleResponse.data.classes;
    
    console.log('📅 Nombre de sessions disponibles:', classes.length);
    
    if (classes.length === 0) {
      console.log('❌ Aucune session disponible');
      return;
    }

    // 3. Sélectionner le premier cours disponible
    const firstClass = classes[0];
    console.log('\n3️⃣ Cours sélectionné:');
    console.log('   - Type:', firstClass.class_types.name);
    console.log('   - Date:', new Date(firstClass.start_time).toLocaleString('fr-FR'));
    console.log('   - Crédits requis:', firstClass.class_types.credits_required);
    console.log('   - Places:', firstClass.current_participants, '/', firstClass.max_participants);

    // 4. Réserver le cours
    console.log('\n4️⃣ Tentative de réservation...');
    try {
      const bookingResponse = await axios.post(
        'http://localhost:5001/api/bookings/book',
        { class_id: firstClass.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('✅ Réservation réussie !');
      console.log('   - ID:', bookingResponse.data.booking.id);
      console.log('   - Message:', bookingResponse.data.message);
    } catch (bookingError) {
      if (bookingError.response?.status === 400) {
        console.log('⚠️ Réservation impossible:', bookingError.response.data.message);
      } else {
        throw bookingError;
      }
    }

    // 5. Vérifier mes réservations
    console.log('\n5️⃣ Vérification de mes réservations...');
    const myBookingsResponse = await axios.get(
      'http://localhost:5001/api/bookings/my-bookings',
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('📋 Mes réservations:', myBookingsResponse.data.bookings.length);
    
    if (myBookingsResponse.data.bookings.length > 0) {
      const lastBooking = myBookingsResponse.data.bookings[0];
      console.log('   - Dernière réservation:', {
        cours: lastBooking.class_sessions?.class_types?.name,
        date: new Date(lastBooking.class_sessions?.start_time).toLocaleString('fr-FR'),
        statut: lastBooking.status,
        crédits: lastBooking.credits_used
      });
    }

    console.log('\n✨ Test terminé avec succès !');

  } catch (error) {
    console.error('\n❌ Erreur:', error.response?.data || error.message);
  }
}

testBooking(); 
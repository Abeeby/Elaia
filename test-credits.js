// Script de test pour les crédits - Elaia Studio
// Lance ce script avec : node test-credits.js

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Token d'admin pour les tests
const ADMIN_TOKEN = 'test-token-admin-123';
const CLIENT_TOKEN = 'test-token-client-456';

async function testCreditsAPI() {
  console.log('🧪 === TEST DES CRÉDITS ELAIA STUDIO ===\n');
  
  try {
    // 1. Vérifier l'état actuel des crédits
    console.log('📊 1. État actuel des crédits :');
    
    // Crédits admin
    const adminCredits = await axios.get(`${API_BASE}/credits/mine`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
    console.log('   - Admin:', adminCredits.data.credits_remaining, 'crédits');
    
    // Crédits client
    const clientCredits = await axios.get(`${API_BASE}/credits/mine`, {
      headers: { Authorization: `Bearer ${CLIENT_TOKEN}` }
    });
    console.log('   - Client Marie:', clientCredits.data.credits_remaining, 'crédits\n');
    
    // 2. Obtenir la liste des utilisateurs (admin seulement)
    console.log('👥 2. Liste des utilisateurs :');
    const users = await axios.get(`${API_BASE}/admin/users`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
    users.data.forEach(user => {
      console.log(`   - ${user.first_name} ${user.last_name} (${user.email}): ${user.credits_remaining} crédits`);
    });
    console.log('');
    
    // 3. Ajouter 10 crédits au client Marie
    console.log('💰 3. Ajout de 10 crédits à Marie Dupont :');
    const addCredits = await axios.post(`${API_BASE}/admin/add-credits`, {
      userEmail: 'marie.dupont@email.com',
      credits: 10
    }, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
    console.log('   ✅', addCredits.data.message);
    console.log('   📈 Nouveaux crédits Marie:', addCredits.data.credits_remaining, '\n');
    
    // 4. Vérifier les nouveaux soldes
    console.log('📊 4. Nouveaux soldes après ajout :');
    
    const newClientCredits = await axios.get(`${API_BASE}/credits/mine`, {
      headers: { Authorization: `Bearer ${CLIENT_TOKEN}` }
    });
    console.log('   - Client Marie:', newClientCredits.data.credits_remaining, 'crédits');
    
    // 5. Test d'ajout de crédits à l'admin
    console.log('\n💰 5. Ajout de 5 crédits à l\'admin :');
    const addAdminCredits = await axios.post(`${API_BASE}/admin/add-credits`, {
      userEmail: 'admin@elaiastudio.ch',
      credits: 5
    }, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
    console.log('   ✅', addAdminCredits.data.message);
    console.log('   📈 Nouveaux crédits Admin:', addAdminCredits.data.credits_remaining);
    
    console.log('\n🎉 Tous les tests sont passés avec succès !');
    
  } catch (error) {
    if (error.response) {
      console.error('❌ Erreur API:', error.response.status, error.response.data);
    } else {
      console.error('❌ Erreur:', error.message);
    }
  }
}

// Test de connexion et authentification
async function testAuth() {
  console.log('\n🔐 === TEST DE CONNEXION ===\n');
  
  try {
    // Test connexion admin
    const adminLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@elaiastudio.ch',
      password: 'admin123'
    });
    console.log('✅ Connexion admin réussie');
    console.log('   Token:', adminLogin.data.token);
    
    // Test connexion client
    const clientLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'marie.dupont@email.com',
      password: 'client123'
    });
    console.log('✅ Connexion client réussie');
    console.log('   Token:', clientLogin.data.token);
    
  } catch (error) {
    console.error('❌ Erreur connexion:', error.response?.data || error.message);
  }
}

// Fonction principale
async function main() {
  // Attendre un peu pour s'assurer que le serveur est démarré
  console.log('⏳ Attente du démarrage du serveur...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    // Test de santé du serveur
    await axios.get(`${API_BASE}/health`);
    console.log('✅ Serveur accessible\n');
  } catch (error) {
    console.error('❌ Serveur non accessible. Assurez-vous qu\'il est démarré avec "npm run dev"');
    return;
  }
  
  await testAuth();
  await testCreditsAPI();
}

// Lancer les tests
main().catch(console.error); 
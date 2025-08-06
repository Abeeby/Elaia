// Script rapide pour ajouter des crédits - Elaia Studio
// Usage: node add-credits-quick.js

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
const ADMIN_TOKEN = 'test-token-admin-123';

async function addCreditsQuick() {
  console.log('🚀 === AJOUT RAPIDE DE CRÉDITS ===\n');
  
  try {
    // 1. Vérifier que le serveur fonctionne
    console.log('🔍 Vérification du serveur...');
    await axios.get(`${API_BASE}/health`);
    console.log('✅ Serveur accessible\n');
    
    // 2. Voir les crédits actuels
    console.log('📊 Crédits actuels :');
    
    const adminCredits = await axios.get(`${API_BASE}/credits/mine`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
    console.log(`   - Admin: ${adminCredits.data.credits_remaining} crédits`);
    
    const clientCredits = await axios.get(`${API_BASE}/credits/mine`, {
      headers: { Authorization: `Bearer test-token-client-456` }
    });
    console.log(`   - Marie: ${clientCredits.data.credits_remaining} crédits\n`);
    
    // 3. Ajouter 20 crédits à l'admin (vous)
    console.log('💰 Ajout de 20 crédits à l\'admin...');
    const addAdminCredits = await axios.post(`${API_BASE}/admin/add-credits`, {
      userEmail: 'admin@elaiastudio.ch',
      credits: 20
    }, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
    console.log(`✅ ${addAdminCredits.data.message}`);
    console.log(`📈 Nouveaux crédits Admin: ${addAdminCredits.data.credits_remaining}\n`);
    
    // 4. Ajouter 30 crédits à Marie
    console.log('💰 Ajout de 30 crédits à Marie...');
    const addClientCredits = await axios.post(`${API_BASE}/admin/add-credits`, {
      userEmail: 'marie.dupont@email.com',
      credits: 30
    }, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    });
    console.log(`✅ ${addClientCredits.data.message}`);
    console.log(`📈 Nouveaux crédits Marie: ${addClientCredits.data.credits_remaining}\n`);
    
    // 5. Vérification finale
    console.log('🎉 === CRÉDITS AJOUTÉS AVEC SUCCÈS ===');
    console.log('');
    console.log('🔄 Rechargez votre page web pour voir les nouveaux crédits !');
    console.log('👉 Ou allez sur : http://localhost:3000/admin/users');
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    console.log('\n💡 Conseils :');
    console.log('1. Assurez-vous que l\'app est lancée avec "npm run dev"');
    console.log('2. Attendez quelques secondes que le serveur démarre');
    console.log('3. Vérifiez http://localhost:5000/api/health');
  }
}

// Lancer le script
addCreditsQuick(); 
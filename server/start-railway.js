#!/usr/bin/env node

console.log('🚄 Démarrage du serveur Elaïa Studio avec Railway PostgreSQL...');
console.log('');

// Vérifier si le fichier .env existe
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.log('❌ Fichier .env non trouvé !');
  console.log('');
  console.log('📋 Pour configurer Railway PostgreSQL :');
  console.log('');
  console.log('1️⃣ Dans Railway Dashboard :');
  console.log('   - Cliquez sur votre base PostgreSQL');
  console.log('   - Allez dans l\'onglet "Variables" ou "Connect"');
  console.log('');
  console.log('2️⃣ Créez un fichier .env dans server/ avec :');
  console.log('');
  console.log('DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/railway');
  console.log('PGHOST=containers-us-west-xxx.railway.app');
  console.log('PGPORT=5432');
  console.log('PGUSER=postgres');
  console.log('PGPASSWORD=your-railway-password');
  console.log('PGDATABASE=railway');
  console.log('JWT_SECRET=elaia-studio-secret-2024');
  console.log('NODE_ENV=development');
  console.log('PORT=5000');
  console.log('');
  console.log('3️⃣ Relancez avec: node start-railway.js');
  process.exit(1);
}

console.log('✅ Fichier .env trouvé !');

// Charger le serveur Railway
try {
  require('./src/index-railway.js');
} catch (error) {
  console.error('❌ Erreur démarrage serveur:', error.message);
  console.log('');
  console.log('💡 Solutions :');
  console.log('1. Vérifiez vos variables DATABASE_URL dans .env');
  console.log('2. Assurez-vous que Railway PostgreSQL est actif');
  console.log('3. Testez la connexion avec: npm run test-db');
  process.exit(1);
} 
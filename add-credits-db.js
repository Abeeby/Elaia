// Script pour ajouter des crédits directement dans la base SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'database.sqlite');

console.log('🔧 AJOUT DE CRÉDITS DANS LA BASE DE DONNÉES SQLite');
console.log('📍 Chemin de la base :', dbPath);

// Connexion à la base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur connexion base :', err.message);
    return;
  }
  console.log('✅ Connexion à la base SQLite réussie');
});

// Fonction pour ajouter des crédits
function addCreditsToUsers() {
  console.log('\n🎯 Ajout de crédits aux utilisateurs...');
  
  // 1. Vérifier la structure des tables
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('❌ Erreur lecture tables :', err);
      return;
    }
    
    console.log('📊 Tables disponibles :');
    tables.forEach(table => console.log(`   - ${table.name}`));
    
    // 2. Chercher la table des utilisateurs
    const userTables = tables.filter(t => 
      t.name.toLowerCase().includes('user') || 
      t.name.toLowerCase().includes('client') ||
      t.name.toLowerCase().includes('subscription') ||
      t.name.toLowerCase().includes('credit')
    );
    
    console.log('\n🔍 Tables potentielles pour les crédits :');
    userTables.forEach(table => {
      console.log(`   📋 ${table.name}`);
      
      // Afficher la structure de chaque table
      db.all(`PRAGMA table_info(${table.name})`, (err, columns) => {
        if (!err) {
          console.log(`      Colonnes: ${columns.map(c => c.name).join(', ')}`);
          
          // Si c'est une table d'utilisateurs, afficher le contenu
          if (table.name.toLowerCase().includes('user')) {
            db.all(`SELECT * FROM ${table.name} LIMIT 5`, (err, rows) => {
              if (!err && rows.length > 0) {
                console.log(`      Données exemple:`, rows[0]);
              }
            });
          }
        }
      });
    });
    
    // 3. Tentative d'ajout de crédits si possible
    setTimeout(() => {
      console.log('\n💰 Tentative d\'ajout de crédits...');
      
      // Essayer différentes structures possibles
      const updateQueries = [
        "UPDATE users SET credits = 50 WHERE email = 'admin@elaiastudio.ch'",
        "UPDATE users SET credits_remaining = 50 WHERE email = 'admin@elaiastudio.ch'",
        "UPDATE clients SET credits = 50 WHERE email = 'admin@elaiastudio.ch'",
        "UPDATE subscriptions SET credits_remaining = 50 WHERE user_email = 'admin@elaiastudio.ch'",
        "INSERT OR REPLACE INTO credits (user_email, amount) VALUES ('admin@elaiastudio.ch', 50)",
      ];
      
      updateQueries.forEach((query, index) => {
        db.run(query, (err) => {
          if (!err) {
            console.log(`✅ Requête ${index + 1} réussie : ${query}`);
          }
        });
      });
      
      // Pareil pour Marie
      const marieQueries = [
        "UPDATE users SET credits = 67 WHERE email = 'marie.dupont@email.com'",
        "UPDATE users SET credits_remaining = 67 WHERE email = 'marie.dupont@email.com'",
        "UPDATE clients SET credits = 67 WHERE email = 'marie.dupont@email.com'",
        "UPDATE subscriptions SET credits_remaining = 67 WHERE user_email = 'marie.dupont@email.com'",
        "INSERT OR REPLACE INTO credits (user_email, amount) VALUES ('marie.dupont@email.com', 67)",
      ];
      
      marieQueries.forEach((query, index) => {
        db.run(query, (err) => {
          if (!err) {
            console.log(`✅ Requête Marie ${index + 1} réussie : ${query}`);
          }
        });
      });
      
      console.log('\n🔄 Redémarrez l\'application pour voir les changements !');
      console.log('📱 Puis reconnectez-vous sur http://localhost:3000');
      
      db.close();
    }, 2000);
  });
}

// Lancer le script
addCreditsToUsers(); 
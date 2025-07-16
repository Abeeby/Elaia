// Script pour lister toutes les tables et leur contenu
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'elaia-studio.db');

console.log('🔍 EXPLORATION COMPLÈTE BASE DE DONNÉES');
console.log(`📂 Chemin: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur connexion :', err.message);
    return;
  }
  console.log('✅ Connexion base réussie');
  
  // Lister toutes les tables
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('❌ Erreur lecture tables :', err);
      return;
    }
    
    console.log('\n📊 TOUTES LES TABLES DISPONIBLES :');
    tables.forEach(table => {
      console.log(`   📋 ${table.name}`);
    });
    
    // Examiner chaque table une par une
    console.log('\n🔍 CONTENU DES TABLES :');
    
    let completedTables = 0;
    const totalTables = tables.length;
    
    if (totalTables === 0) {
      console.log('❌ Aucune table trouvée dans la base de données');
      db.close();
      return;
    }
    
    tables.forEach(table => {
      // Obtenir la structure de la table
      db.all(`PRAGMA table_info(${table.name})`, (err, columns) => {
        if (err) {
          console.error(`❌ Erreur structure ${table.name}:`, err);
          return;
        }
        
        console.log(`\n📋 TABLE: ${table.name}`);
        console.log(`   Colonnes: ${columns.map(c => `${c.name} (${c.type})`).join(', ')}`);
        
        // Obtenir quelques lignes d'exemple
        db.all(`SELECT * FROM ${table.name} LIMIT 3`, (err, rows) => {
          if (err) {
            console.error(`❌ Erreur données ${table.name}:`, err);
          } else {
            console.log(`   Lignes: ${rows.length}`);
            if (rows.length > 0) {
              console.log(`   Exemple:`, JSON.stringify(rows[0], null, 2));
            }
          }
          
          completedTables++;
          if (completedTables === totalTables) {
            console.log('\n✅ Exploration terminée');
            db.close();
          }
        });
      });
    });
  });
}); 
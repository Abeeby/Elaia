// Script pour examiner la structure de la base SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'database.sqlite');

console.log('🔍 EXAMEN STRUCTURE BASE DE DONNÉES');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur :', err.message);
    return;
  }
  console.log('✅ Connexion base SQLite réussie');
  
  // Examiner la structure de user_subscriptions
  db.all("PRAGMA table_info(user_subscriptions)", (err, columns) => {
    if (err) {
      console.error('❌ Erreur :', err);
      return;
    }
    
    console.log('\n📊 Structure table user_subscriptions :');
    columns.forEach(col => {
      console.log(`   - ${col.name} (${col.type})`);
    });
    
    // Examiner le contenu existant
    db.all("SELECT * FROM user_subscriptions LIMIT 3", (err, rows) => {
      if (!err) {
        console.log('\n📋 Contenu actuel (3 premiers) :');
        rows.forEach((row, index) => {
          console.log(`   Ligne ${index + 1}:`, row);
        });
      }
      
      // Maintenant, créer la bonne requête
      const correctColumns = columns.map(c => c.name);
      console.log('\n💡 Colonnes disponibles :', correctColumns.join(', '));
      
      // Script corrigé
      console.log('\n🛠️  SCRIPT CORRIGÉ POUR VOS CRÉDITS :');
      
      if (correctColumns.includes('plan_id')) {
        console.log('✅ Utiliser plan_id au lieu de subscription_plan_id');
      }
      
      // Créer la requête correcte basée sur les colonnes disponibles
      let insertQuery = "INSERT INTO user_subscriptions (";
      let values = "VALUES (";
      let params = [];
      
      if (correctColumns.includes('user_id')) {
        insertQuery += "user_id, ";
        values += "?, ";
        params.push("user_id");
      }
      
      if (correctColumns.includes('plan_id')) {
        insertQuery += "plan_id, ";
        values += "?, ";
        params.push("plan_id");
      } else if (correctColumns.includes('subscription_plan_id')) {
        insertQuery += "subscription_plan_id, ";
        values += "?, ";
        params.push("subscription_plan_id");
      }
      
      if (correctColumns.includes('credits_remaining')) {
        insertQuery += "credits_remaining, ";
        values += "?, ";
        params.push("credits_remaining");
      }
      
      if (correctColumns.includes('status')) {
        insertQuery += "status, ";
        values += "?, ";
        params.push("status");
      }
      
      // Nettoyer la requête
      insertQuery = insertQuery.slice(0, -2) + ") ";
      values = values.slice(0, -2) + ")";
      
      console.log(`\n📝 Requête corrigée :`);
      console.log(`${insertQuery}${values}`);
      console.log(`📋 Paramètres : ${params.join(', ')}`);
      
      db.close();
    });
  });
}); 
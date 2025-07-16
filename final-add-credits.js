// Script final pour ajouter des crédits avec la structure correcte
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'database.sqlite');

console.log('🎯 AJOUT FINAL DES CRÉDITS');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur :', err.message);
    return;
  }
  console.log('✅ Connexion base SQLite réussie');
  
  // 1. Récupérer les IDs des utilisateurs
  db.all("SELECT id, email, first_name FROM users WHERE email IN ('admin@elaiastudio.ch', 'marie.dupont@email.com')", (err, users) => {
    if (err) {
      console.error('❌ Erreur :', err);
      return;
    }
    
    console.log('\n👥 Utilisateurs trouvés :');
    users.forEach(user => {
      console.log(`   - ${user.first_name} (${user.email}) - ID: ${user.id}`);
    });
    
    // 2. Récupérer un plan avec crédits (Plan 50 crédits)
    db.get("SELECT id, name, credits FROM subscription_plans WHERE credits >= 50 LIMIT 1", (err, plan) => {
      if (err || !plan) {
        console.error('❌ Aucun plan trouvé :', err);
        return;
      }
      
      console.log(`\n💰 Plan utilisé : ${plan.name} (${plan.credits} crédits) - ID: ${plan.id}`);
      
      const adminUser = users.find(u => u.email === 'admin@elaiastudio.ch');
      const marieUser = users.find(u => u.email === 'marie.dupont@email.com');
      
      // 3. Supprimer les anciens abonnements
      db.run("DELETE FROM user_subscriptions WHERE user_id IN (?, ?)", [adminUser?.id, marieUser?.id], (err) => {
        if (err) {
          console.log('⚠️  Pas d\'anciens abonnements à supprimer');
        } else {
          console.log('🗑️  Anciens abonnements supprimés');
        }
        
        // 4. Créer abonnement ADMIN avec 50 crédits
        if (adminUser) {
          const adminData = [
            adminUser.id,                                           // user_id
            plan.id,                                               // plan_id
            new Date().toISOString().split('T')[0],                // start_date
            new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // end_date (90 jours)
            50,                                                    // credits_remaining
            1,                                                     // is_active (true)
            new Date().toISOString()                               // created_at
          ];
          
          db.run(`INSERT INTO user_subscriptions 
                  (user_id, plan_id, start_date, end_date, credits_remaining, is_active, created_at) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`, adminData, (err) => {
            if (err) {
              console.error('❌ Erreur admin :', err);
            } else {
              console.log('✅ ADMIN : 50 crédits ajoutés !');
            }
          });
        }
        
        // 5. Créer abonnement MARIE avec 67 crédits
        if (marieUser) {
          const marieData = [
            marieUser.id,                                          // user_id
            plan.id,                                               // plan_id
            new Date().toISOString().split('T')[0],                // start_date
            new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // end_date
            67,                                                    // credits_remaining
            1,                                                     // is_active (true)
            new Date().toISOString()                               // created_at
          ];
          
          db.run(`INSERT INTO user_subscriptions 
                  (user_id, plan_id, start_date, end_date, credits_remaining, is_active, created_at) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`, marieData, (err) => {
            if (err) {
              console.error('❌ Erreur Marie :', err);
            } else {
              console.log('✅ MARIE : 67 crédits ajoutés !');
            }
          });
        }
        
        // 6. Vérification finale après un délai
        setTimeout(() => {
          db.all(`SELECT u.email, u.first_name, us.credits_remaining, sp.name as plan_name
                  FROM user_subscriptions us 
                  JOIN users u ON us.user_id = u.id 
                  JOIN subscription_plans sp ON us.plan_id = sp.id
                  WHERE us.is_active = 1`, (err, results) => {
            if (!err && results.length > 0) {
              console.log('\n🎉 SUCCÈS ! ABONNEMENTS CRÉÉS :');
              results.forEach(result => {
                console.log(`   ✅ ${result.first_name} (${result.email}): ${result.credits_remaining} crédits`);
              });
            } else {
              console.log('\n⚠️  Aucun abonnement actif trouvé');
            }
            
            console.log('\n🔄 REDÉMARREZ L\'APPLICATION MAINTENANT !');
            console.log('📱 Allez sur http://localhost:3000 et reconnectez-vous');
            console.log('\n💡 Vous devriez voir vos crédits dans le tableau de bord !');
            
            db.close();
          });
        }, 1000);
      });
    });
  });
}); 
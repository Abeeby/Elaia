// Script pour corriger les crédits et créer les abonnements manquants
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'elaia-studio.db');

console.log('🔧 CORRECTION DES CRÉDITS - ELAÏA STUDIO');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur connexion :', err.message);
    return;
  }
  console.log('✅ Connexion base réussie');
  
  // 1. Vérifier les utilisateurs existants
  db.all("SELECT id, email, first_name, last_name FROM users", (err, users) => {
    if (err) {
      console.error('❌ Erreur lecture users :', err);
      return;
    }
    
    console.log('\n👥 Utilisateurs trouvés :');
    users.forEach(user => {
      console.log(`   - ${user.first_name} ${user.last_name} (${user.email}) - ID: ${user.id}`);
    });
    
    // 2. Vérifier les plans disponibles
    db.all("SELECT * FROM subscription_plans WHERE type = 'credits'", (err, plans) => {
      if (err) {
        console.error('❌ Erreur lecture plans :', err);
        return;
      }
      
      console.log('\n💰 Plans crédits disponibles :');
      plans.forEach(plan => {
        console.log(`   - ID ${plan.id}: ${plan.name} (${plan.credits} crédits)`);
      });
      
      // 3. Trouver le plan approprié (30 ou 50 crédits)
      const adminPlan = plans.find(p => p.credits >= 30) || plans[0];
      const mariePlan = plans.find(p => p.credits >= 50) || plans[0];
      
      if (!adminPlan) {
        console.error('❌ Aucun plan trouvé');
        db.close();
        return;
      }
      
      console.log(`\n🎯 Plan sélectionné: ${adminPlan.name} (ID: ${adminPlan.id})`);
      
      // 4. Créer les abonnements pour admin et Marie
      const adminUser = users.find(u => u.email === 'admin@elaiastudio.ch');
      const marieUser = users.find(u => u.email === 'marie.dupont@email.com');
      
      if (adminUser) {
        console.log(`\n👨‍💼 Création abonnement pour Admin (${adminUser.email})...`);
        
        // Supprimer l'ancien abonnement s'il existe
        db.run("DELETE FROM user_subscriptions WHERE user_id = ?", [adminUser.id], (err) => {
          // Créer le nouvel abonnement
          db.run(`
            INSERT INTO user_subscriptions 
            (user_id, plan_id, start_date, end_date, credits_remaining, is_active, created_at)
            VALUES (?, ?, date('now'), date('now', '+12 months'), 60, 1, datetime('now'))
          `, [adminUser.id, adminPlan.id], function(err) {
            if (err) {
              console.error('❌ Erreur admin:', err);
            } else {
              console.log('✅ Abonnement admin créé avec 60 crédits');
            }
          });
        });
      }
      
      if (marieUser) {
        console.log(`\n👩 Création abonnement pour Marie (${marieUser.email})...`);
        
        // Supprimer l'ancien abonnement s'il existe
        db.run("DELETE FROM user_subscriptions WHERE user_id = ?", [marieUser.id], (err) => {
          // Créer le nouvel abonnement
          db.run(`
            INSERT INTO user_subscriptions 
            (user_id, plan_id, start_date, end_date, credits_remaining, is_active, created_at)
            VALUES (?, ?, date('now'), date('now', '+12 months'), 77, 1, datetime('now'))
          `, [marieUser.id, mariePlan.id], function(err) {
            if (err) {
              console.error('❌ Erreur Marie:', err);
            } else {
              console.log('✅ Abonnement Marie créé avec 77 crédits');
            }
          });
        });
      }
      
      // 5. Vérification finale après 1 seconde
      setTimeout(() => {
        db.all(`
          SELECT u.email, u.first_name, us.credits_remaining, sp.name as plan_name
          FROM user_subscriptions us 
          JOIN users u ON us.user_id = u.id 
          JOIN subscription_plans sp ON us.plan_id = sp.id
          WHERE us.is_active = 1
        `, (err, results) => {
          if (!err) {
            console.log('\n🎉 ABONNEMENTS ACTIFS CRÉÉS :');
            results.forEach(result => {
              console.log(`   ✅ ${result.first_name} (${result.email}): ${result.credits_remaining} crédits`);
            });
          }
          
          console.log('\n🔄 RECHARGEZ VOTRE PAGE WEB MAINTENANT !');
          console.log('📱 Les crédits devraient apparaître dans le dashboard');
          
          db.close();
        });
      }, 1000);
    });
  });
}); 
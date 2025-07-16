// Script pour ajouter des abonnements avec crédits dans la base SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'database.sqlite');

console.log('🎯 AJOUT D\'ABONNEMENTS AVEC CRÉDITS');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur :', err.message);
    return;
  }
  console.log('✅ Connexion base SQLite réussie');
  
  // 1. Vérifier les utilisateurs existants
  db.all("SELECT id, email, first_name, last_name, role FROM users", (err, users) => {
    if (err) {
      console.error('❌ Erreur lecture users :', err);
      return;
    }
    
    console.log('\n👥 Utilisateurs trouvés :');
    users.forEach(user => {
      console.log(`   - ${user.first_name} ${user.last_name} (${user.email}) - ${user.role}`);
    });
    
    // 2. Vérifier les plans d'abonnement disponibles
    db.all("SELECT * FROM subscription_plans WHERE credits > 0", (err, plans) => {
      if (err) {
        console.error('❌ Erreur lecture plans :', err);
        return;
      }
      
      console.log('\n💰 Plans avec crédits disponibles :');
      plans.forEach(plan => {
        console.log(`   - ${plan.name}: ${plan.credits} crédits (${plan.price} CHF)`);
      });
      
      // 3. Créer des abonnements pour admin et Marie
      const adminUser = users.find(u => u.email === 'admin@elaiastudio.ch');
      const marieUser = users.find(u => u.email === 'marie.dupont@email.com');
      const plan50 = plans.find(p => p.credits >= 50);
      
      if (adminUser && plan50) {
        // Supprimer ancien abonnement admin
        db.run("DELETE FROM user_subscriptions WHERE user_id = ?", [adminUser.id], (err) => {
          if (!err) {
            // Créer nouvel abonnement admin avec 50 crédits
            const adminSubscription = {
              user_id: adminUser.id,
              subscription_plan_id: plan50.id,
              credits_remaining: 50,
              start_date: new Date().toISOString(),
              end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 jours
              status: 'active',
              auto_renew: false
            };
            
            db.run(`INSERT INTO user_subscriptions 
              (user_id, subscription_plan_id, credits_remaining, start_date, end_date, status, auto_renew) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [adminSubscription.user_id, adminSubscription.subscription_plan_id, 
               adminSubscription.credits_remaining, adminSubscription.start_date,
               adminSubscription.end_date, adminSubscription.status, adminSubscription.auto_renew],
              (err) => {
                if (err) {
                  console.error('❌ Erreur création abonnement admin :', err);
                } else {
                  console.log('✅ Abonnement admin créé : 50 crédits');
                }
              });
          }
        });
      }
      
      if (marieUser && plan50) {
        // Supprimer ancien abonnement Marie
        db.run("DELETE FROM user_subscriptions WHERE user_id = ?", [marieUser.id], (err) => {
          if (!err) {
            // Créer nouvel abonnement Marie avec 67 crédits
            const marieSubscription = {
              user_id: marieUser.id,
              subscription_plan_id: plan50.id,
              credits_remaining: 67,
              start_date: new Date().toISOString(),
              end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active',
              auto_renew: false
            };
            
            db.run(`INSERT INTO user_subscriptions 
              (user_id, subscription_plan_id, credits_remaining, start_date, end_date, status, auto_renew) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [marieSubscription.user_id, marieSubscription.subscription_plan_id, 
               marieSubscription.credits_remaining, marieSubscription.start_date,
               marieSubscription.end_date, marieSubscription.status, marieSubscription.auto_renew],
              (err) => {
                if (err) {
                  console.error('❌ Erreur création abonnement Marie :', err);
                } else {
                  console.log('✅ Abonnement Marie créé : 67 crédits');
                }
              });
          }
        });
      }
      
      // 4. Vérification finale
      setTimeout(() => {
        db.all(`SELECT u.email, u.first_name, us.credits_remaining, sp.name as plan_name
                FROM user_subscriptions us 
                JOIN users u ON us.user_id = u.id 
                JOIN subscription_plans sp ON us.subscription_plan_id = sp.id
                WHERE us.status = 'active'`, (err, results) => {
          if (!err) {
            console.log('\n🎉 ABONNEMENTS ACTIFS AVEC CRÉDITS :');
            results.forEach(result => {
              console.log(`   ✅ ${result.first_name} (${result.email}): ${result.credits_remaining} crédits - Plan: ${result.plan_name}`);
            });
          }
          
          console.log('\n🔄 REDÉMARREZ MAINTENANT L\'APPLICATION !');
          console.log('📱 Puis reconnectez-vous sur http://localhost:3000');
          
          db.close();
        });
      }, 1000);
    });
  });
}); 
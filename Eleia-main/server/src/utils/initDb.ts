import { initDatabase, dbRun, closeDatabase } from './database';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    console.log('🚀 Initialisation de la base de données...');
    
    // Initialiser les tables
    await initDatabase();
    
    console.log('📝 Insertion des données de démonstration...');
    
    // Créer un utilisateur admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    await dbRun(`
      INSERT OR IGNORE INTO users (email, password, first_name, last_name, role, is_verified)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['admin@elaiastudio.ch', adminPassword, 'Admin', 'Elaia', 'admin', 1]);
    
    // Créer des utilisateurs de test
    const clientPassword = await bcrypt.hash('client123', 10);
    await dbRun(`
      INSERT OR IGNORE INTO users (email, password, first_name, last_name, phone, role, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, ['marie.dupont@email.com', clientPassword, 'Marie', 'Dupont', '0791234567', 'client', 1]);
    
    // Insérer les types de cours
    await dbRun(`
      INSERT OR IGNORE INTO class_types (name, credits_required, duration_minutes, max_participants, description)
      VALUES 
        ('Pilates Reformer', 3, 60, 6, 'Cours de Pilates sur machine Reformer'),
        ('Pilates Yoga Mat', 2, 60, 10, 'Cours de Pilates et Yoga sur tapis')
    `);
    
    // Insérer les formules d'abonnement
    await dbRun(`
      INSERT OR IGNORE INTO subscription_plans (name, type, credits, price, duration_days, description)
      VALUES 
        ('Pack 10 Crédits', 'credits', 10, 110, 30, 'Valable 1 mois'),
        ('Pack 30 Crédits', 'credits', 30, 314, 90, 'Valable 3 mois - 5% de réduction'),
        ('Pack 50 Crédits', 'credits', 50, 495, 180, 'Valable 6 mois - 10% de réduction'),
        ('Pack 70 Crédits', 'credits', 70, 655, 365, 'Valable 12 mois - 15% de réduction'),
        ('Abonnement Illimité', 'monthly', NULL, 350, 30, 'Accès illimité aux séances PF et PYM'),
        ('2 fois par semaine', 'monthly', NULL, 220, 30, 'Maximum 2 cours PF ou 3 cours PYM par semaine'),
        ('1 fois par semaine', 'monthly', NULL, 120, 30, 'Maximum 1 cours PF ou 2 cours PYM par semaine')
    `);
    
    // Insérer l'offre Welcome
    await dbRun(`
      INSERT OR IGNORE INTO promotions (code, description, discount_type, discount_value, is_active)
      VALUES ('WELCOME', '1 séance achetée + 2 offertes', 'fixed', 45, 1)
    `);
    
    // Créer des cours pour les 7 prochains jours
    const today = new Date();
    const timeSlots = ['09:00', '10:30', '12:00', '17:00', '18:30', '20:00'];
    
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() + day);
      
      for (const timeSlot of timeSlots) {
        const [hours, minutes] = timeSlot.split(':');
        const startTime = new Date(date);
        startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1);
        
        // Alterner entre Pilates Reformer et Pilates Yoga Mat
        const classTypeId = Math.random() > 0.6 ? 1 : 2;
        const maxParticipants = classTypeId === 1 ? 6 : 10;
        
        await dbRun(`
          INSERT INTO classes (class_type_id, start_time, end_time, max_participants)
          VALUES (?, ?, ?, ?)
        `, [classTypeId, startTime.toISOString(), endTime.toISOString(), maxParticipants]);
      }
    }
    
    console.log('✅ Base de données initialisée avec succès !');
    console.log('\n📋 Comptes de démonstration créés :');
    console.log('   Admin : admin@elaiastudio.ch / admin123');
    console.log('   Client : marie.dupont@email.com / client123');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
  } finally {
    closeDatabase();
  }
};

// Exécuter le script
seedDatabase(); 
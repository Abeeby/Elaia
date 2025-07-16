# 🎉 ELAÏA Studio - Système Fonctionnel

## ✅ État Actuel

### 🚀 Services Actifs
- **Frontend** : http://localhost:5173 (ou 5174)
- **Backend API** : http://localhost:5001/api
- **Base de données** : Supabase Cloud

### 👥 Comptes de Test

#### Client Standard
- **Email** : test@elaia-studio.ch
- **Mot de passe** : Test123!
- **Crédits** : 5 crédits de bienvenue
- **Rôle** : Client

#### Administrateur
- **Email** : admin@elaia-studio.ch
- **Mot de passe** : Admin123!
- **Crédits** : 1000
- **Rôle** : Admin

## 🎨 Design Ohemia

Le site utilise maintenant le design inspiré de ohemia.de avec :
- Palette de couleurs : Cream, Charcoal, Sage, Sand
- Typographie : Playfair Display, Inter, Lora
- Animations subtiles et transitions fluides
- Navigation épurée sans onglet "Cours"

## 💡 Fonctionnalités Disponibles

### Pour les Visiteurs
- ✅ Page d'accueil avec design Ohemia
- ✅ Planning des cours (18 sessions disponibles)
- ✅ Page de tarifs avec 3 onglets
- ✅ Inscription avec 5 crédits offerts
- ✅ Connexion sécurisée

### Pour les Clients Connectés
- ✅ Tableau de bord personnel
- ✅ Profil utilisateur
- ✅ Visualisation des crédits
- ✅ Accès au planning
- ❌ Réservation de cours (en développement)
- ❌ Achat de crédits (en développement)

### Pour les Administrateurs
- ✅ Accès admin avec 1000 crédits
- ❌ Dashboard admin (en développement)
- ❌ Gestion des utilisateurs (en développement)

## 📊 Données Disponibles

### Types de Cours
- **Pilates Reformer** : 3 crédits (8 places max)
- **Pilates Mat** : 2 crédits (12 places max)
- **Yoga Flow** : 2 crédits (12 places max)

### Plans Tarifaires
- **Pack Découverte** : 5 crédits - 125 CHF
- **Pack 10 crédits** : 240 CHF
- **Pack 30 crédits** : 660 CHF
- **Pack 50 crédits** : 1000 CHF
- **Pack Annuel** : 100 crédits - 2200 CHF

### Abonnements Mensuels
- **Casual** : 2 fois/semaine - 180 CHF
- **Premium+** : 5 fois/semaine - 320 CHF
- **Duo** : 3 fois/semaine - 450 CHF (pour 2)

## 🛠️ Scripts de Démarrage

### Démarrer l'Application Complète
```powershell
.\start-supabase.ps1
```

### Démarrer Séparément
```powershell
# Backend
cd server
npm run dev:supabase

# Frontend
cd client
npm run dev
```

## 📝 Notes Importantes

1. **Crédits de Bienvenue** : Chaque nouvel inscrit reçoit 5 crédits
2. **Sessions de Cours** : 18 sessions générées pour les 30 prochains jours
3. **Authentification** : JWT avec expiration 30 jours
4. **Base de Données** : Supabase avec RLS désactivé

## 🔧 Prochaines Étapes

1. Implémenter la réservation de cours
2. Activer l'achat de crédits en ligne
3. Créer le dashboard administrateur
4. Ajouter les notifications par email
5. Implémenter le système de liste d'attente

## 📱 Test Rapide

1. Allez sur http://localhost:5173
2. Cliquez sur "Inscription"
3. Créez un compte (vous recevrez 5 crédits)
4. Explorez le planning et les tarifs
5. Testez la connexion/déconnexion

---

**Système prêt à l'emploi !** 🎉 
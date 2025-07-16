# 🎯 Guide complet - Elaia Studio : Lancement et Gestion des Crédits

## 🚀 Lancement de l'application en local

### 1. Installation des dépendances
```bash
cd elaia-app
npm run install:all
```

### 2. Lancement de l'application
```bash
npm run dev
```

Cette commande lance :
- Le serveur backend sur `http://localhost:5000`
- Le client frontend sur `http://localhost:3000` (ou un autre port disponible)

### 3. Vérification que tout fonctionne
- Backend : http://localhost:5000/api/health
- Frontend : http://localhost:3000

## 🔐 Comptes de test

### Admin
- **Email :** `admin@elaiastudio.ch`
- **Mot de passe :** `admin123`
- **Crédits initiaux :** 24

### Client
- **Email :** `marie.dupont@email.com`
- **Mot de passe :** `client123`
- **Crédits initiaux :** 37

## 💰 Nouvelles fonctionnalités de gestion des crédits

J'ai ajouté plusieurs routes API pour gérer les crédits :

### 1. Ajouter des crédits (Admin seulement)
```http
POST /api/admin/add-credits
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "userEmail": "marie.dupont@email.com",
  "credits": 10
}
```

### 2. Voir la liste des utilisateurs et leurs crédits (Admin seulement)
```http
GET /api/admin/users
Authorization: Bearer {admin-token}
```

### 3. Voir ses propres crédits
```http
GET /api/credits/mine
Authorization: Bearer {user-token}
```

### 4. Recharger les crédits (pour démo)
```http
POST /api/credits/reload
Authorization: Bearer {user-token}
```

## 🧪 Test des fonctionnalités

### Via le script de test (recommandé)
1. Lancez l'application avec `npm run dev`
2. Dans un autre terminal, lancez : `node test-credits.js`

### Via l'interface web
1. Connectez-vous en tant qu'admin
2. Allez dans la section administration
3. Vous pourrez voir et gérer les crédits des utilisateurs

### Via les outils de développement (curl/Postman)

#### Exemple 1 : Se connecter comme admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@elaiastudio.ch", "password": "admin123"}'
```

#### Exemple 2 : Ajouter 15 crédits à Marie
```bash
curl -X POST http://localhost:5000/api/admin/add-credits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token-admin-123" \
  -d '{"userEmail": "marie.dupont@email.com", "credits": 15}'
```

#### Exemple 3 : Voir les crédits de Marie
```bash
curl -X GET http://localhost:5000/api/credits/mine \
  -H "Authorization: Bearer test-token-client-456"
```

#### Exemple 4 : Voir tous les utilisateurs (admin)
```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer test-token-admin-123"
```

## 📊 Fonctionnalités existantes

L'application simule déjà :

### Pour les clients
- ✅ Connexion/déconnexion
- ✅ Voir son solde de crédits
- ✅ Réserver des cours (avec déduction de crédits)
- ✅ Voir l'historique des réservations
- ✅ Voir le planning des cours

### Pour les admins
- ✅ Connexion admin
- ✅ Voir les statistiques du studio
- ✅ Voir les réservations récentes
- ✅ **NOUVEAU :** Ajouter des crédits aux clients
- ✅ **NOUVEAU :** Voir la liste des utilisateurs et leurs crédits

## 🎨 Interface utilisateur

L'interface web permet de :
- Se connecter avec les comptes de test
- Naviguer entre les différentes sections
- Voir les crédits en temps réel
- Effectuer des réservations

## 🔧 Développement

### Structure des crédits
Les crédits sont actuellement stockés en mémoire dans les variables :
- `adminCredits` : Crédits de l'admin
- `clientCredits` : Crédits du client Marie

### Coût des cours
- **Pilates Reformer :** 3 crédits
- **Pilates Yoga Mat :** 2 crédits

### Extensions possibles
1. **Base de données :** Remplacer les variables par une vraie BDD
2. **Plus d'utilisateurs :** Ajouter d'autres clients de test
3. **Historique :** Tracker l'historique des ajouts de crédits
4. **Notifications :** Alerter quand les crédits sont bas
5. **Expiration :** Gérer l'expiration des crédits

## 🚨 Dépannage

### L'application ne démarre pas
```bash
# Vérifier les ports utilisés
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Nettoyer et réinstaller
npm run install:all
```

### Erreur de CORS
L'application est configurée avec des CORS très permissifs pour le développement.

### Problème de tokens
Les tokens sont codés en dur pour la démo :
- Admin: `test-token-admin-123`
- Client: `test-token-client-456`

---

## 🎉 Prêt à utiliser !

Votre application Elaia Studio est maintenant prête avec la gestion complète des crédits ! 

Lancez `npm run dev` et connectez-vous avec les comptes de test pour explorer toutes les fonctionnalités. 